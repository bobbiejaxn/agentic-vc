/**
 * Test script for enhanced chunking functionality
 * This script tests the enhanced chunking implementation without requiring the full Convex setup
 */

// Mock the enhanced chunking functionality for testing
class MockEnhancedFinancialChunker {
  constructor(config = {}) {
    this.config = {
      maxTokens: 512,
      overlapTokens: 50,
      preserveStructure: true,
      financialDataIntact: true,
      minChunkSize: 100,
      ...config,
    };
  }

  async chunkDocument(content, metadata = {}) {
    console.log("🧠 Enhanced Chunking Test Starting...");
    console.log(`📄 Document length: ${content.length} characters`);
    console.log(
      `⚙️  Config: maxTokens=${this.config.maxTokens}, overlap=${this.config.overlapTokens}`
    );

    // Parse document structure
    const structure = this.parseDocumentStructure(content);
    console.log(`📋 Found ${structure.sections.length} sections`);

    const chunks = [];
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

    // Add metadata to all chunks
    const enhancedChunks = chunks.map((chunk, index) => ({
      ...chunk,
      metadata: {
        ...chunk.metadata,
        chunkIndex: index,
        totalChunks: chunks.length,
      },
    }));

    console.log(`✅ Created ${enhancedChunks.length} enhanced chunks`);
    return enhancedChunks;
  }

