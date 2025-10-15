// Portfolio Intelligence Orchestrator (LlmAgent)
// Orchestrates the document processing pipeline and coordinates all agents

import { BaseAgent, AgentContext, AgentResult } from "./base-agent";
import {
  DocumentClassificationAgent,
  DocumentClassificationInput,
  DocumentClassificationResult,
} from "./document-classification-agent";
import {
  DataExtractionAgent,
  DataExtractionInput,
  DataExtractionResult,
} from "./data-extraction-agent";
import {
  ValidationAgent,
  ValidationInput,
  ValidationResult,
} from "./validation-agent";

export interface DocumentProcessingRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
  rawText: string;
  userId: string;
  portfolioId?: string;
  documentId?: string;
}

export interface DocumentProcessingResult {
  success: boolean;
  documentId: string;
  extractedData: DataExtractionResult;
  validationResult: ValidationResult;
  processingTime: number;
  agentResults: {
    classification: AgentResult<DocumentClassificationResult>;
    extraction: AgentResult<DataExtractionResult>;
    validation: AgentResult<ValidationResult>;
  };
  metadata: {
    sessionId: string;
    userId: string;
    portfolioId?: string;
    processingStrategy: string;
    qualityScore: number;
  };
}

export class PortfolioIntelligenceOrchestrator extends BaseAgent {
  private classificationAgent: DocumentClassificationAgent;
  private extractionAgent: DataExtractionAgent;
  private validationAgent: ValidationAgent;

  constructor(context: AgentContext) {
    super(context);
    this.initializeAgent();
    this.initializeSubAgents();
  }

  private initializeAgent(): void {
    this.addSystemMessage(`
You are the Portfolio Intelligence Orchestrator, responsible for coordinating the entire document processing pipeline.

Your role is to:
1. Orchestrate the document processing workflow
2. Coordinate between classification, extraction, and validation agents
3. Ensure high-quality data extraction and validation
4. Provide comprehensive processing results
5. Handle error recovery and retry logic

Processing Pipeline:
1. Document Classification → Determine document type and processing strategy
2. Data Extraction → Extract structured data using appropriate strategy
3. Validation → Validate extracted data and provide feedback
4. Quality Assessment → Evaluate overall processing quality
5. Result Compilation → Compile comprehensive results

Ensure all agents work together effectively to produce high-quality results.
`);
  }

  private initializeSubAgents(): void {
    this.classificationAgent = new DocumentClassificationAgent(this.context);
    this.extractionAgent = new DataExtractionAgent(this.context);
    this.validationAgent = new ValidationAgent(this.context);
  }

