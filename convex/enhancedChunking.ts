/**
 * Enhanced Chunking Strategy for Financial Documents
 *
 * Inspired by Docling's HybridChunker but implemented in TypeScript for Convex.
 * Provides token-aware chunking with semantic boundary respect and context preservation.
 */

export interface ChunkingConfig {
  maxTokens: number;
  overlapTokens: number;
  preserveStructure: boolean;
  financialDataIntact: boolean;
  minChunkSize: number;
}

export interface DocumentStructure {
  sections: DocumentSection[];
  context: DocumentContext;
}

export interface DocumentSection {
  content: string;
  heading: string;
  level: number;
  type: ChunkType;
  hasTable: boolean;
  hasChart: boolean;
  financialMetrics: string[];
}

export interface DocumentContext {
  documentType: string;
  fundName?: string;
  quarter?: string;
  year?: number;
  reportType?: string;
}

export interface EnhancedChunk {
  content: string;
  chunkType: ChunkType;
  section: string;
  tokenCount: number;
  hasTable: boolean;
  hasChart: boolean;
  financialMetrics: string[];
  context: DocumentContext;
  metadata: ChunkMetadata;
}

export interface ChunkMetadata {
  chunkIndex: number;
  totalChunks: number;
  parentSection: string;
  hasOverlap: boolean;
  overlapText?: string;
  semanticBoundary: boolean;
}

export type ChunkType =
  | "text"
  | "table"
  | "image"
  | "metadata"
  | "financial_metrics"
  | "chart"
  | "summary"
  | "executive_summary";

export class EnhancedFinancialChunker {
  private config: ChunkingConfig;

  constructor(config: Partial<ChunkingConfig> = {}) {
    this.config = {
      maxTokens: 512,
      overlapTokens: 50,
      preserveStructure: true,
      financialDataIntact: true,
      minChunkSize: 100,
      ...config,
    };
  }

  /**
   * Main chunking method that processes a document into intelligent chunks
   */
  async chunkDocument(
    content: string,
    metadata: any = {}
  ): Promise<EnhancedChunk[]> {
    // 1. Parse document structure
    const structure = this.parseDocumentStructure(content);

    // 2. Create intelligent chunks
    const chunks: EnhancedChunk[] = [];
    let globalChunkIndex = 0;

    for (const section of structure.sections) {
      const sectionChunks = await this.processSection(
        section,
        structure.context,
        globalChunkIndex
      );
      chunks.push(...sectionChunks);
      globalChunkIndex += sectionChunks.length;
    }

    // 3. Add metadata to all chunks
    return chunks.map((chunk, index) => ({
      ...chunk,
      metadata: {
        ...chunk.metadata,
        chunkIndex: index,
        totalChunks: chunks.length,
      },
    }));
  }

