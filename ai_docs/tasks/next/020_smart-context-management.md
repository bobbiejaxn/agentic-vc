# Task 020: Smart Context Management and Optimization

## 🎯 Objective
Implement intelligent context optimization that uses the existing vector search and RAG infrastructure to provide the most relevant information to AI agents, reducing token usage by 60% while improving extraction accuracy through smart context selection and hierarchical understanding.

## 📋 Task Details

### **Type**: Context Optimization & AI Enhancement
### **Priority**: High - Critical for AI efficiency and accuracy
### **Estimated Time**: 5-7 hours
### **Dependencies**: Task 016 (Database Cleanup), Task 017 (Modular Architecture), Task 018 (Hybrid Chunking), Task 019 (Incremental Pipeline)
### **Impact**: Critical - 60% token reduction + 40% accuracy improvement

## 📖 Context & Problem Statement

### Current Context Management Issues
The existing context management approach has significant inefficiencies:

1. **All Chunks Approach**: Sends ALL document chunks to AI agents regardless of relevance
2. **Token Waste**: Massive token consumption on irrelevant information
3. **Context Confusion**: AI models confused by irrelevant or conflicting information
4. **No Hierarchy**: Flat context structure without understanding of document relationships
5. **Poor Performance**: Slow processing due to excessive context

### Smart Context Benefits
- **Intelligent Selection**: Only send relevant chunks based on query and agent type
- **Token Efficiency**: 60% reduction in token usage through relevance filtering
- **Hierarchical Context**: Maintain document structure and relationships
- **Agent-Specific Context**: Tailor context selection for each extraction agent
- **Dynamic Optimization**: Adapt context based on processing results and feedback

## ✅ Acceptance Criteria

### Context Optimization Requirements
- [ ] **Relevance Ranking**: Rank chunks by semantic relevance to specific queries
- [ ] **Agent-Specific Selection**: Different context strategies for each agent type
- [ ] **Hierarchical Preservation**: Maintain document hierarchy and relationships
- [ ] **Token Budget Management**: Optimize context within token limits
- [ ] **Dynamic Adaptation**: Learn from extraction results to improve context selection
- [ ] **Multi-Factor Scoring**: Combine semantic, structural, and importance signals

### Performance Improvements
- [ ] **Token Reduction**: 60% reduction in token usage vs current approach
- [ ] **Accuracy Improvement**: 40% improvement in extraction accuracy
- [ ] **Processing Speed**: 2x faster processing with optimized context
- [ ] **Relevance Precision**: 90%+ of context should be relevant to extraction task

### Integration Requirements
- [ ] **Vector Search Integration**: Leverage existing vector embeddings for relevance
- [ ] **Modular Agent Integration**: Work seamlessly with all modular agents
- [ ] **Real-time Optimization**: Adapt context selection during processing
- [ ] **Monitoring and Analytics**: Track context optimization effectiveness

## 🔧 Technical Implementation Plan

### Phase 1: Context Analysis and Scoring (2 hours)

#### 1.1 Context Scoring Framework
```typescript
// context/contextScorer.ts
interface ContextScore {
  semanticRelevance: number;    // Vector similarity to query
  structuralRelevance: number;  // Document structure importance
  agentRelevance: number;       // Agent-specific importance
  temporalRelevance: number;    // Time/recency importance
  confidence: number;           // Overall confidence
  factors: {
    hasFinancialData: boolean;
    hasKeyMetrics: boolean;
    sectionImportance: number;
    chunkDensity: number;
  };
}

export class ContextScorer {
  constructor(
    private embeddingService: EmbeddingService,
    private documentAnalyzer: DocumentAnalyzer
  ) {}

  async scoreChunkForQuery(
    chunk: ProcessedChunk,
    query: ExtractionQuery,
    agentType: string
  ): Promise<ContextScore> {
    const factors = await this.analyzeChunkFactors(chunk);

    return {
      semanticRelevance: await this.calculateSemanticRelevance(chunk, query),
      structuralRelevance: this.calculateStructuralRelevance(chunk, query),
      agentRelevance: this.calculateAgentRelevance(chunk, agentType),
      temporalRelevance: this.calculateTemporalRelevance(chunk),
      confidence: 0,
      factors
    };
  }

  private async analyzeChunkFactors(chunk: ProcessedChunk): Promise<ContextScore['factors']> {
    return {
      hasFinancialData: chunk.hasFinancialData,
      hasKeyMetrics: this.hasKeyMetrics(chunk.content),
      sectionImportance: this.getSectionImportance(chunk.section),
      chunkDensity: this.calculateContentDensity(chunk)
    };
  }

  private async calculateSemanticRelevance(
    chunk: ProcessedChunk,
    query: ExtractionQuery
  ): Promise<number> {
    // Generate query embedding
    const queryEmbedding = await this.embeddingService.generateEmbedding(
      query.query
    );

    // Calculate cosine similarity with chunk embedding
    return this.cosineSimilarity(queryEmbedding, chunk.embedding);
  }

  private calculateStructuralRelevance(
    chunk: ProcessedChunk,
    query: ExtractionQuery
  ): number {
    let relevance = 0;

    // Heading hierarchy importance
    const headingLevel = this.getHeadingLevel(chunk);
    relevance += (6 - headingLevel) * 0.1; // Higher headings more important

    // Section type relevance
    if (this.isExecutiveSummarySection(chunk.section)) {
      relevance += 0.3;
    } else if (this.isFinancialSection(chunk.section)) {
      relevance += 0.25;
    } else if (this.isPortfolioSection(chunk.section)) {
      relevance += 0.2;
    }

    return Math.min(relevance, 1);
  }

  private calculateAgentRelevance(
    chunk: ProcessedChunk,
    agentType: string
  ): number {
    const content = chunk.content.toLowerCase();

    switch (agentType) {
      case 'FundMetricsSpecialist':
        return this.calculateFundMetricsRelevance(content);
      case 'PortfolioCompanyIntelligence':
        return this.calculateCompanyRelevance(content);
      case 'CoInvestorAnalysis':
        return this.calculateCoInvestorRelevance(content);
      case 'MarketIntelligenceSynthesis':
        return this.calculateMarketRelevance(content);
      default:
        return 0.5; // Neutral relevance
    }
  }

  private calculateFundMetricsRelevance(content: string): number {
    const fundKeywords = [
      'irr', 'dpi', 'tvpi', 'nav', 'multiple', 'called capital',
      'distribution', 'commitment', 'fund performance', 'return'
    ];

    const matchCount = fundKeywords.filter(keyword =>
      content.includes(keyword)
    ).length;

    return Math.min(matchCount / fundKeywords.length, 1);
  }

  private calculateCompanyRelevance(content: string): number {
    const companyKeywords = [
      'portfolio company', 'investment', 'valuation', 'revenue',
      'growth', 'employees', 'acquisition', 'funding round'
    ];

    const matchCount = companyKeywords.filter(keyword =>
      content.includes(keyword)
    ).length;

    return Math.min(matchCount / companyKeywords.length, 1);
  }

  private hasKeyMetrics(content: string): boolean {
    const metricsPattern = /\b(\d+\.?\d*%|\$\d+(,\d{3})*(\.\d+)?|\d+x)\b/g;
    const metrics = content.match(metricsPattern);
    return metrics ? metrics.length >= 3 : false;
  }

  private calculateContentDensity(chunk: ProcessedChunk): number {
    // Calculate density of meaningful information
    const numbers = (chunk.content.match(/\d/g) || []).length;
    const totalChars = chunk.content.length;
    return numbers / totalChars;
  }
}
```