  async execute(
    request: DocumentProcessingRequest
  ): Promise<AgentResult<DocumentProcessingResult>> {
    const startTime = Date.now();

    try {
      this.addUserMessage(`Process document: ${request.fileName}`);

      // Step 1: Document Classification
      const classificationResult = await this.performClassification(request);
      if (!classificationResult.success) {
        return this.createErrorResult(
          `Classification failed: ${classificationResult.error}`
        );
      }

      // Step 2: Data Extraction
      const extractionResult = await this.performExtraction(
        request,
        classificationResult.data!
      );
      if (!extractionResult.success) {
        return this.createErrorResult(
          `Extraction failed: ${extractionResult.error}`
        );
      }

      // Step 3: Validation
      const validationResult = await this.performValidation(
        request,
        extractionResult.data!
      );
      if (!validationResult.success) {
        return this.createErrorResult(
          `Validation failed: ${validationResult.error}`
        );
      }

      // Step 4: Compile Results
      const processingResult = this.compileResults(
        request,
        classificationResult.data!,
        extractionResult.data!,
        validationResult.data!,
        Date.now() - startTime
      );

      this.addAssistantMessage(
        `Document processing completed successfully. Quality Score: ${processingResult.metadata.qualityScore}`
      );

      return this.createSuccessResult(
        processingResult,
        processingResult.metadata.qualityScore,
        {
          fileName: request.fileName,
          processingTime: processingResult.processingTime,
          qualityScore: processingResult.metadata.qualityScore,
        }
      );
    } catch (error) {
      console.error("Portfolio orchestrator error:", error);
      return this.createErrorResult(
        `Document processing failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private async performClassification(
    request: DocumentProcessingRequest
  ): Promise<AgentResult<DocumentClassificationResult>> {
    const classificationInput: DocumentClassificationInput = {
      fileName: request.fileName,
      fileType: request.fileType,
      fileSize: request.fileSize,
      rawText: request.rawText,
      metadata: {
        userId: request.userId,
        portfolioId: request.portfolioId,
        documentId: request.documentId,
      },
    };

    return await this.classificationAgent.execute(classificationInput);
  }

  private async performExtraction(
    request: DocumentProcessingRequest,
    classificationResult: DocumentClassificationResult
  ): Promise<AgentResult<DataExtractionResult>> {
    const extractionInput: DataExtractionInput = {
      documentType: classificationResult.documentType,
      rawText: request.rawText,
      processingStrategy: classificationResult.processingStrategy,
      extractedMetadata: classificationResult.extractedMetadata,
      recommendations: classificationResult.recommendations,
    };

    return await this.extractionAgent.execute(extractionInput);
  }

  private async performValidation(
    request: DocumentProcessingRequest,
    extractionResult: DataExtractionResult
  ): Promise<AgentResult<ValidationResult>> {
    const validationInput: ValidationInput = {
      extractedData: extractionResult,
      originalText: request.rawText,
      documentType: extractionResult.documentType,
    };

    return await this.validationAgent.execute(validationInput);
  }

  private compileResults(
    request: DocumentProcessingRequest,
    classificationResult: DocumentClassificationResult,
    extractionResult: DataExtractionResult,
    validationResult: ValidationResult,
    processingTime: number
  ): DocumentProcessingResult {
    const qualityScore = this.calculateQualityScore(
      extractionResult,
      validationResult
    );

    return {
      success: true,
      documentId: request.documentId || this.generateDocumentId(),
      extractedData: extractionResult,
      validationResult: validationResult,
      processingTime,
      agentResults: {
        classification: this.createSuccessResult(
          classificationResult,
          classificationResult.confidence
        ),
        extraction: this.createSuccessResult(
          extractionResult,
          extractionResult.confidence
        ),
        validation: this.createSuccessResult(
          validationResult,
          validationResult.confidence
        ),
      },
      metadata: {
        sessionId: this.context.sessionId,
        userId: request.userId,
        portfolioId: request.portfolioId,
        processingStrategy: classificationResult.processingStrategy,
        qualityScore,
      },
    };
  }

  private calculateQualityScore(
    extractionResult: DataExtractionResult,
    validationResult: ValidationResult
  ): number {
    // Base score from extraction confidence
    let score = extractionResult.confidence * 0.4;

    // Add validation quality score
    score += validationResult.qualityScore * 0.4;

    // Add validation confidence
    score += validationResult.confidence * 0.2;

    // Penalize for critical errors
    const criticalErrors = validationResult.validationErrors.filter(
      (e) => e.severity === "critical"
    ).length;
    score -= criticalErrors * 0.1;

    // Ensure score is between 0 and 1
    return Math.max(0, Math.min(1, score));
  }

  private generateDocumentId(): string {
    return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Process document with retry logic
   */
  public async processDocumentWithRetry(
    request: DocumentProcessingRequest,
    maxRetries: number = 2
  ): Promise<AgentResult<DocumentProcessingResult>> {
    let lastError: string = "";

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.execute(request);

        if (result.success) {
          return result;
        }

        lastError = result.error || "Unknown error";

        // If validation failed but extraction succeeded, try to improve
        if (
          result.data?.validationResult &&
          !result.data.validationResult.isValid
        ) {
          console.log(
            `Attempt ${
              attempt + 1
            } failed validation, retrying with improved strategy...`
          );
          // Could implement improvement logic here
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : "Unknown error";
        console.error(`Processing attempt ${attempt + 1} failed:`, error);
      }

      if (attempt < maxRetries) {
        // Wait before retry
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (attempt + 1))
        );
      }
    }

    return this.createErrorResult(
      `Document processing failed after ${
        maxRetries + 1
      } attempts: ${lastError}`
    );
  }

  /**
   * Get processing pipeline status
   */
  public getPipelineStatus(): {
    agents: string[];
    context: AgentContext;
    messageCount: number;
  } {
    return {
      agents: [
        "DocumentClassificationAgent",
        "DataExtractionAgent",
        "ValidationAgent",
      ],
      context: this.context,
      messageCount: this.messages.length,
    };
  }

  /**
   * Update context for all sub-agents
   */
  public updateContext(updates: Partial<AgentContext>): void {
    super.updateContext(updates);
    this.classificationAgent.updateContext(updates);
    this.extractionAgent.updateContext(updates);
    this.validationAgent.updateContext(updates);
  }
}
