import { NextRequest, NextResponse } from "next/server";
import { documentProcessor } from "@/lib/ai/document-processor";
import { DocumentService } from "@/lib/database/documents";
import { supabaseStorageService } from "@/lib/storage/supabase-storage";

/**
 * Full test endpoint for document processing with database storage
 * This tests the complete pipeline: upload -> process -> store in Supabase
 * FOR TESTING PURPOSES ONLY - DO NOT USE IN PRODUCTION
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const documentType = formData.get("documentType") as string;
    const portfolioId = formData.get("portfolioId") as string;

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

    // Validate file type (including text files for testing)
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain", // Allow text files for testing
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only PDF, Excel, Word, and text documents are allowed.",
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

    const mockUserId = "550e8400-e29b-41d4-a716-446655440000"; // Test user ID
    console.log(
      `📄 Processing test document: ${file.name} (${file.size} bytes)`
    );
    console.log(`👤 Mock User ID: ${mockUserId}`);
    console.log(`📋 Document type: ${documentType}`);
    console.log(`📁 Portfolio ID: ${portfolioId || "none"}`);

    try {
      // Step 1: Upload file to Supabase Storage
      console.log("📤 Step 1: Uploading file to Supabase Storage...");
      const uploadResult = await supabaseStorageService.uploadFile(
        file,
        mockUserId
      );

      if (!uploadResult.success) {
        console.error("❌ File upload failed:", uploadResult.error);
        return NextResponse.json(
          { error: `File upload failed: ${uploadResult.error}` },
          { status: 500 }
        );
      }
      console.log(
        "✅ File uploaded to Supabase Storage:",
        uploadResult.filePath
      );

      // Step 2: Create document record in database
      console.log("🗄️ Step 2: Creating document record in database...");
      const documentRecord = await DocumentService.createDocument(mockUserId, {
        name: file.name,
        type: documentType,
        portfolioId: portfolioId
          ? "550e8400-e29b-41d4-a716-446655440001"
          : undefined, // Test portfolio ID
        fileSize: file.size.toString(),
        mimeType: file.type,
        filePath: uploadResult.filePath,
      });
      console.log(`✅ Document record created with ID: ${documentRecord.id}`);

      // Step 3: Update status to processing
      console.log("⏳ Step 3: Updating status to processing...");
      await DocumentService.updateDocumentStatus(
        documentRecord.id,
        "processing"
      );
      console.log("✅ Status updated to processing");

      // Step 4: Process document with AI
      console.log("🤖 Step 4: Processing document with AI...");
      const processingRequest = {
        file,
        documentType: documentType as any,
        portfolioId: portfolioId || undefined,
        userId: mockUserId,
      };

      const result = await documentProcessor.processDocument(processingRequest);

      if (!result.success) {
        console.error(`❌ AI processing failed: ${result.error}`);

        // Update document status to error
        await DocumentService.updateDocumentStatus(
          documentRecord.id,
          "error",
          undefined,
          result.error
        );

        return NextResponse.json(
          { error: result.error || "Document processing failed" },
          { status: 500 }
        );
      }

      console.log(`✅ AI processing completed in ${result.processingTime}ms`);
      console.log(
        `🔍 Extracted data:`,
        JSON.stringify(result.extractedData, null, 2)
      );

      // Step 5: Update document with extracted data
      console.log("💾 Step 5: Storing extracted data in database...");
      await DocumentService.updateDocumentStatus(
        documentRecord.id,
        "completed",
        result.extractedData
      );
      console.log("✅ Extracted data stored successfully");

      // Step 6: Verify data was stored correctly
      console.log("🔍 Step 6: Verifying stored data...");
      const storedDocuments = await DocumentService.getUserDocuments(
        mockUserId
      );
      const storedDocument = storedDocuments.find(
        (doc) => doc.id === documentRecord.id
      );

      if (!storedDocument) {
        console.error("❌ Document not found in database after storage");
        return NextResponse.json(
          { error: "Document not found after storage" },
          { status: 500 }
        );
      }

      console.log("✅ Data verification completed successfully");
      console.log(`📊 Stored document status: ${storedDocument.status}`);
      console.log(`📅 Processing completed at: ${storedDocument.processedAt}`);

      return NextResponse.json({
        success: true,
        data: {
          documentId: documentRecord.id,
          extractedData: result.extractedData,
          processingTime: result.processingTime,
          storedDocument: {
            id: storedDocument.id,
            name: storedDocument.name,
            type: storedDocument.type,
            status: storedDocument.status,
            processedAt: storedDocument.processedAt,
            hasExtractedData: !!storedDocument.extractedData,
          },
        },
        message: "Document processed and stored successfully (test mode)",
        pipeline: [
          "✅ Document record created",
          "✅ Status updated to processing",
          "✅ AI processing completed",
          "✅ Extracted data stored",
          "✅ Data verification passed",
        ],
      });
    } catch (dbError) {
      console.error("💥 Database operation failed:", dbError);
      return NextResponse.json(
        {
          error: "Database operation failed",
          details:
            dbError instanceof Error
              ? dbError.message
              : "Unknown database error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("💥 Document processing pipeline failed:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    message: "Full Document AI Pipeline Test Endpoint",
    status: "active",
    pipeline: [
      "1. Create document record in database",
      "2. Update status to processing",
      "3. Process document with AI",
      "4. Store extracted data in database",
      "5. Verify data storage",
    ],
    supportedTypes: [
      "fund_report",
      "cap_table",
      "financial_statement",
      "other",
    ],
    maxFileSize: "10MB",
    allowedFormats: ["PDF", "Word", "Excel", "Text (for testing)"],
  });
}