#### 1.2 Query Analysis and Intent Detection
```typescript
// context/queryAnalyzer.ts
export interface ExtractionQuery {
  query: string;
  type: 'fund_metrics' | 'company_intelligence' | 'co_investor' | 'market_intelligence';
  agentType: string;
  maxTokens: number;
  priority: 'low' | 'medium' | 'high';
  contextRequirements: {
    needsFinancialData: boolean;
    needsCompanyData: boolean;
    needsMarketData: boolean;
    timeHorizon?: 'recent' | 'historical' | 'all';
  };
}

export class QueryAnalyzer {
  analyzeQuery(query: string, agentType: string): ExtractionQuery {
    const intent = this.detectIntent(query);
    const contextRequirements = this.analyzeContextRequirements(query, agentType);

    return {
      query,
      type: intent,
      agentType,
      maxTokens: this.determineTokenLimit(intent, agentType),
      priority: this.determinePriority(query),
      contextRequirements
    };
  }

  private detectIntent(query: string): ExtractionQuery['type'] {
    const lowerQuery = query.toLowerCase();

    if (this.containsFundMetricsKeywords(lowerQuery)) {
      return 'fund_metrics';
    } else if (this.containsCompanyKeywords(lowerQuery)) {
      return 'company_intelligence';
    } else if (this.containsCoInvestorKeywords(lowerQuery)) {
      return 'co_investor';
    } else if (this.containsMarketKeywords(lowerQuery)) {
      return 'market_intelligence';
    } else {
      return 'fund_metrics'; // Default
    }
  }

  private containsFundMetricsKeywords(query: string): boolean {
    const keywords = ['irr', 'dpi', 'tvpi', 'fund performance', 'returns', 'multiple'];
    return keywords.some(keyword => query.includes(keyword));
  }

  private containsCompanyKeywords(query: string): boolean {
    const keywords = ['portfolio company', 'company', 'investment', 'valuation', 'revenue'];
    return keywords.some(keyword => query.includes(keyword));
  }

  private determineTokenLimit(intent: string, agentType: string): number {
    const baseLimits = {
      fund_metrics: 6000,
      company_intelligence: 8000,
      co_investor: 4000,
      market_intelligence: 10000
    };

    return baseLimits[intent] || 6000;
  }

  private analyzeContextRequirements(
    query: string,
    agentType: string
  ): ExtractionQuery['contextRequirements'] {
    return {
      needsFinancialData: agentType === 'FundMetricsSpecialist' ||
                        query.toLowerCase().includes('financial') ||
                        query.toLowerCase().includes('performance'),
      needsCompanyData: agentType === 'PortfolioCompanyIntelligence' ||
                       query.toLowerCase().includes('company') ||
                       query.toLowerCase().includes('portfolio'),
      needsMarketData: agentType === 'MarketIntelligenceSynthesis' ||
                      query.toLowerCase().includes('market') ||
                      query.toLowerCase().includes('industry'),
      timeHorizon: this.detectTimeHorizon(query)
    };
  }

  private detectTimeHorizon(query: string): 'recent' | 'historical' | 'all' {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('recent') || lowerQuery.includes('latest') ||
        lowerQuery.includes('current')) {
      return 'recent';
    } else if (lowerQuery.includes('historical') || lowerQuery.includes('past') ||
               lowerQuery.includes('since inception')) {
      return 'historical';
    } else {
      return 'all';
    }
  }
}
```

### Phase 2: Smart Context Selection Engine (2 hours)

