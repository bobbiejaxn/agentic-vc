### Title

Document Chunking: Hybrid Strategy Combining Structural and Semantic Analysis

### Issue

When implementing document processing for financial analysis, traditional chunking methods failed to provide the right balance of context preservation and searchability. Fixed-size chunks broke important context, while semantic-only chunks lost document structure critical for financial analysis.

### Root Cause

Financial documents require both:
1. **Structural Awareness**: Tables, sections, headers, and formatting that convey meaning
2. **Semantic Coherence**: Logical grouping of related concepts and topics
3. **Domain Intelligence**: Understanding of financial document patterns and terminology

Simple chunking strategies couldn't handle the complex requirements of VC portfolio analysis, where a single table might contain critical metrics that must be analyzed together.

### Solution / Fix

1. **Hybrid Chunking Strategy**: Combined structural and semantic analysis
2. **Tier-based Classification**: Categorized chunks by importance and type
3. **Metadata Enrichment**: Added rich context and importance scoring
4. **Vector Embeddings**: Generated semantic embeddings for intelligent search
5. **Content Type Detection**: Automatically identified different content types (tables, narratives, financial data)

```typescript
// Hybrid chunking with tier classification
async function hybridChunking(content: string, documentId: Id<"documents">) {
  // Step 1: Detect content structure and types
  const sections = extractSections(content);
  const tables = extractTables(content);
  const financialData = extractFinancialMetrics(content);
  const narrativeText = extractNarrativeContent(content);

  // Step 2: Create chunks based on content type
  const chunks: EnhancedChunk[] = [];

  // Table chunks - keep tables intact
  for (const table of tables) {
    chunks.push({
      content: table.content,
      type: "financial_table",
      tier: "tier1_critical",
      importance: 0.9,
      metadata: {
        hasHeaders: table.hasHeaders,
        rowCount: table.rowCount,
        columnCount: table.columnCount,
        tableType: classifyTableType(table.content),
        extractedMetrics: extractTableMetrics(table.content),
      },
      vectorEmbedding: await generateEmbedding(table.content),
    });
  }

  // Financial metrics chunks - high importance
  for (const metrics of financialData) {
    chunks.push({
      content: metrics.content,
      type: "fund_metrics",
      tier: "tier1_critical",
      importance: 0.85,
      metadata: {
        metricType: metrics.type,
        timePeriod: metrics.period,
        currency: metrics.currency,
        extractedValues: metrics.values,
      },
      vectorEmbedding: await generateEmbedding(metrics.content),
    });
  }

  // Narrative chunks - semantic processing
  for (const narrative of narrativeText) {
    // Split narratives into coherent segments
    const segments = await semanticSegmentation(narrative.content);

    for (const segment of segments) {
      const tier = classifyNarrativeImportance(segment, documentContext);
      chunks.push({
        content: segment.text,
        type: "narrative_text",
        tier,
        importance: calculateImportance(segment, tier),
        metadata: {
          section: narrative.section,
          subsection: segment.subsection,
          topics: extractTopics(segment.text),
          entities: extractEntities(segment.text),
          sentiment: analyzeSentiment(segment.text),
        },
        vectorEmbedding: await generateEmbedding(segment.text),
      });
    }
  }

  // Step 3: Store chunks with vector embeddings
  for (const chunk of chunks) {
    await ctx.db.insert("enhancedHybridChunks", {
      documentId,
      content: chunk.content,
      type: chunk.type,
      tier: chunk.tier,
      importance: chunk.importance,
      metadata: chunk.metadata,
      vectorEmbedding: chunk.vectorEmbedding,
      chunkIndex: chunks.indexOf(chunk),
      createdAt: Date.now(),
    });
  }

  return chunks;
}

// Tier classification based on content analysis
function classifyNarrativeImportance(segment: any, documentContext: any): "tier1_critical" | "tier2_strategic" | "tier3_analytics" {
  const text = segment.text.toLowerCase();

  // Tier 1: Critical financial metrics and performance data
  if (text.includes('return') || text.includes('irr') || text.includes('distributions') ||
      text.includes('capital') || text.includes('performance') || text.includes('fund metrics')) {
    return "tier1_critical" as const;
  }

  // Tier 2: Strategic information about companies and markets
  if (text.includes('portfolio') || text.includes('company') || text.includes('investment') ||
      text.includes('market') || text.includes('strategy') || text.includes('co-investor')) {
    return "tier2_strategic" as const;
  }

  // Tier 3: General analytical content
  return "tier3_analytics" as const;
}

// Importance scoring based on multiple factors
function calculateImportance(segment: any, tier: string): number {
  let baseScore = tier === "tier1_critical" ? 0.8 :
                  tier === "tier2_strategic" ? 0.6 : 0.4;

  // Boost score for specific indicators
  const text = segment.text.toLowerCase();
  if (text.includes('financial') || text.includes('performance') || text.includes('returns')) {
    baseScore += 0.2;
  }

  if (segment.hasNumbers || segment.hasDates) {
    baseScore += 0.1;
  }

  if (segment.length > 200) { // Substantial content
    baseScore += 0.05;
  }

  return Math.min(baseScore, 1.0);
}
```

### Lessons Learned

- **Hybrid Approach is Superior**: Combining structural and semantic analysis provides better results than either approach alone
- **Domain-Specific Intelligence**: Financial document understanding requires specialized knowledge of industry patterns and terminology
- **Tier-based Classification**: Not all content is equally important - categorizing by importance enables better analysis prioritization
- **Rich Metadata is Essential**: Contextual information (content type, importance, extracted entities) makes chunks much more useful
- **Vector Embeddings Enable Intelligence**: Semantic embeddings allow for intelligent search and similarity matching beyond simple keyword matching
- **Universal Application**: These chunking strategies apply to any domain requiring document analysis:
  - Legal document processing
  - Medical record analysis
  - Technical documentation
  - Research paper analysis
  - Contract review and analysis

- **Preserve Document Structure**: Don't break up tables, headers, or logical sections that need to be analyzed together
- **Content-Aware Processing**: Different content types (tables, narratives, lists) require different processing strategies
- **Quality Over Quantity**: Better to have fewer, higher-quality chunks than many small, context-poor ones
- **Iterative Refinement**: Chunking strategies should be continuously refined based on analysis quality and user feedback
- **Scalability Considerations**: Complex chunking algorithms must be balanced against processing time and computational costs