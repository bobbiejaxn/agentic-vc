import { BaseAgent } from "./BaseAgent";
import { LlamaParseService } from "../ai/llama-parse";
import { DocumentService } from "../database/documents";

/**
 * Document Processing Agent - Handles document parsing and structured data extraction
 * Inspired by Google ADK's specialized agent architecture
 */
export class DocumentProcessingAgent extends BaseAgent {
  private llamaParseService: LlamaParseService;
  private documentService: DocumentService;

  constructor() {
    super(
      "DocumentProcessingAgent",
      "Specialized agent for processing fund documents and extracting structured data"
    );

    this.llamaParseService = new LlamaParseService();
    this.documentService = new DocumentService();

    this.initializeTools();
  }

  /**
   * Initialize tools for document processing
   */
  private initializeTools(): void {
    this.addTool({
      name: "extract_structured_data",
      description: "Extract structured data from markdown document",
      execute: async (args: {
        markdownText: string;
        documentType?: string;
      }) => {
        return await this.llamaParseService.extractStructuredData(
          args.markdownText,
          args.documentType
        );
      },
    });

    this.addTool({
      name: "store_document",
      description: "Store processed document in database",
      execute: async (args: { document: any; userId: string }) => {
        return await this.documentService.createDocument(
          args.document,
          args.userId
        );
      },
    });

    this.addTool({
      name: "generate_embeddings",
      description: "Generate vector embeddings for document",
      execute: async (args: { content: string }) => {
        // This will be implemented with your vector search setup
        return { embedding: "placeholder_embedding" };
      },
    });
  }

  /**
   * Process a document through the complete pipeline
   */
  async processDocument(document: {
    id: string;
    content: string;
    fileName: string;
    type: string;
  }): Promise<any> {
    console.log(`📄 Processing document: ${document.fileName}`);

    try {
      // Step 1: Extract structured data using LlamaParseService
      console.log("🔍 Extracting structured data...");
      const structuredData = await this.executeTool("extract_structured_data", {
        markdownText: document.content,
        documentType: document.type,
      });

      // Step 2: Generate embeddings for vector search
      console.log("🧠 Generating embeddings...");
      const embeddings = await this.executeTool("generate_embeddings", {
        content: document.content,
      });

      // Step 3: Store document with metadata
      console.log("💾 Storing document...");
      const storedDocument = await this.executeTool("store_document", {
        document: {
          ...document,
          structuredData,
          embeddings,
          processedAt: new Date().toISOString(),
        },
        userId: "system", // This should be the actual user ID
      });

      console.log("✅ Document processing completed successfully");

      return {
        documentId: storedDocument.id,
        structuredData,
        embeddings,
        processingStatus: "completed",
      };
    } catch (error) {
      console.error("❌ Error processing document:", error);
      throw error;
    }
  }

  /**
   * Retry processing a failed document
   */
  async retryProcessing(documentId: string): Promise<any> {
    console.log(`🔄 Retrying processing for document: ${documentId}`);

    try {
      // Get the original document
      const document = await this.documentService.getDocumentById(
        documentId,
        "system"
      );
      if (!document) {
        throw new Error("Document not found");
      }

      // Reprocess the document
      return await this.processDocument({
        id: document.id,
        content: document.content || "",
        fileName: document.fileName,
        type: document.type || "fund_report",
      });
    } catch (error) {
      console.error("❌ Error retrying document processing:", error);
      throw error;
    }
  }

  /**
   * Get processing status for a document
   */
  async getProcessingStatus(documentId: string): Promise<{
    status: string;
    progress: number;
    errors?: string[];
  }> {
    try {
      const document = await this.documentService.getDocumentById(
        documentId,
        "system"
      );
      if (!document) {
        return { status: "not_found", progress: 0 };
      }

      return {
        status: document.status || "pending",
        progress: document.status === "completed" ? 100 : 50,
        errors: document.errorMessage ? [document.errorMessage] : undefined,
      };
    } catch (error) {
      console.error("❌ Error getting processing status:", error);
      return { status: "error", progress: 0, errors: [error.message] };
    }
  }
}
