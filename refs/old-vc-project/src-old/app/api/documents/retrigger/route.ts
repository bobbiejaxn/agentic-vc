import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { DocumentService } from "@/lib/database/documents";
import { documentProcessor } from "@/lib/ai/document-processor";
import { DevAuthBypass } from "@/lib/auth/dev-bypass";

export async function POST(request: NextRequest) {
  try {
    let userId: string;

    // Check for development bypass
    const devUserId = request.headers.get("x-dev-user-id");
    if (devUserId && DevAuthBypass.isDevUser(devUserId)) {
      userId = devUserId;
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
    }

    // Parse request body
    const { documentId } = await request.json();

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID required" },
        { status: 400 }
      );
    }

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(documentId)) {
      return NextResponse.json(
        { error: "Invalid document ID format" },
        { status: 400 }
      );
    }

    // Get the document
    const document = await DocumentService.getDocumentById(documentId);

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Check if user owns the document
    if (document.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update status to processing
    await DocumentService.updateDocumentStatus(documentId, "processing");

    // Check if we have a file path to work with
    if (!document.filePath) {
      return NextResponse.json(
        {
          error:
            "Original document file not available. Please re-upload the document to retrigger processing.",
          requiresReupload: true,
        },
        { status: 400 }
      );
    }

    // Download the file from Supabase Storage
    const { supabaseStorageService } = await import(
      "@/lib/storage/supabase-storage"
    );
    const downloadResult = await supabaseStorageService.downloadFile(
      document.filePath
    );

    if (!downloadResult.success || !downloadResult.file) {
      return NextResponse.json(
        {
          error:
            "Failed to download original document file. Please re-upload the document.",
          requiresReupload: true,
        },
        { status: 400 }
      );
    }

    // Create a proper file object with the downloaded content
    const originalFile = new File([downloadResult.file], document.name, {
      type: document.mimeType || "application/octet-stream",
    });

    // Process document with AI using the original content
    const processingRequest = {
      file: originalFile,
      documentType: document.type as any,
      portfolioId: document.portfolioId,
      userId: userId,
    };

    // Use real processing to extract data with updated prompts
    console.log("🔄 Starting document reprocessing for:", documentId);
    const result = await documentProcessor.processDocument(processingRequest);
    console.log("🔄 Document processing result:", {
      success: result.success,
      error: result.error,
    });

    if (!result.success) {
      console.error("❌ Document processing failed:", result.error);
      // Update document status to error
      await DocumentService.updateDocumentStatus(
        documentId,
        "error",
        undefined,
        result.error
      );

      return NextResponse.json(
        { error: result.error || "Document processing failed" },
        { status: 500 }
      );
    }

    // Update document with extracted data
    await DocumentService.updateDocumentStatus(
      documentId,
      "completed",
      result.extractedData
    );

    return NextResponse.json({
      success: true,
      data: {
        documentId: documentId,
        extractedData: result.extractedData,
        processingTime: result.processingTime,
      },
      message: "Document reprocessed successfully",
    });
  } catch (error) {
    console.error("❌ Document retrigger error:", error);
    console.error(
      "❌ Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