#### 2.1 Context Selection Strategies
```typescript
// context/selectionStrategies.ts
export abstract class ContextSelectionStrategy {
  abstract name: string;

  abstract selectContext(
    chunks: ProcessedChunk[],
    query: ExtractionQuery,
    scores: Map<string, ContextScore>
  ): Promise<SelectedContext>;

  protected optimizeForTokenBudget(
    selectedChunks: ProcessedChunk[],
    maxTokens: number
  ): ProcessedChunk[] {
    let totalTokens = 0;
    const optimizedChunks: ProcessedChunk[] = [];

    for (const chunk of selectedChunks) {
      const chunkTokens = this.estimateTokens(chunk.content);

      if (totalTokens + chunkTokens <= maxTokens) {
        optimizedChunks.push(chunk);
        totalTokens += chunkTokens;
      } else {
        // Try to fit partial content
        const remainingTokens = maxTokens - totalTokens;
        if (remainingTokens > 100) { // Minimum meaningful chunk
          const partialContent = this.truncateContent(
            chunk.content,
            remainingTokens
          );
          optimizedChunks.push({
            ...chunk,
            content: partialContent,
            truncated: true
          });
        }
        break;
      }
    }

    return optimizedChunks;
  }

  private estimateTokens(content: string): number {
    return Math.ceil(content.length / 3.5);
  }

  private truncateContent(content: string, maxTokens: number): string {
    const maxChars = maxTokens * 3.5;
    return content.substring(0, Math.floor(maxChars)) + '...';
  }
}

export class RelevanceBasedSelection extends ContextSelectionStrategy {
  name = 'relevance_based';

  async selectContext(
    chunks: ProcessedChunk[],
    query: ExtractionQuery,
    scores: Map<string, ContextScore>
  ): Promise<SelectedContext> {
    // Sort chunks by overall relevance score
    const sortedChunks = chunks
      .map(chunk => ({
        chunk,
        score: scores.get(chunk.id) || { confidence: 0 } as ContextScore
      }))
      .sort((a, b) => b.score.confidence - a.score.confidence);

    // Optimize for token budget
    const optimizedChunks = this.optimizeForTokenBudget(
      sortedChunks.map(item => item.chunk),
      query.maxTokens
    );

    return {
      chunks: optimizedChunks,
      strategy: this.name,
      totalTokens: optimizedChunks.reduce((sum, chunk) =>
        sum + this.estimateTokens(chunk.content), 0
      ),
      relevanceScore: this.calculateAverageRelevance(optimizedChunks, scores),
      metadata: {
        selectionCriteria: 'semantic_relevance',
        chunksConsidered: chunks.length,
        chunksSelected: optimizedChunks.length
      }
    };
  }

  private calculateAverageRelevance(
    chunks: ProcessedChunk[],
    scores: Map<string, ContextScore>
  ): number {
    const totalRelevance = chunks.reduce((sum, chunk) => {
      const score = scores.get(chunk.id);
      return sum + (score?.confidence || 0);
    }, 0);

    return totalRelevance / chunks.length;
  }
}

export class HierarchicalSelection extends ContextSelectionStrategy {
  name = 'hierarchical';

  async selectContext(
    chunks: ProcessedChunk[],
    query: ExtractionQuery,
    scores: Map<string, ContextScore>
  ): Promise<SelectedContext> {
    // Group chunks by hierarchical context
    const hierarchicalGroups = this.groupByHierarchy(chunks);

    // Select top chunks from each important section
    const selectedChunks: ProcessedChunk[] = [];
    let remainingTokens = query.maxTokens;

    for (const [section, sectionChunks] of hierarchicalGroups) {
      if (remainingTokens <= 0) break;

      // Sort chunks in section by relevance
      const sortedSectionChunks = sectionChunks
        .map(chunk => ({
          chunk,
          score: scores.get(chunk.id) || { confidence: 0 } as ContextScore
        }))
        .sort((a, b) => b.score.confidence - a.score.confidence);

      // Select top chunks from this section
      const sectionTokens = Math.min(remainingTokens / 4, 2000); // Allocate tokens per section
      const sectionSelection = this.optimizeForTokenBudget(
        sortedSectionChunks.map(item => item.chunk),
        sectionTokens
      );

      selectedChunks.push(...sectionSelection);
      remainingTokens -= sectionSelection.reduce((sum, chunk) =>
        sum + this.estimateTokens(chunk.content), 0
      );
    }

    return {
      chunks: selectedChunks,
      strategy: this.name,
      totalTokens: query.maxTokens - remainingTokens,
      relevanceScore: this.calculateAverageRelevance(selectedChunks, scores),
      metadata: {
        selectionCriteria: 'hierarchical_distribution',
        sectionsConsidered: hierarchicalGroups.size,
        chunksSelected: selectedChunks.length
      }
    };
  }

  private groupByHierarchy(chunks: ProcessedChunk[]): Map<string, ProcessedChunk[]> {
    const groups = new Map<string, ProcessedChunk[]>();

    for (const chunk of chunks) {
      const sectionKey = chunk.section || 'Unknown';
      if (!groups.has(sectionKey)) {
        groups.set(sectionKey, []);
      }
      groups.get(sectionKey)!.push(chunk);
    }

    return groups;
  }
}

export class AgentSpecificSelection extends ContextSelectionStrategy {
  name = 'agent_specific';

  async selectContext(
    chunks: ProcessedChunk[],
    query: ExtractionQuery,
    scores: Map<string, ContextScore>
  ): Promise<SelectedContext> {
    // Filter chunks based on agent-specific requirements
    let relevantChunks = chunks;

    if (query.contextRequirements.needsFinancialData) {
      relevantChunks = relevantChunks.filter(chunk => chunk.hasFinancialData);
    }

    if (query.contextRequirements.needsCompanyData) {
      relevantChunks = relevantChunks.filter(chunk =>
        chunk.type === 'portfolio_company' ||
        chunk.content.toLowerCase().includes('company')
      );
    }

    // Filter by time horizon if specified
    if (query.contextRequirements.timeHorizon === 'recent') {
      relevantChunks = relevantChunks.filter(chunk =>
        this.isRecentContent(chunk)
      );
    }

    // Sort by agent relevance score
    const sortedChunks = relevantChunks
      .map(chunk => ({
        chunk,
        score: scores.get(chunk.id) || { confidence: 0 } as ContextScore
      }))
      .sort((a, b) => b.score.agentRelevance - a.score.agentRelevance);

    // Optimize for token budget
    const optimizedChunks = this.optimizeForTokenBudget(
      sortedChunks.map(item => item.chunk),
      query.maxTokens
    );

    return {
      chunks: optimizedChunks,
      strategy: this.name,
      totalTokens: optimizedChunks.reduce((sum, chunk) =>
        sum + this.estimateTokens(chunk.content), 0
      ),
      relevanceScore: this.calculateAverageRelevance(optimizedChunks, scores),
      metadata: {
        selectionCriteria: 'agent_specific',
        agentType: query.agentType,
        chunksConsidered: relevantChunks.length,
        chunksSelected: optimizedChunks.length
      }
    };
  }

  private isRecentContent(chunk: ProcessedChunk): boolean {
    // Check if chunk contains recent date indicators
    const recentKeywords = ['2024', '2025', 'current', 'latest', 'recent'];
    const content = chunk.content.toLowerCase();
    return recentKeywords.some(keyword => content.includes(keyword));
  }
}
```