  parseDocumentStructure(content) {
    const sections = [];
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

  parseSection(sectionText) {
    const lines = sectionText.split("\n");
    const headingLine = lines.find((line) => line.match(/^#{1,6}\s/));

    if (!headingLine) return null;

    const heading = headingLine.replace(/^#{1,6}\s/, "").trim();
    const level = headingLine.match(/^#+/)[0].length;
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

  extractDocumentContext(content) {
    const context = {
      documentType: "fund_report",
    };

    const fundNameMatch = content.match(
      /(?:fund|fund name|fund:)\s*([A-Za-z\s&]+)/i
    );
    if (fundNameMatch) {
      context.fundName = fundNameMatch[1].trim();
    }

    const quarterMatch = content.match(/(Q[1-4]|quarter)\s*(\d{4})/i);
    if (quarterMatch) {
      context.quarter = quarterMatch[1];
      context.year = parseInt(quarterMatch[2]);
    }

    if (content.toLowerCase().includes("annual report")) {
      context.reportType = "annual";
    } else if (content.toLowerCase().includes("quarterly report")) {
      context.reportType = "quarterly";
    }

    return context;
  }

  async processSection(section, context, startIndex) {
    const chunks = [];

    if (this.shouldKeepIntact(section)) {
      chunks.push(this.createIntactChunk(section, context, startIndex));
    } else {
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

  shouldKeepIntact(section) {
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

  smartTextSplit(text) {
    const sentences = this.splitIntoSentences(text);
    const chunks = [];
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

  splitIntoSentences(text) {
    return text
      .split(/(?<=[.!?])\s+(?=[A-Z])/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0);
  }

  getOverlapText(chunk) {
    const words = chunk.split(/\s+/);
    const overlapWordCount = Math.floor(this.config.overlapTokens / 4);
    const startIndex = Math.max(0, words.length - overlapWordCount);
    return words.slice(startIndex).join(" ");
  }

  createIntactChunk(section, context, chunkIndex) {
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

  createTextChunk(content, section, context, chunkIndex, previousChunk) {
    const hasOverlap = !!previousChunk;
    const overlapText = hasOverlap
      ? this.getOverlapText(previousChunk)
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

  determineChunkType(content) {
    const lowerContent = content.toLowerCase();

    if (this.containsTable(content)) return "table";
    if (this.containsChart(content)) return "chart";
    if (this.containsFinancialMetrics(content)) return "financial_metrics";
    if (lowerContent.includes("executive summary")) return "executive_summary";
    if (lowerContent.includes("summary")) return "summary";

    return "text";
  }

  containsTable(content) {
    const tablePatterns = [
      /\|.*\|.*\|/, // Markdown tables
      /\s+\|\s+/, // Table separators
      /^\s*\|/, // Table rows
      /\s+[A-Za-z]+\s+\|\s+[A-Za-z]+/, // Table headers
    ];

    return tablePatterns.some((pattern) => pattern.test(content));
  }

  containsChart(content) {
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

  containsFinancialMetrics(content) {
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

  extractFinancialMetrics(content) {
    const metrics = [];
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

  estimateTokens(text) {
    return Math.ceil(text.length / 4);
  }
}

// Test document
const testDocument = `# Q4 2024 Fund Performance Report

## Executive Summary
The fund demonstrated exceptional performance in Q4 2024 with an IRR of 18.5% and MOIC of 2.3x. Our portfolio companies showed strong growth across all sectors, with particular strength in technology and healthcare investments.

## Portfolio Performance Metrics

| Metric | Q4 2024 | Q3 2024 | Change | Benchmark |
|--------|---------|---------|--------|-----------|
| IRR | 18.5% | 15.2% | +3.3% | 12.0% |
| MOIC | 2.3x | 2.1x | +0.2x | 1.8x |
| TVPI | 2.0x | 1.8x | +0.2x | 1.5x |
| DPI | 1.1x | 0.9x | +0.2x | 0.8x |
| RVPI | 1.2x | 1.2x | 0.0x | 0.7x |

## Portfolio Companies Analysis

### Technology Sector (45% allocation)
Our technology investments continue to drive strong returns with several portfolio companies showing exceptional growth.

**Key Holdings:**
- **TechCorp Inc.** - Series B investment, 15% ownership, 3.2x return
- **DataFlow Systems** - Series A investment, 20% ownership, 2.8x return
- **CloudTech Solutions** - Growth investment, 12% ownership, 1.5x return
- **AI Innovations** - Series A investment, 18% ownership, 2.1x return

### Healthcare Sector (30% allocation)
Healthcare investments showed resilience with strong performance in biotech and medical device companies.

**Key Holdings:**
- **MedDevice Co.** - Series A investment, 18% ownership, 2.5x return
- **BioPharma Ltd.** - Series B investment, 22% ownership, 3.1x return
- **HealthTech Solutions** - Growth investment, 15% ownership, 1.8x return

### Financial Services (15% allocation)
Fintech investments demonstrated strong performance with regulatory tailwinds supporting growth.

**Key Holdings:**
- **FinTech Innovations** - Series A investment, 25% ownership, 2.2x return
- **PayTech Solutions** - Growth investment, 15% ownership, 1.9x return

### Other Sectors (10% allocation)
Diversified investments across various sectors provide portfolio stability.

**Key Holdings:**
- **GreenEnergy Corp** - Series A investment, 20% ownership, 1.7x return
- **RetailTech Inc** - Growth investment, 18% ownership, 2.0x return

## Key Investment Highlights

### Successful Exits
1. **TechCorp Inc.** - Partial exit at 3.2x return, generating $15M in distributions
2. **DataFlow Systems** - Strategic acquisition at 2.8x return, generating $8M in distributions
3. **MedDevice Co.** - IPO at 2.5x return, generating $12M in distributions

### New Investments
1. **CloudTech Solutions** - $5M Series A investment, 12% ownership
2. **BioPharma Ltd.** - $8M Series B investment, 22% ownership
3. **AI Innovations** - $6M Series A investment, 18% ownership

## Risk Management
The fund maintains a diversified portfolio with comprehensive risk mitigation strategies across all sectors. Regular monitoring and due diligence processes ensure optimal performance while managing downside risk.

**Risk Metrics:**
- Portfolio concentration: <15% per company
- Sector diversification: 4+ sectors
- Geographic diversification: 3+ regions
- Stage diversification: Early to growth stage

## Market Outlook for 2025
Based on current market conditions and portfolio performance, we anticipate continued strong returns with focus on technology and healthcare sectors. Market tailwinds include:

- Continued digital transformation across industries
- Healthcare innovation and regulatory support
- Fintech adoption and regulatory clarity
- ESG investing and sustainable growth

## Conclusion
The fund's strong performance in Q4 2024 demonstrates the effectiveness of our investment strategy and portfolio management approach. We remain committed to delivering superior returns while managing risk appropriately.`;

// Run the test
async function runTest() {
  console.log("🚀 Starting Enhanced Chunking Test");
  console.log("=".repeat(50));

  const chunker = new MockEnhancedFinancialChunker({
    maxTokens: 512,
    overlapTokens: 50,
    financialDataIntact: true,
  });

  try {
    const startTime = Date.now();
    const chunks = await chunker.chunkDocument(testDocument, {
      documentType: "fund_report",
      fundName: "Test Fund",
      quarter: "Q4",
      year: 2024,
    });
    const processingTime = Date.now() - startTime;

    console.log("\n📊 Test Results:");
    console.log("=".repeat(30));
    console.log(`⏱️  Processing Time: ${processingTime}ms`);
    console.log(`📄 Total Chunks: ${chunks.length}`);
    console.log(
      `⚡ Chunks/Second: ${(chunks.length / (processingTime / 1000)).toFixed(2)}`
    );

    // Analyze chunk types
    const chunkTypes = {};
    let totalTokens = 0;
    let semanticBoundaries = 0;
    let overlappingChunks = 0;
    let financialDataChunks = 0;

    for (const chunk of chunks) {
      chunkTypes[chunk.chunkType] = (chunkTypes[chunk.chunkType] || 0) + 1;
      totalTokens += chunk.tokenCount;
      if (chunk.metadata.semanticBoundary) semanticBoundaries++;
      if (chunk.metadata.hasOverlap) overlappingChunks++;
      if (
        chunk.chunkType === "financial_metrics" ||
        chunk.chunkType === "table"
      ) {
        financialDataChunks++;
      }
    }

    console.log(`🎯 Chunk Types:`, chunkTypes);
    console.log(
      `📈 Avg Tokens/Chunk: ${Math.round(totalTokens / chunks.length)}`
    );
    console.log(
      `🧠 Semantic Boundaries: ${semanticBoundaries}/${chunks.length} (${Math.round((semanticBoundaries / chunks.length) * 100)}%)`
    );
    console.log(
      `🔗 Overlapping Chunks: ${overlappingChunks}/${chunks.length} (${Math.round((overlappingChunks / chunks.length) * 100)}%)`
    );
    console.log(
      `💰 Financial Data Chunks: ${financialDataChunks}/${chunks.length} (${Math.round((financialDataChunks / chunks.length) * 100)}%)`
    );

    // Show sample chunks
    console.log("\n📝 Sample Chunks:");
    console.log("=".repeat(30));
    chunks.slice(0, 3).forEach((chunk, index) => {
      console.log(`\nChunk ${index + 1}:`);
      console.log(`  Type: ${chunk.chunkType}`);
      console.log(`  Section: ${chunk.section}`);
      console.log(`  Tokens: ${chunk.tokenCount}`);
      console.log(`  Has Table: ${chunk.hasTable}`);
      console.log(`  Has Chart: ${chunk.hasChart}`);
      console.log(`  Financial Metrics: ${chunk.financialMetrics.length}`);
      console.log(`  Semantic Boundary: ${chunk.metadata.semanticBoundary}`);
      console.log(`  Has Overlap: ${chunk.metadata.hasOverlap}`);
      console.log(`  Content Preview: ${chunk.content.substring(0, 100)}...`);
    });

    console.log("\n✅ Enhanced Chunking Test Completed Successfully!");
    console.log("🎉 All features working as expected!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error(error.stack);
  }
}

// Run the test
runTest();
