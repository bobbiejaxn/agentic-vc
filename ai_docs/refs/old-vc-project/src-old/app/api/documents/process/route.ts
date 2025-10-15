import { NextRequest, NextResponse } from "next/server";
import { documentProcessor } from "@/lib/ai/document-processor";
import { DocumentService } from "@/lib/database/documents";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getWebSocketManager } from "@/lib/websocket/server";
import { supabaseStorageService } from "@/lib/storage/supabase-storage";
import { DevAuthBypass } from "@/lib/auth/dev-bypass";
import { DocumentProcessResponse, DocumentType } from "@/lib/types/documents";
import {
  ProcessDocumentRequestSchema,
  ExtractedDataSchema,
} from "@/lib/validation/schemas";
import {
  validateFileUpload,
  createValidationErrorResponse,
} from "@/lib/validation/middleware";

export async function POST(request: NextRequest) {
  try {
    let userId: string;
    let userEmail: string;
    let userFullName: string;

    // Check for development bypass
    const devUserId = request.headers.get("x-dev-user-id");
    if (devUserId && DevAuthBypass.isDevUser(devUserId)) {
      userId = devUserId;
      const devUser = DevAuthBypass.getDevUserById(devUserId);
      userEmail = devUser?.email || "dev@test.local";
      userFullName = devUser?.fullName || "Dev User";
    } else {
      // Normal authentication flow
      const cookieStore = await cookies();
      const supabase = createServerComponentClient({
        cookies: () => cookieStore,
      });
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      userId = user.id;
      userEmail = user.email || "";
      userFullName = user.user_metadata?.full_name || user.email || "User";
    }

    // Ensure user exists in our database
    try {
      const { UserService } = await import("@/lib/database/users");
      await UserService.ensureUserExists(userId, {
        email: userEmail,
        fullName: userFullName,
        role: "angel",
      });
    } catch (error) {
      console.error("Error ensuring user exists:", error);
      // Continue anyway - the user creation might have failed but we can still try to process
    }

    // Ensure default portfolio exists for user
    try {
      const { PortfolioService } = await import("@/lib/database/portfolios");
      await PortfolioService.ensureDefaultPortfolio(userId);
    } catch (error) {
      console.error("Error ensuring default portfolio exists:", error);
      // Continue anyway
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const documentType = formData.get("documentType") as string;
    const portfolioId = formData.get("portfolioId") as string;
    const ownershipPercentage = formData.get("ownershipPercentage") as string;

    // Basic validation
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!documentType) {
      return NextResponse.json(
        { error: "Document type required" },
        { status: 400 }
      );
    }

    // Validate document type
    const validTypes = [
      "fund_report",
      "cap_table",
      "financial_statement",
      "other",
    ];
    if (!validTypes.includes(documentType)) {
      return NextResponse.json(
        { error: "Invalid document type" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only PDF, Excel, and Word documents are allowed.",
        },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Validate ownership percentage if provided
    let finalOwnershipPercentage: number | undefined;
    if (ownershipPercentage) {
      const ownershipValue = parseFloat(ownershipPercentage);
      if (isNaN(ownershipValue) || ownershipValue < 0 || ownershipValue > 100) {
        return NextResponse.json(
          { error: "Ownership percentage must be between 0 and 100." },
          { status: 400 }
        );
      }
      finalOwnershipPercentage = ownershipValue;
    }

    // Get default portfolio if no portfolio specified or if portfolioId is not a valid UUID
    let finalPortfolioId = portfolioId;

    // Check if portfolioId is a valid UUID format, if not, use default portfolio
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!finalPortfolioId || !uuidRegex.test(finalPortfolioId)) {
      try {
        const { PortfolioService } = await import("@/lib/database/portfolios");
        const defaultPortfolio = await PortfolioService.ensureDefaultPortfolio(
          userId
        );
        finalPortfolioId = defaultPortfolio.id;
      } catch (error) {
        console.error("Error getting default portfolio:", error);
        // Continue without portfolio
        finalPortfolioId = undefined;
      }
    }

    // Upload file to Supabase Storage
    const uploadResult = await supabaseStorageService.uploadFile(file, userId);

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: `File upload failed: ${uploadResult.error}` },
        { status: 500 }
      );
    }

    // Create document record in database
    const documentRecord = await DocumentService.createDocument(userId, {
      name: file.name,
      type: documentType,
      portfolioId: finalPortfolioId || undefined,
      fileSize: file.size.toString(),
      mimeType: file.type,
      filePath: uploadResult.filePath, // Store the file path
      ownershipPercentage: finalOwnershipPercentage,
    });

    // Update status to processing
    await DocumentService.updateDocumentStatus(documentRecord.id, "processing");

    // Send real-time update for processing start
    const wsManager = getWebSocketManager();
    if (wsManager) {
      wsManager.sendDocumentUpdate(userId, documentRecord.id, {
        documentName: file.name,
        status: "processing",
        progress: 0,
        message: "AI is processing the document...",
      });
    }

    // Process document
    const processingRequest = {
      file,
      documentType: documentType as any,
      portfolioId: portfolioId || undefined,
      userId: userId,
    };

    // Process document with AI (real or mock based on configuration)
    const result = await documentProcessor.processDocument(processingRequest);

    if (!result.success) {
      // Update document status to error
      await DocumentService.updateDocumentStatus(
        documentRecord.id,
        "error",
        undefined,
        result.error
      );

      // Send real-time update for error
      const wsManager = getWebSocketManager();
      if (wsManager) {
        wsManager.sendDocumentUpdate(userId, documentRecord.id, {
          documentName: file.name,
          status: "error",
          progress: 100,
          message: "Document processing failed",
          errorDetails: result.error,
        });
      }

      return NextResponse.json(
        { error: result.error || "Document processing failed" },
        { status: 500 }
      );
    }

    // TODO: Add extracted data validation here
    // const extractedDataValidation = ExtractedDataSchema.safeParse(result.extractedData);

    // Update document with extracted data
    console.log("💾 Updating document status to completed...");
    console.log(
      "📊 Extracted data keys:",
      Object.keys(result.extractedData || {})
    );
    console.log("📊 Fund metrics:", {
      fundSize: result.extractedData?.fundSize,
      fundNAV: result.extractedData?.fundNAV,
      cumulativeCalledCapital: result.extractedData?.cumulativeCalledCapital,
      personalCommitment: result.extractedData?.personalCommitment,
      personalCalledCapital: result.extractedData?.personalCalledCapital,
      personalNAV: result.extractedData?.personalNAV,
    });

    // Debug: Check if ADK service was called and what it returned
    console.log("🔍 Debug - Document processor result:", {
      hasExtractedData: !!result.extractedData,
      extractedDataType: typeof result.extractedData,
      processorUsed: result.processor || "unknown",
      processingTime: result.processingTime || "unknown",
    });

    // Debug: Check personal LP fields specifically
    const personalFields = [
      "personalCommitment",
      "personalCalledCapital",
      "personalNAV",
      "personalDistributions",
      "personalOwnership",
      "personalMOIC",
      "personalIRR",
    ];
    const personalData = personalFields.reduce((acc, field) => {
      acc[field] = result.extractedData?.[field];
      return acc;
    }, {} as any);
    console.log("👤 Personal LP data extracted:", personalData);

    try {
      await DocumentService.updateDocumentStatus(
        documentRecord.id,
        "completed",
        result.extractedData
      );
      console.log("✅ Document status updated to completed successfully");
    } catch (updateError) {
      console.error("❌ Failed to update document status:", updateError);
      throw new Error(`Database update failed: ${updateError}`);
    }

    // Send real-time update for completion
    if (wsManager) {
      wsManager.sendDocumentUpdate(userId, documentRecord.id, {
        documentName: file.name,
        status: "completed",
        progress: 100,
        message: "Document processed successfully",
        extractedData: result.extractedData,
        processingTime: result.processingTime,
      });
    }

    const response: DocumentProcessResponse = {
      success: true,
      data: {
        documentId: documentRecord.id,
        extractedData: result.extractedData,
        processingTime: result.processingTime,
        status: "completed",
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Document processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