#### 2.2 Smart Context Manager
```typescript
// context/smartContextManager.ts
export class SmartContextManager {
  private strategies: Map<string, ContextSelectionStrategy>;
  private scorer: ContextScorer;
  private queryAnalyzer: QueryAnalyzer;

  constructor(
    private embeddingService: EmbeddingService,
    private documentAnalyzer: DocumentAnalyzer
  ) {
    this.strategies = new Map([
      ['relevance_based', new RelevanceBasedSelection()],
      ['hierarchical', new HierarchicalSelection()],
      ['agent_specific', new AgentSpecificSelection()]
    ]);

    this.scorer = new ContextScorer(embeddingService, documentAnalyzer);
    this.queryAnalyzer = new QueryAnalyzer();
  }

  async buildOptimizedContext(
    documentId: string,
    query: string,
    agentType: string,
    options: ContextOptions = {}
  ): Promise<OptimizedContext> {
    const startTime = Date.now();

    // Analyze query
    const extractionQuery = this.queryAnalyzer.analyzeQuery(query, agentType);

    // Get all chunks for document
    const chunks = await this.getDocumentChunks(documentId, extractionQuery);

    console.log(`🧠 Building context: ${chunks.length} chunks available for ${agentType}`);

    // Score all chunks
    const scores = new Map<string, ContextScore>();
    for (const chunk of chunks) {
      const score = await this.scorer.scoreChunkForQuery(
        chunk,
        extractionQuery,
        agentType
      );
      scores.set(chunk.id, score);
    }

    // Select best strategy
    const strategy = this.selectOptimalStrategy(extractionQuery, chunks.length);
    console.log(`🎯 Using ${strategy.name} strategy for context selection`);

    // Select context using chosen strategy
    const selectedContext = await strategy.selectContext(
      chunks,
      extractionQuery,
      scores
    );

    // Build hierarchical context
    const hierarchicalContext = this.buildHierarchicalContext(
      selectedContext.chunks,
      extractionQuery
    );

    const processingTime = Date.now() - startTime;

    const result: OptimizedContext = {
      query: extractionQuery,
      chunks: selectedContext.chunks,
      context: hierarchicalContext,
      strategy: strategy.name,
      metrics: {
        totalChunksAvailable: chunks.length,
        chunksSelected: selectedContext.chunks.length,
        tokensUsed: selectedContext.totalTokens,
        tokenBudget: extractionQuery.maxTokens,
        tokenEfficiency: selectedContext.totalTokens / extractionQuery.maxTokens,
        averageRelevance: selectedContext.relevanceScore,
        processingTime
      },
      metadata: {
        documentId,
        agentType,
        selectedAt: Date.now(),
        selectionFactors: this.analyzeSelectionFactors(scores, selectedContext.chunks)
      }
    };

    console.log(`✅ Context built: ${result.chunks.length} chunks, ${result.metrics.tokensUsed} tokens`);
    console.log(`📊 Efficiency: ${Math.round(result.metrics.tokenEfficiency * 100)}% of budget used`);
    console.log(`🎯 Average relevance: ${Math.round(result.metrics.averageRelevance * 100)}%`);

    return result;
  }

  private async getDocumentChunks(
    documentId: string,
    query: ExtractionQuery
  ): Promise<ProcessedChunk[]> {
    // Use existing vector search to get relevant chunks
    const queryEmbedding = await this.embeddingService.generateEmbedding(query.query);

    // Get chunks with vector similarity
    const vectorResults = await this.vectorSearch(
      documentId,
      queryEmbedding,
      50 // Get more results initially for better selection
    );

    // Convert to ProcessedChunk format
    return vectorResults.map(result => ({
      id: result.chunkId,
      content: result.content,
      type: result.type,
      section: result.section,
      hierarchy: result.hierarchy,
      embedding: result.embedding,
      hasFinancialData: result.hasFinancialData,
      tokenCount: this.estimateTokens(result.content),
      metadata: result.metadata
    }));
  }

  private selectOptimalStrategy(
    query: ExtractionQuery,
    chunkCount: number
  ): ContextSelectionStrategy {
    // Strategy selection logic
    if (query.contextRequirements.needsFinancialData &&
        query.contextRequirements.needsCompanyData) {
      return this.strategies.get('agent_specific')!;
    } else if (chunkCount > 20) {
      return this.strategies.get('hierarchical')!;
    } else {
      return this.strategies.get('relevance_based')!;
    }
  }

  private buildHierarchicalContext(
    chunks: ProcessedChunk[],
    query: ExtractionQuery
  ): string {
    const sections = new Map<string, ProcessedChunk[]>();

    // Group chunks by section
    for (const chunk of chunks) {
      const section = chunk.section || 'General';
      if (!sections.has(section)) {
        sections.set(section, []);
      }
      sections.get(section)!.push(chunk);
    }

    // Build hierarchical context
    let context = `Document Analysis Context\n`;
    context += `Query: ${query.query}\n`;
    context += `Agent: ${query.agentType}\n\n`;

    for (const [section, sectionChunks] of sections) {
      context += `## ${section}\n\n`;

      for (const chunk of sectionChunks) {
        context += `${chunk.content}\n\n`;
      }
    }

    return context;
  }

  private analyzeSelectionFactors(
    scores: Map<string, ContextScore>,
    selectedChunks: ProcessedChunk[]
  ): SelectionFactors {
    const selectedScores = selectedChunks.map(chunk => scores.get(chunk.id)!);

    return {
      averageSemanticRelevance: this.average(selectedScores, s => s.semanticRelevance),
      averageAgentRelevance: this.average(selectedScores, s => s.agentRelevance),
      averageStructuralRelevance: this.average(selectedScores, s => s.structuralRelevance),
      chunksWithFinancialData: selectedScores.filter(s => s.factors.hasFinancialData).length,
      chunksWithKeyMetrics: selectedScores.filter(s => s.factors.hasKeyMetrics).length
    };
  }

  private average<T>(items: T[], selector: (item: T) => number): number {
    if (items.length === 0) return 0;
    const sum = items.reduce((total, item) => total + selector(item), 0);
    return sum / items.length;
  }

  private estimateTokens(content: string): number {
    return Math.ceil(content.length / 3.5);
  }
}
```

### Phase 3: Integration with Modular Agents (1.5 hours)

#### 3.1 Enhanced Agent Integration
```typescript
// agents/enhancedAgent.ts
export abstract class EnhancedExtractionAgent<T = any> implements ExtractionAgent<T> {
  protected contextManager: SmartContextManager;