  /**
   * Parse document structure to understand hierarchy and content types
   */
  private parseDocumentStructure(content: string): DocumentStructure {
    const sections: DocumentSection[] = [];

    // Split by headings (##, ###, etc.)
    const sectionMatches = content.split(/\n(?=#{1,6}\s)/);

    for (const sectionText of sectionMatches) {
      if (!sectionText.trim()) continue;

      const section = this.parseSection(sectionText);
      if (section) {
        sections.push(section);
      }
    }

    return {
      sections,
      context: this.extractDocumentContext(content),
    };
  }

  /**
   * Parse individual section to extract metadata and content
   */
  private parseSection(sectionText: string): DocumentSection | null {
    const lines = sectionText.split("\n");
    const headingLine = lines.find((line) => line.match(/^#{1,6}\s/));

    if (!headingLine) return null;

    const heading = headingLine.replace(/^#{1,6}\s/, "").trim();
    const level = headingLine.match(/^#+/)![0].length;
    const content = sectionText.trim();

    return {
      content,
      heading,
      level,
      type: this.determineChunkType(content),
      hasTable: this.containsTable(content),
      hasChart: this.containsChart(content),
      financialMetrics: this.extractFinancialMetrics(content),
    };
  }

  /**
   * Extract document context for better chunk understanding
   */
  private extractDocumentContext(content: string): DocumentContext {
    const context: DocumentContext = {
      documentType: "fund_report",
    };

    // Extract fund name patterns
    const fundNameMatch = content.match(
      /(?:fund|fund name|fund:)\s*([A-Za-z\s&]+)/i
    );
    if (fundNameMatch) {
      context.fundName = fundNameMatch[1].trim();
    }

    // Extract quarter/year patterns
    const quarterMatch = content.match(/(Q[1-4]|quarter)\s*(\d{4})/i);
    if (quarterMatch) {
      context.quarter = quarterMatch[1];
      context.year = parseInt(quarterMatch[2]);
    }

    // Extract report type
    if (content.toLowerCase().includes("annual report")) {
      context.reportType = "annual";
    } else if (content.toLowerCase().includes("quarterly report")) {
      context.reportType = "quarterly";
    }

    return context;
  }

  /**
   * Process a section into appropriate chunks
   */
  private async processSection(
    section: DocumentSection,
    context: DocumentContext,
    startIndex: number
  ): Promise<EnhancedChunk[]> {
    const chunks: EnhancedChunk[] = [];

    if (this.shouldKeepIntact(section)) {
      // Keep financial data intact as single chunk
      chunks.push(this.createIntactChunk(section, context, startIndex));
    } else {
      // Token-aware splitting for text content
      const textChunks = this.smartTextSplit(section.content);

      for (let i = 0; i < textChunks.length; i++) {
        const chunk = this.createTextChunk(
          textChunks[i],
          section,
          context,
          startIndex + i,
          i > 0 ? textChunks[i - 1] : undefined
        );
        chunks.push(chunk);
      }
    }

    return chunks;
  }

  /**
   * Determine if section should be kept intact (tables, charts, financial data)
   */
  private shouldKeepIntact(section: DocumentSection): boolean {
    if (!this.config.financialDataIntact) return false;

    return (
      section.type === "table" ||
      section.type === "chart" ||
      section.type === "financial_metrics" ||
      section.hasTable ||
      section.hasChart ||
      section.financialMetrics.length > 0 ||
      section.content.length < this.config.minChunkSize
    );
  }

  /**
   * Smart text splitting with token awareness and overlap
   */
  private smartTextSplit(text: string): string[] {
    const sentences = this.splitIntoSentences(text);
    const chunks: string[] = [];
    let currentChunk = "";
    let currentTokens = 0;

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      const sentenceTokens = this.estimateTokens(sentence);

      if (
        currentTokens + sentenceTokens > this.config.maxTokens &&
        currentChunk
      ) {
        chunks.push(currentChunk.trim());

        // Add overlap from previous chunk
        const overlapText = this.getOverlapText(currentChunk);
        currentChunk = overlapText + " " + sentence;
        currentTokens = this.estimateTokens(overlapText) + sentenceTokens;
      } else {
        currentChunk += " " + sentence;
        currentTokens += sentenceTokens;
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  /**
   * Split text into sentences while preserving structure
   */
  private splitIntoSentences(text: string): string[] {
    // Split on sentence boundaries but preserve structure
    return text
      .split(/(?<=[.!?])\s+(?=[A-Z])/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0);
  }

  /**
   * Get overlap text from previous chunk
   */
  private getOverlapText(chunk: string): string {
    const words = chunk.split(/\s+/);
    const overlapWordCount = Math.floor(this.config.overlapTokens / 4);
    const startIndex = Math.max(0, words.length - overlapWordCount);
    return words.slice(startIndex).join(" ");
  }

  /**
   * Create intact chunk for financial data
   */
  private createIntactChunk(
    section: DocumentSection,
    context: DocumentContext,
    chunkIndex: number
  ): EnhancedChunk {
    return {
      content: section.content,
      chunkType: section.type,
      section: section.heading,
      tokenCount: this.estimateTokens(section.content),
      hasTable: section.hasTable,
      hasChart: section.hasChart,
      financialMetrics: section.financialMetrics,
      context,
      metadata: {
        chunkIndex,
        totalChunks: 1,
        parentSection: section.heading,
        hasOverlap: false,
        semanticBoundary: true,
      },
    };
  }

  /**
   * Create text chunk with context and metadata
   */
  private createTextChunk(
    content: string,
    section: DocumentSection,
    context: DocumentContext,
    chunkIndex: number,
    previousChunk?: string
  ): EnhancedChunk {
    const hasOverlap = !!previousChunk;
    const overlapText = hasOverlap
      ? this.getOverlapText(previousChunk!)
      : undefined;

    return {
      content,
      chunkType: "text",
      section: section.heading,
      tokenCount: this.estimateTokens(content),
      hasTable: section.hasTable,
      hasChart: section.hasChart,
      financialMetrics: section.financialMetrics,
      context,
      metadata: {
        chunkIndex,
        totalChunks: 1,
        parentSection: section.heading,
        hasOverlap,
        overlapText,
        semanticBoundary: true,
      },
    };
  }

  /**
   * Determine chunk type based on content analysis
   */
  private determineChunkType(content: string): ChunkType {
    const lowerContent = content.toLowerCase();

    if (this.containsTable(content)) return "table";
    if (this.containsChart(content)) return "chart";
    if (this.containsFinancialMetrics(content)) return "financial_metrics";
    if (lowerContent.includes("executive summary")) return "executive_summary";
    if (lowerContent.includes("summary")) return "summary";

    return "text";
  }

  /**
   * Check if content contains tables
   */
  private containsTable(content: string): boolean {
    // Look for table patterns
    const tablePatterns = [
      /\|.*\|.*\|/, // Markdown tables
      /\s+\|\s+/, // Table separators
      /^\s*\|/, // Table rows
      /\s+[A-Za-z]+\s+\|\s+[A-Za-z]+/, // Table headers
    ];

    return tablePatterns.some((pattern) => pattern.test(content));
  }

  /**
   * Check if content contains charts
   */
  private containsChart(content: string): boolean {
    const chartKeywords = [
      "chart",
      "graph",
      "figure",
      "diagram",
      "visualization",
      "performance chart",
      "return chart",
      "allocation chart",
    ];

    const lowerContent = content.toLowerCase();
    return chartKeywords.some((keyword) => lowerContent.includes(keyword));
  }

  /**
   * Check if content contains financial metrics
   */
  private containsFinancialMetrics(content: string): boolean {
    const financialKeywords = [
      "irr",
      "moic",
      "tvpi",
      "dpi",
      "rvpi",
      "nav",
      "return",
      "performance",
      "valuation",
      "investment",
      "cash flow",
      "distribution",
      "commitment",
    ];

    const lowerContent = content.toLowerCase();
    return financialKeywords.some((keyword) => lowerContent.includes(keyword));
  }

  /**
   * Extract financial metrics from content
   */
  private extractFinancialMetrics(content: string): string[] {
    const metrics: string[] = [];
    const metricPatterns = [
      /(?:IRR|irr):\s*([0-9.]+%)/gi,
      /(?:MOIC|moic):\s*([0-9.]+x)/gi,
      /(?:TVPI|tvpi):\s*([0-9.]+x)/gi,
      /(?:DPI|dpi):\s*([0-9.]+x)/gi,
      /(?:RVPI|rvpi):\s*([0-9.]+x)/gi,
    ];

    for (const pattern of metricPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        metrics.push(...matches);
      }
    }

    return metrics;
  }

  /**
   * Estimate token count (rough approximation)
   */
  private estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    // This is a simplified version - in production, you might want to use a more accurate method
    return Math.ceil(text.length / 4);
  }
}

/**
 * Factory function to create chunker with default config
 */
export function createEnhancedChunker(
  config?: Partial<ChunkingConfig>
): EnhancedFinancialChunker {
  return new EnhancedFinancialChunker(config);
}

/**
 * Default configuration for financial documents
 */
export const DEFAULT_CHUNKING_CONFIG: ChunkingConfig = {
  maxTokens: 512,
  overlapTokens: 50,
  preserveStructure: true,
  financialDataIntact: true,
  minChunkSize: 100,
};
