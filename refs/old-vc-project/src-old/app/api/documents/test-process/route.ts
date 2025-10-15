import { NextRequest, NextResponse } from "next/server";
import { documentProcessor } from "@/lib/ai/document-processor";

/**
 * Test endpoint for document processing without authentication
 * This is for testing purposes only - DO NOT USE IN PRODUCTION
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

    console.log(
      `📄 Processing test document: ${file.name} (${file.size} bytes)`
    );
    console.log(`📋 Document type: ${documentType}`);
    console.log(`📁 Portfolio ID: ${portfolioId || "none"}`);

    // Process document using AI processing
    const processingRequest = {
      file,
      documentType: documentType as any,
      portfolioId: portfolioId || undefined,
      userId: "test-user-id", // Mock user ID for testing
    };

    const result = await documentProcessor.processDocument(
      processingRequest
    );

    if (!result.success) {
      console.error(`❌ Processing failed: ${result.error}`);
      return NextResponse.json(
        { error: result.error || "Document processing failed" },
        { status: 500 }
      );
    }

    console.log(
      `✅ Processing completed successfully in ${result.processingTime}ms`
    );
    console.log(
      `🔍 Extracted data:`,
      JSON.stringify(result.extractedData, null, 2)
    );

    return NextResponse.json({
      success: true,
      data: {
        documentId: `test-doc-${Date.now()}`, // Mock document ID
        extractedData: result.extractedData,
        processingTime: result.processingTime,
      },
      message: "Document processed successfully (test mode)",
    });
  } catch (error) {
    console.error("Document processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    message: "Document AI Test Endpoint",
    status: "active",
    supportedTypes: [
      "fund_report",
      "cap_table",
      "financial_statement",
      "other",
    ],
    maxFileSize: "10MB",
    allowedFormats: ["PDF", "Word", "Excel"],
  });
}