  constructor(
    protected config: AgentConfig,
    contextManager: SmartContextManager
  ) {
    this.contextManager = contextManager;
  }

  async extractWithSmartContext(
    documentId: string,
    query: string,
    options: ExtractionOptions = {}
  ): Promise<EnhancedExtractionResult<T>> {
    const startTime = Date.now();

    try {
      // Build optimized context
      const optimizedContext = await this.contextManager.buildOptimizedContext(
        documentId,
        query,
        this.name,
        {
          maxTokens: options.maxTokens || this.config.defaultTokenLimit,
          strategy: options.contextStrategy
        }
      );

      console.log(`🧠 ${this.name}: Using ${optimizedContext.chunks.length} chunks (${optimizedContext.metrics.tokensUsed} tokens)`);

      // Perform extraction with optimized context
      const extractionResult = await this.performExtraction(
        optimizedContext.context,
        query,
        optimizedContext
      );

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        data: extractionResult.data,
        confidence: extractionResult.confidence,
        context: {
          chunksUsed: optimizedContext.chunks.length,
          tokensUsed: optimizedContext.metrics.tokensUsed,
          strategy: optimizedContext.strategy,
          relevanceScore: optimizedContext.metrics.averageRelevance
        },
        performance: {
          processingTime,
          tokenEfficiency: optimizedContext.metrics.tokenEfficiency,
          contextBuildingTime: optimizedContext.metrics.processingTime
        },
        metadata: {
          agent: this.name,
          documentId,
          query,
          extractedAt: Date.now(),
          contextMetrics: optimizedContext.metrics
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          agent: this.name,
          documentId,
          query,
          extractedAt: Date.now()
        }
      };
    }
  }

  protected abstract performExtraction(
    context: string,
    query: string,
    optimizedContext: OptimizedContext
  ): Promise<ExtractionResult<T>>;
}

// Enhanced Fund Metrics Agent with Smart Context
export class EnhancedFundMetricsAgent extends EnhancedExtractionAgent<FundMetrics> {
  readonly name = "EnhancedFundMetricsSpecialist";

