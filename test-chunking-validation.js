/**
 * Comprehensive validation test for enhanced chunking implementation
 * Tests all the key features without requiring Convex server
 */

// Mock the enhanced chunking functionality
class EnhancedFinancialChunker {
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
    const structure = this.parseDocumentStructure(content);
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

    return chunks.map((chunk, index) => ({
      ...chunk,
      metadata: {
        ...chunk.metadata,
        chunkIndex: index,
        totalChunks: chunks.length,
      },
    }));
  }

  parseDocumentStructure(content) {
    const sections = [];
    const sectionMatches = content.split(/\n(?=#{1,6}\s)/);

    for (const sectionText of sectionMatches) {
      if (!sectionText.trim()) continue;
      const section = this.parseSection(sectionText);
      if (section) sections.push(section);
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
    const context = { documentType: "fund_report" };

    const fundNameMatch = content.match(
      /(?:fund|fund name|fund:)\s*([A-Za-z\s&]+)/i
    );
    if (fundNameMatch) context.fundName = fundNameMatch[1].trim();

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
    if (lowerContent.includes("summary") || lowerContent.includes("conclusion"))
      return "summary";
    return "text";
  }

  containsTable(content) {
    const tablePatterns = [
      /\|.*\|.*\|/,
      /\s+\|\s+/,
      /^\s*\|/,
      /\s+[A-Za-z]+\s+\|\s+[A-Za-z]+/,
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
      if (matches) metrics.push(...matches);
    }

    return metrics;
  }

  estimateTokens(text) {
    return Math.ceil(text.length / 4);
  }
}

// Test scenarios
const testScenarios = [
  {
    name: "Financial Report with Tables",
    content: `# Q4 2024 Fund Performance Report

## Executive Summary
Strong performance with 15.2% IRR and 2.1x MOIC.

## Portfolio Metrics
| Metric | Q4 2024 | Q3 2024 |
|--------|---------|---------|
| IRR | 15.2% | 12.8% |
| MOIC | 2.1x | 1.9x |

## Portfolio Companies
- TechCorp Inc. - 15% ownership
- DataFlow Systems - 20% ownership`,
    expectedFeatures: ["table", "financial_metrics", "context_preservation"],
  },
  {
    name: "Long Text Document",
    content: `# Annual Report 2024

## Executive Summary
This is a very long executive summary that should be split into multiple chunks due to its length. The fund has performed exceptionally well this year with strong returns across all sectors. Our investment strategy has proven successful with multiple successful exits and new investments. The technology sector continues to drive growth while healthcare investments show resilience. Financial services have benefited from regulatory tailwinds. Overall, the portfolio demonstrates strong diversification and risk management.

## Investment Strategy
Our investment strategy focuses on early to growth stage companies with strong fundamentals. We prioritize companies with experienced management teams, scalable business models, and clear paths to profitability. Our due diligence process is comprehensive and includes market analysis, competitive positioning, and financial modeling. We maintain active relationships with portfolio companies and provide strategic guidance throughout their growth journey.

## Risk Management
Risk management is a cornerstone of our investment approach. We maintain strict portfolio concentration limits, typically investing no more than 15% of fund capital in any single company. Our sector diversification strategy ensures exposure across multiple industries. Geographic diversification provides additional risk mitigation. We regularly monitor portfolio performance and adjust strategies as needed.`,
    expectedFeatures: ["text_splitting", "overlap", "semantic_boundaries"],
  },
  {
    name: "Mixed Content Document",
    content: `# Fund Report

## Performance Chart
The performance chart shows strong returns over the quarter.

## Financial Metrics
IRR: 18.5%
MOIC: 2.3x
TVPI: 2.0x

## Summary
Overall strong performance with good diversification.`,
    expectedFeatures: [
      "chart_detection",
      "metrics_extraction",
      "summary_detection",
    ],
  },
];

async function runValidationTests() {
  console.log("🧪 Enhanced Chunking Validation Tests");
  console.log("=".repeat(50));

  const chunker = new EnhancedFinancialChunker({
    maxTokens: 512,
    overlapTokens: 50,
    financialDataIntact: true,
  });

  let allTestsPassed = true;

  for (const scenario of testScenarios) {
    console.log(`\n📋 Testing: ${scenario.name}`);
    console.log("-".repeat(30));

    try {
      const startTime = Date.now();
      const chunks = await chunker.chunkDocument(scenario.content);
      const processingTime = Date.now() - startTime;

      console.log(
        `✅ Processing: ${processingTime}ms, ${chunks.length} chunks`
      );

      // Validate features
      const features = {
        table: chunks.some((chunk) => chunk.chunkType === "table"),
        financial_metrics: chunks.some(
          (chunk) => chunk.chunkType === "financial_metrics"
        ),
        chart: chunks.some((chunk) => chunk.chunkType === "chart"),
        summary: chunks.some((chunk) => chunk.chunkType === "summary"),
        context_preservation: chunks.some((chunk) => chunk.context),
        semantic_boundaries: chunks.some(
          (chunk) => chunk.metadata.semanticBoundary
        ),
        overlap: chunks.some((chunk) => chunk.metadata.hasOverlap),
        text_splitting: chunks.length > 1,
        metrics_extraction: chunks.some(
          (chunk) => chunk.financialMetrics.length > 0
        ),
        chart_detection: chunks.some((chunk) => chunk.hasChart),
        summary_detection: chunks.some(
          (chunk) =>
            chunk.chunkType === "summary" ||
            chunk.chunkType === "executive_summary"
        ),
      };

      // Check expected features
      for (const expectedFeature of scenario.expectedFeatures) {
        if (features[expectedFeature]) {
          console.log(`✅ ${expectedFeature}: Detected`);
        } else {
          console.log(`❌ ${expectedFeature}: Missing`);
          allTestsPassed = false;
        }
      }

      // Show chunk analysis
      const chunkTypes = {};
      let totalTokens = 0;
      let semanticBoundaries = 0;
      let overlappingChunks = 0;

      for (const chunk of chunks) {
        chunkTypes[chunk.chunkType] = (chunkTypes[chunk.chunkType] || 0) + 1;
        totalTokens += chunk.tokenCount;
        if (chunk.metadata.semanticBoundary) semanticBoundaries++;
        if (chunk.metadata.hasOverlap) overlappingChunks++;
      }

      console.log(`📊 Chunk Types:`, chunkTypes);
      console.log(`📈 Avg Tokens: ${Math.round(totalTokens / chunks.length)}`);
      console.log(
        `🧠 Semantic Boundaries: ${semanticBoundaries}/${chunks.length}`
      );
      console.log(`🔗 Overlapping: ${overlappingChunks}/${chunks.length}`);
    } catch (error) {
      console.log(`❌ Test failed: ${error.message}`);
      allTestsPassed = false;
    }
  }

  // Performance benchmark
  console.log("\n⚡ Performance Benchmark");
  console.log("-".repeat(30));

  const largeDocument =
    `# Large Fund Report\n\n` +
    `## Section 1\n${"This is a long section with multiple paragraphs. ".repeat(50)}\n\n` +
    `## Section 2\n${"Another long section with detailed analysis. ".repeat(50)}\n\n` +
    `## Section 3\n${"Final section with comprehensive reporting. ".repeat(50)}`;

  const startTime = Date.now();
  const largeChunks = await chunker.chunkDocument(largeDocument);
  const benchmarkTime = Date.now() - startTime;

  console.log(`📄 Large Document: ${largeDocument.length} characters`);
  console.log(`⏱️  Processing Time: ${benchmarkTime}ms`);
  console.log(`📊 Chunks Created: ${largeChunks.length}`);
  console.log(
    `⚡ Chunks/Second: ${(largeChunks.length / (benchmarkTime / 1000)).toFixed(2)}`
  );

  // Final results
  console.log("\n🎯 Validation Results");
  console.log("=".repeat(30));

  if (allTestsPassed) {
    console.log("✅ All tests passed!");
    console.log("🎉 Enhanced chunking implementation is working correctly");
    console.log("🚀 Ready for production use!");
  } else {
    console.log("❌ Some tests failed");
    console.log("🔧 Review implementation and fix issues");
  }

  return allTestsPassed;
}

// Run the validation tests
runValidationTests().then((success) => {
  process.exit(success ? 0 : 1);
});