  protected async performExtraction(
    context: string,
    query: string,
    optimizedContext: OptimizedContext
  ): Promise<ExtractionResult<FundMetrics>> {
    const prompt = `
      You are a fund performance metrics extraction specialist with access to optimized document context.

      Query: ${query}

      Document Context (optimized for relevance):
      ${context}

      Extract precise financial metrics from the provided context. Focus on:
      - IRR (Net and Gross)
      - DPI (Distributions to Paid-in Capital)
      - TVPI (Total Value to Paid-in Capital)
      - Called Capital and Committed Capital
      - Distributions to investors
      - Fund NAV
      - MOIC and other performance multiples

      Requirements:
      1. Only extract metrics that are explicitly mentioned in the context
      2. Provide confidence scores for each extracted metric
      3. If metrics are presented in ranges, extract the full range
      4. Note the time period for each metric
      5. Distinguish between net vs gross values

      Return structured JSON with all available metrics.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: "Extract the fund metrics from the context above." }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1 // Lower temperature for consistent extraction
      });

      const extractedData = JSON.parse(response.choices[0].message.content || '{}');
      const fundMetrics = this.structureFundMetrics(extractedData);
      const confidence = this.calculateExtractionConfidence(extractedData, optimizedContext);

      return {
        success: true,
        type: 'fund_metrics',
        data: fundMetrics,
        confidence,
        metadata: {
          model: 'gpt-4o-mini',
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          contextRelevance: optimizedContext.metrics.averageRelevance
        }
      };

    } catch (error) {
      return {
        success: false,
        reason: `Extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private structureFundMetrics(raw: any): FundMetrics {
    return {
      irr: raw.irr || raw.netIrr ? {
        net: raw.netIrr || raw.irr,
        gross: raw.grossIrr,
        asOf: raw.irrAsOf,
        period: raw.irrPeriod
      } : null,

      dpi: raw.dpi ? {
        value: raw.dpi,
        asOf: raw.dpiAsOf,
        multiple: raw.dpiMultiple
      } : null,

      tvpi: raw.tvpi ? {
        value: raw.tvpi,
        asOf: raw.tvpiAsOf,
        multiple: raw.tvpiMultiple
      } : null,

      calledCapital: raw.calledCapital,
      committedCapital: raw.committedCapital,
      distributions: raw.distributions,
      fundNAV: raw.fundNAV,

      timestamp: Date.now(),
      extractionMetadata: {
        confidence: this.overallConfidence(raw),
        sourceQuality: 'high', // Based on smart context selection
        dataCompleteness: this.calculateCompleteness(raw)
      }
    };
  }

  private calculateExtractionConfidence(
    extractedData: any,
    optimizedContext: OptimizedContext
  ): number {
    // Base confidence from context relevance
    let confidence = optimizedContext.metrics.averageRelevance * 0.4;

    // Boost based on data completeness
    const dataFields = Object.keys(extractedData).length;
    const expectedFields = 8; // Expected number of key metrics
    const completenessScore = Math.min(dataFields / expectedFields, 1);
    confidence += completenessScore * 0.3;

    // Boost based on context quality
    const contextQuality = optimizedContext.metrics.tokenEfficiency > 0.7 ? 0.2 : 0.1;
    confidence += contextQuality;

    // Boost based on financial data presence
    const hasFinancialData = optimizedContext.metadata.selectionFactors.chunksWithFinancialData > 0;
    confidence += hasFinancialData ? 0.1 : 0;

    return Math.min(confidence, 1);
  }
}
```

#### 3.2 Smart Context Actions
```typescript
// actions/smartContextActions.ts
export const extractWithSmartContext = internalAction({
  args: {
    documentId: v.id("documents"),
    agentType: v.string(),
    query: v.string(),
    options: v.optional(v.object({
      maxTokens: v.number(),
      contextStrategy: v.string(),
      includeMetadata: v.boolean()
    }))
  },
  handler: async (ctx, args) => {
    const startTime = Date.now();

    try {
      // Initialize smart context manager
      const embeddingService = new OpenAIEmbeddingService();
      const documentAnalyzer = new DocumentAnalyzer(ctx);
      const contextManager = new SmartContextManager(embeddingService, documentAnalyzer);

      // Get appropriate enhanced agent
      const agent = getEnhancedAgent(args.agentType, contextManager);

      // Perform extraction with smart context
      const result = await agent.extractWithSmartContext(
        args.documentId,
        args.query,
        args.options
      );

      // Store extraction results
      if (result.success) {
        await ctx.runMutation(internal.extraction.storeSmartExtractionResult, {
          documentId: args.documentId,
          agentType: args.agentType,
          query: args.query,
          result: result.data,
          confidence: result.confidence,
          context: result.context,
          performance: result.performance,
          metadata: result.metadata
        });
      }

      const processingTime = Date.now() - startTime;

      console.log(`🎉 Smart Context Extraction completed:`);
      console.log(`   Agent: ${args.agentType}`);
      console.log(`   Success: ${result.success}`);
      console.log(`   Tokens Used: ${result.context?.tokensUsed || 0}`);
      console.log(`   Processing Time: ${processingTime}ms`);

      return {
        success: result.success,
        data: result.data,
        confidence: result.confidence,
        context: result.context,
        performance: result.performance,
        processingTime
      };

    } catch (error) {
      console.error(`❌ Smart Context Extraction failed:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      };
    }
  }
});

function getEnhancedAgent(agentType: string, contextManager: SmartContextManager): EnhancedExtractionAgent {
  const config = getAgentConfig(agentType);

  switch (agentType) {
    case 'EnhancedFundMetricsSpecialist':
      return new EnhancedFundMetricsAgent(config, contextManager);
    case 'EnhancedPortfolioCompanyIntelligence':
      return new EnhancedPortfolioCompanyAgent(config, contextManager);
    case 'EnhancedCoInvestorAnalysis':
      return new EnhancedCoInvestorAgent(config, contextManager);
    case 'EnhancedMarketIntelligenceSynthesis':
      return new EnhancedMarketIntelligenceAgent(config, contextManager);
    default:
      throw new Error(`Unknown enhanced agent type: ${agentType}`);
  }
}
```

### Phase 4: Performance Monitoring and Analytics (1.5 hours)

#### 4.1 Context Performance Tracking
```typescript
// analytics/contextAnalytics.ts
export const trackContextPerformance = internalMutation({
  args: {
    documentId: v.id("documents"),
    agentType: v.string(),
    contextMetrics: v.object({
      totalChunksAvailable: v.number(),
      chunksSelected: v.number(),
      tokensUsed: v.number(),
      tokenBudget: v.number(),
      averageRelevance: v.number(),
      processingTime: v.number(),
      strategy: v.string()
    }),
    extractionMetrics: v.object({
      success: v.boolean(),
      confidence: v.number(),
      extractionTime: v.number()
    })
  },
  handler: async (ctx, args) => {
    // Store performance analytics
    await ctx.db.insert("contextPerformanceAnalytics", {
      documentId: args.documentId,
      agentType: args.agentType,
      timestamp: Date.now(),
      contextMetrics: args.contextMetrics,
      extractionMetrics: args.extractionMetrics,
      calculatedMetrics: {
        tokenEfficiency: args.contextMetrics.tokensUsed / args.contextMetrics.tokenBudget,
        chunkSelectionRatio: args.contextMetrics.chunksSelected / args.contextMetrics.totalChunksAvailable,
        relevanceScore: args.contextMetrics.averageRelevance,
        overallEfficiency: calculateOverallEfficiency(args.contextMetrics, args.extractionMetrics)
      }
    });
  }
});

function calculateOverallEfficiency(
  contextMetrics: any,
  extractionMetrics: any
): number {
  const tokenEfficiency = 1 - (contextMetrics.tokensUsed / contextMetrics.tokenBudget);
  const relevanceScore = contextMetrics.averageRelevance;
  const successWeight = extractionMetrics.success ? 1 : 0;
  const confidenceScore = extractionMetrics.confidence;

  return (tokenEfficiency * 0.3 + relevanceScore * 0.3 + successWeight * 0.2 + confidenceScore * 0.2);
}

export const getContextPerformanceAnalytics = query({
  args: {
    agentType: v.optional(v.string()),
    timeRange: v.optional(v.object({
      start: v.number(),
      end: v.number()
    }))
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("contextPerformanceAnalytics");

    if (args.agentType) {
      query = query.withIndex("by_agent", q => q.eq("agentType", args.agentType));
    }

    if (args.timeRange) {
      query = query.filter(q =>
        q.and(
          q.gte(q.field("timestamp"), args.timeRange!.start),
          q.lte(q.field("timestamp"), args.timeRange!.end)
        )
      );
    }

    return await query.order("desc").take(100);
  }
});
```

#### 4.2 Performance Dashboard
```typescript
// src/components/ContextPerformanceDashboard.tsx
export function ContextPerformanceDashboard() {
  const analytics = useQuery(api.analytics.getContextPerformanceAnalytics);

  if (!analytics) return <div>Loading analytics...</div>;

  // Calculate aggregate metrics
  const totalExtractions = analytics.length;
  const successfulExtractions = analytics.filter(a => a.extractionMetrics.success).length;
  const averageTokenEfficiency = analytics.reduce((sum, a) =>
    sum + a.calculatedMetrics.tokenEfficiency, 0) / totalExtractions;
  const averageRelevance = analytics.reduce((sum, a) =>
    sum + a.contextMetrics.averageRelevance, 0) / totalExtractions;

  return (
    <div className="context-performance-dashboard">
      <h2>Smart Context Performance Analytics</h2>

      <div className="metrics-grid">
        <Card>
          <CardHeader>
            <CardTitle>Total Extractions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExtractions}</div>
            <div className="text-sm text-muted-foreground">
              {successfulExtractions} successful
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Token Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(averageTokenEfficiency * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">
              Average across all extractions
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Context Relevance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(averageRelevance * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">
              Average relevance score
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((successfulExtractions / totalExtractions) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">
              Extraction success rate
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategy Performance Breakdown */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Strategy Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <StrategyPerformanceChart analytics={analytics} />
        </CardContent>
      </Card>
    </div>
  );
}
```

## 🧪 Testing Strategy

### Context Optimization Testing
```typescript
// tests/smartContext.test.ts
describe('Smart Context Management', () => {
  let contextManager: SmartContextManager;
  let testDocumentId: string;

  beforeEach(async () => {
    contextManager = new SmartContextManager(mockEmbeddingService, mockDocumentAnalyzer);
    testDocumentId = await createTestDocumentWithChunks();
  });

  test('reduces token usage by 60% while maintaining accuracy', async () => {
    const query = "Extract fund performance metrics including IRR, DPI, and TVPI";

    // Build context with smart optimization
    const optimizedContext = await contextManager.buildOptimizedContext(
      testDocumentId,
      query,
      'FundMetricsSpecialist'
    );

    // Simulate traditional approach (all chunks)
    const allChunks = await getAllChunks(testDocumentId);
    const traditionalTokens = allChunks.reduce((sum, chunk) => sum + chunk.tokenCount, 0);

    // Verify token reduction
    const tokenReduction = 1 - (optimizedContext.metrics.tokensUsed / traditionalTokens);
    expect(tokenReduction).toBeGreaterThan(0.6); // At least 60% reduction

    // Verify context relevance
    expect(optimizedContext.metrics.averageRelevance).toBeGreaterThan(0.8);

    console.log(`Token reduction: ${Math.round(tokenReduction * 100)}%`);
    console.log(`Traditional tokens: ${traditionalTokens}`);
    console.log(`Optimized tokens: ${optimizedContext.metrics.tokensUsed}`);
  });

  test('selects agent-specific context effectively', async () => {
    const fundQuery = "Extract fund performance metrics";
    const companyQuery = "Extract portfolio company information";

    const fundContext = await contextManager.buildOptimizedContext(
      testDocumentId,
      fundQuery,
      'FundMetricsSpecialist'
    );

    const companyContext = await contextManager.buildOptimizedContext(
      testDocumentId,
      companyQuery,
      'PortfolioCompanyIntelligence'
    );

    // Verify different context selection for different agents
    expect(fundContext.chunks).not.toEqual(companyContext.chunks);

    // Verify agent-specific relevance
    expect(fundContext.metadata.selectionFactors.chunksWithFinancialData).toBeGreaterThan(
      companyContext.metadata.selectionFactors.chunksWithFinancialData
    );
  });

  test('improves extraction accuracy with optimized context', async () => {
    const query = "Extract fund performance metrics";

    // Compare extraction accuracy with and without smart context
    const optimizedResult = await extractWithSmartContext(testDocumentId, query, {
      useSmartContext: true
    });

    const traditionalResult = await extractWithTraditionalContext(testDocumentId, query, {
      useSmartContext: false
    });

    // Verify accuracy improvement
    expect(optimizedResult.confidence).toBeGreaterThan(traditionalResult.confidence);
    expect(optimizedResult.data?.quality).toBeGreaterThanOrEqual(traditionalResult.data?.quality);
  });
});
```

### Performance Testing
```typescript
// tests/contextPerformance.test.ts
describe('Context Performance', () => {
  test('processes context optimization within 5 seconds', async () => {
    const documentId = await createLargeTestDocument(); // 100+ chunks
    const query = "Extract comprehensive financial analysis";

    const startTime = Date.now();
    const context = await contextManager.buildOptimizedContext(
      documentId,
      query,
      'FundMetricsSpecialist'
    );
    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(5000); // 5 seconds
    expect(context.chunks.length).toBeGreaterThan(0);
    expect(context.metrics.tokensUsed).toBeLessThan(8000);
  });

  test('scales efficiently with document size', async () => {
    const documentSizes = [10, 50, 100, 200]; // Number of chunks
    const performanceData: any[] = [];

    for (const size of documentSizes) {
      const documentId = await createTestDocumentWithSize(size);
      const startTime = Date.now();

      const context = await contextManager.buildOptimizedContext(
        documentId,
        "Extract fund metrics",
        'FundMetricsSpecialist'
      );

      const duration = Date.now() - startTime;

      performanceData.push({
        documentSize: size,
        processingTime: duration,
        tokensUsed: context.metrics.tokensUsed,
        chunksSelected: context.chunks.length
      });
    }

    // Verify linear scaling (not exponential)
    const timeComplexity = calculateTimeComplexity(performanceData);
    expect(timeComplexity).toBeLessThan(2); // Should be closer to O(n) than O(n²)
  });
});
```

## 🚨 Rollback Strategy

### Feature Flag Control
```typescript
const SMART_CONTEXT_ENABLED = process.env.SMART_CONTEXT_ENABLED === 'true';

export const extractWithAgent = internalAction({
  args: {
    documentId: v.id("documents"),
    agentType: v.string(),
    query: v.string()
  },
  handler: async (ctx, args) => {
    if (SMART_CONTEXT_ENABLED) {
      return extractWithSmartContext(ctx, args);
    } else {
      // Fallback to traditional context approach
      return extractWithTraditionalContext(ctx, args);
    }
  }
});
```

### Gradual Rollout
1. **A/B Testing**: Compare smart context vs traditional approach
2. **User Segments**: Enable for specific users or document types first
3. **Performance Monitoring**: Continuous monitoring of token usage and accuracy
4. **Rollback Triggers**: Automatic rollback if performance degrades

## 📁 Files to Create/Modify

### New Files
- `convex/context/smartContextManager.ts` - Main context optimization logic
- `convex/context/contextScorer.ts` - Context relevance scoring
- `convex/context/queryAnalyzer.ts` - Query intent analysis
- `convex/context/selectionStrategies.ts` - Context selection strategies
- `convex/agents/enhancedAgent.ts` - Enhanced agents with smart context
- `convex/agents/enhancedFundMetricsAgent.ts` - Enhanced fund metrics agent
- `convex/actions/smartContextActions.ts` - Smart context extraction actions
- `convex/analytics/contextAnalytics.ts` - Performance tracking and analytics
- Frontend components for performance visualization

### Modified Files
- `convex/schema.ts` - Add context analytics tables
- `convex/queries.ts` - Add context analytics queries
- Existing agent implementations to use enhanced context
- Frontend extraction components

## 📊 Success Metrics

### Token Efficiency Metrics
- **Token Reduction**: 60% reduction in token usage vs traditional approach
- **Context Relevance**: 85%+ average relevance score for selected context
- **Processing Speed**: 2x faster processing with optimized context
- **Budget Utilization**: 70-90% efficient use of token budgets

### Accuracy and Quality Metrics
- **Extraction Accuracy**: 40% improvement in extraction accuracy
- **Confidence Scores**: 20% increase in average confidence scores
- **False Positive Reduction**: 50% reduction in false extractions
- **Data Completeness**: Maintained or improved data completeness

### Performance and Scalability
- **Context Building Time**: Under 3 seconds for typical documents
- **Memory Efficiency**: 40% reduction in memory usage
- **Scalability**: Linear scaling with document size
- **Agent Performance**: Improved agent performance across all types

## 🔄 Dependencies and Integration

### Required Environment
- Database schema from Task 016
- Modular agents from Task 017
- Hybrid chunking from Task 018
- Incremental pipeline from Task 019
- OpenAI embeddings API
- GPT-4o-mini API access

### Integration Points
- All modular extraction agents
- Vector search and RAG system
- Performance monitoring and analytics
- Frontend extraction interfaces
- Pipeline orchestration system

## ⚠️ Risk Assessment

### High Risks
- **Complexity**: Increased system complexity may impact maintainability
  - *Mitigation*: Comprehensive documentation, modular design, extensive testing
- **Performance Overhead**: Context optimization may add processing time
  - *Mitigation*: Performance optimization, caching, parallel processing

### Medium Risks
- **Selection Accuracy**: Poor context selection may reduce extraction quality
  - *Mitigation*: Continuous learning, A/B testing, user feedback
- **Resource Consumption**: Vector search and scoring may consume resources
  - *Mitigation*: Efficient algorithms, caching, resource monitoring

## 📝 Implementation Notes

### Key Design Decisions
1. **Multi-Factor Scoring**: Combine semantic, structural, and agent-specific relevance
2. **Strategy Pattern**: Different selection strategies for different scenarios
3. **Token Budget Management**: Intelligent optimization within token limits
4. **Performance Monitoring**: Comprehensive analytics for continuous improvement
5. **Agent Integration**: Seamless integration with existing modular agents

### 12 Factor Principles Applied
- **Factor 2 (Dependencies)**: Clear dependency management for context services
- **Factor 3 (Config)**: Configurable context selection and optimization
- **Factor 11 (Logs)**: Comprehensive logging for debugging and optimization
- **Factor 12 (Admin)**: Administrative processes for monitoring and tuning

## 🎉 Completion Criteria

### Smart Context Implementation
- [ ] Context scoring framework working with multi-factor relevance
- [ ] Multiple selection strategies implemented and tested
- [ ] Smart context manager with strategy selection working
- [ ] Integration with all modular extraction agents
- [ ] Performance monitoring and analytics functional

### Performance and Quality
- [ ] 60% token reduction achieved vs traditional approach
- [ ] 40% extraction accuracy improvement verified
- [ ] Context building time under 3 seconds for typical documents
- [ ] 85%+ average context relevance score
- [ ] Comprehensive performance analytics working

### Integration and Monitoring
- [ ] All enhanced agents using smart context
- [ ] Performance dashboard showing optimization metrics
- [ ] A/B testing framework comparing old vs new approach
- [ ] Feature flags for gradual rollout
- [ ] Rollback procedures tested and documented

## 📚 Related Documentation

- [Extraction Pipeline Optimization Plan](/ai_docs/dev_docs/extraction-pipeline-optimization-plan.md)
- [12 Factor Agent Guidelines](https://github.com/humanlayer/12-factor-agents)
- [Task 016: Database Cleanup](016_database-cleanup-schema-optimization.md)
- [Task 017: Modular Extraction Architecture](017_modular-extraction-architecture.md)
- [Task 018: Hybrid Chunking Implementation](018_hybrid-chunking-implementation.md)
- [Task 019: Incremental Extraction Pipeline](019_incremental-extraction-pipeline.md)

## 🚀 Next Steps

After completing this smart context management task:
1. **Comprehensive Integration Testing**: End-to-end testing of complete optimized pipeline
2. **Performance Benchmarking**: Baseline and optimized performance comparison
3. **Documentation and Training**: Team documentation and training materials
4. **Production Rollout**: Gradual production deployment with monitoring

This smart context management system provides the intelligence needed to make AI extraction more efficient, accurate, and cost-effective while maintaining the flexibility to adapt to different extraction scenarios and requirements.