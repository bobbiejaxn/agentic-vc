# Task 018: Hybrid Chunking Implementation with Docling Inspiration

## 🎯 Objective
Implement advanced hybrid chunking inspired by Docling and the RAG agent reference, combining structural, semantic, and hierarchical chunking strategies to create contextually intelligent chunks optimized for the VC document analysis pipeline.

## 📋 Task Details

### **Type**: Algorithm Implementation & Document Processing
### **Priority**: High - Core enhancement to document understanding
### **Estimated Time**: 5-7 hours
### **Dependencies**: Task 016 (Database Cleanup), Task 017 (Modular Architecture)
### **Impact**: Critical - Improves extraction accuracy by 40% through better chunking

## 📖 Context & Problem Statement

### Current Chunking Limitations
The existing paragraph-based chunking in `enhancedProcessing.ts` has significant limitations:

1. **Simple Splitting**: Uses basic paragraph boundaries: `content.split(/\n\s*\n/)`
2. **No Context Awareness**: Doesn't understand document structure or semantics
3. **Fixed Chunk Sizes**: All chunks treated equally regardless of content type
4. **Lost Hierarchical Context**: No preservation of document structure relationships
5. **Poor Semantic Coherence**: Chunks may split related information across boundaries

### Hybrid Chunking Benefits
- **Structural Intelligence**: Understands headings, lists, tables, and document hierarchy
- **Semantic Boundaries**: Maintains semantic coherence within chunks
- **Context Preservation**: Preserves document hierarchy and relationships
- **Content-Type Awareness**: Different chunking strategies for different content types
- **Variable Chunk Sizes**: Optimizes chunk size based on content characteristics

## ✅ Acceptance Criteria

### Hybrid Chunking Requirements
- [ ] **Multi-Strategy Chunking**: Combine structural, semantic, and hierarchical approaches
- [ ] **Document Type Awareness**: Adapt chunking strategy based on document type
- [ ] **Context Preservation**: Maintain hierarchical relationships between chunks
- [ ] **Intelligent Boundary Detection**: Smart detection of natural content boundaries
- [ ] **Content-Type Optimization**: Different strategies for tables, lists, narrative text
- [ ] **Metadata Enrichment**: Rich metadata for each chunk including structure and context

### Performance and Quality
- [ ] **Processing Efficiency**: Complete processing within 30 seconds for typical VC reports
- [ ] **Chunk Quality**: 90%+ semantic coherence rating
- [ ] **Context Coverage**: Ensure no important information is lost in chunk boundaries
- [ ] **Embedding Quality**: Improved vector search results with better chunks

### Integration Requirements
- [ ] **Modular Integration**: Works seamlessly with modular agents from Task 017
- [ ] **Database Compatibility**: Stores in cleaned schema from Task 016
- [ ] **API Compatibility**: Drop-in replacement for existing chunking functions
- [ ] **Backward Compatibility**: Can process existing documents with new chunking

## 🔧 Technical Implementation Plan

### Phase 1: Docling-Inspired Analysis (1.5 hours)

#### 1.1 Docling Reference Implementation Analysis
```python
# Reference from docs/docling-rag-agent/ingestion/chunker.py
class DoclingChunker:
    def __init__(self):
        self.chunking_strategies = {
            'hierarchical': self.hierarchical_chunking,
            'semantic': self.semantic_chunking,
            'structural': self.structural_chunking
        }

    def hierarchical_chunking(self, document):
        # Maintain document hierarchy
        # Preserve parent-child relationships
        # Smart boundary detection
```

#### 1.2 TypeScript Hybrid Chunking Design
```typescript
// hybrid/hybridChunking.ts
interface DocumentStructure {
  type: 'heading' | 'paragraph' | 'table' | 'list' | 'image';
  content: string;
  level?: number; // For headings (1-6)
  metadata: {
    section: string;
    hierarchy: string[];
    position: number;
  };
}

interface ChunkingStrategy {
  name: string;
  canHandle(element: DocumentStructure): boolean;
  chunk(elements: DocumentStructure[]): Chunk[];
}

interface HybridChunk {
  id: string;
  content: string;
  type: ChunkType;
  sourceElements: DocumentStructure[];
  hierarchy: string[];
  context: ChunkContext;
  metadata: ChunkMetadata;
  embedding?: number[];
}
```

### Phase 2: Structural Analysis Implementation (2 hours)

#### 2.1 Document Structure Parser
```typescript
// hybrid/structuralAnalyzer.ts
export class StructuralAnalyzer {
  private patterns = {
    heading: /^(#{1,6})\s+(.+)$/m,
    table: /^\|(.+)\|$/gm,
    list: /^(\s*[-*+]\s+|\s*\d+\.\s+)/m,
    image: /^!\[.*?\]\(.*?\)$/m,
    paragraph: /^(?!#{1,6}|\||\s*[-*+]|\s*\d+\.|!).+$/m
  };

  analyzeDocument(content: string): DocumentStructure[] {
    const elements: DocumentStructure[] = [];
    const lines = content.split('\n');
    let currentHierarchy: string[] = [];
    let position = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const element = this.parseLine(line, currentHierarchy, position);
      if (element) {
        elements.push(element);

        // Update hierarchy for headings
        if (element.type === 'heading' && element.level) {
          this.updateHierarchy(currentHierarchy, element.level, element.content);
        }

        position++;
      }
    }

    return elements;
  }

  private parseLine(line: string, hierarchy: string[], position: number): DocumentStructure | null {
    // Check for headings
    const headingMatch = line.match(this.patterns.heading);
    if (headingMatch) {
      return {
        type: 'heading',
        content: headingMatch[2],
        level: headingMatch[1].length,
        metadata: {
          section: headingMatch[2],
          hierarchy: [...hierarchy],
          position
        }
      };
    }

    // Check for tables
    if (line.includes('|')) {
      return {
        type: 'table',
        content: line,
        metadata: {
          section: hierarchy[hierarchy.length - 1] || 'Unknown',
          hierarchy: [...hierarchy],
          position
        }
      };
    }

    // Check for lists
    const listMatch = line.match(this.patterns.list);
    if (listMatch) {
      return {
        type: 'list',
        content: line,
        metadata: {
          section: hierarchy[hierarchy.length - 1] || 'Unknown',
          hierarchy: [...hierarchy],
          position
        }
      };
    }

    // Default to paragraph
    return {
      type: 'paragraph',
      content: line,
      metadata: {
        section: hierarchy[hierarchy.length - 1] || 'Unknown',
        hierarchy: [...hierarchy],
        position
      }
    };
  }

  private updateHierarchy(hierarchy: string[], level: number, content: string): void {
    // Truncate hierarchy to current level
    hierarchy.length = level - 1;
    hierarchy.push(content);
  }
}
```

#### 2.2 Content Type Classification
```typescript
// hybrid/contentClassifier.ts
export class ContentClassifier {
  private financialPatterns = {
    metrics: /\b(irr|dpi|tvpi|moic|nav)\b/i,
    percentages: /\b\d+\.?\d*%\b/,
    currency: /\$\d+(,\d{3})*(\.\d+)?/,
    largeNumbers: /\b\d+(,\d{3})*\b/
  };

  private companyPatterns = {
    names: /\b[A-Z][a-z]+ (?:Inc|LLC|Corp|Ltd|Company)\b/,
    investments: /\b(invested|acquired|funded|raised)\b/i,
    valuations: /\b(valuation|worth|value)\b/i
  };

  classifyContent(element: DocumentStructure, context: string[]): ContentClassification {
    const content = element.content.toLowerCase();
    const fullContext = context.join(' ').toLowerCase();

    // Financial content detection
    const hasFinancialKeywords = Object.keys(this.financialPatterns).some(key =>
      this.financialPatterns[key as keyof typeof this.financialPatterns].test(content)
    );

    // Company content detection
    const hasCompanyKeywords = Object.keys(this.companyPatterns).some(key =>
      this.companyPatterns[key as keyof typeof this.companyPatterns].test(content)
    );

    // Market content detection
    const hasMarketKeywords = /\b(market|sector|industry|benchmark|trend)\b/i.test(content);

    // Determine primary content type
    if (hasFinancialKeywords && element.type === 'table') {
      return {
        primaryType: 'financial_table',
        confidence: 0.9,
        characteristics: ['financial', 'structured', 'metrics'],
        recommendedChunking: 'preserve_structure'
      };
    } else if (hasFinancialKeywords) {
      return {
        primaryType: 'fund_metrics',
        confidence: 0.8,
        characteristics: ['financial', 'metrics'],
        recommendedChunking: 'semantic_boundary'
      };
    } else if (hasCompanyKeywords) {
      return {
        primaryType: 'portfolio_company',
        confidence: 0.8,
        characteristics: ['company', 'investment'],
        recommendedChunking: 'entity_boundary'
      };
    } else if (hasMarketKeywords) {
      return {
        primaryType: 'market_data',
        confidence: 0.7,
        characteristics: ['market', 'analysis'],
        recommendedChunking: 'topic_boundary'
      };
    } else {
      return {
        primaryType: 'narrative_text',
        confidence: 0.6,
        characteristics: ['narrative'],
        recommendedChunking: 'paragraph_boundary'
      };
    }
  }
}
```

### Phase 3: Hybrid Chunking Strategies (2 hours)

#### 3.1 Strategy Pattern Implementation
```typescript
// hybrid/strategies/baseStrategy.ts
export abstract class ChunkingStrategy {
  abstract name: string;
  abstract canHandle(elements: DocumentStructure[], classification: ContentClassification): boolean;
  abstract chunk(elements: DocumentStructure[], classification: ContentClassification): Promise<HybridChunk[]>;

  protected createChunk(elements: DocumentStructure[], context: ChunkContext): HybridChunk {
    return {
      id: generateChunkId(),
      content: elements.map(e => e.content).join('\n'),
      type: this.determineChunkType(elements),
      sourceElements: elements,
      hierarchy: this.extractHierarchy(elements),
      context,
      metadata: this.generateMetadata(elements)
    };
  }

  protected abstract determineChunkType(elements: DocumentStructure[]): ChunkType;
  protected abstract extractHierarchy(elements: DocumentStructure[]): string[];
  protected abstract generateMetadata(elements: DocumentStructure[]): ChunkMetadata;
}
```

#### 3.2 Semantic Boundary Strategy
```typescript
// hybrid/strategies/semanticBoundaryStrategy.ts
export class SemanticBoundaryStrategy extends ChunkingStrategy {
  name = 'semantic_boundary';

  canHandle(elements: DocumentStructure[], classification: ContentClassification): boolean {
    return classification.recommendedChunking === 'semantic_boundary' ||
           classification.primaryType === 'fund_metrics';
  }

  async chunk(elements: DocumentStructure[], classification: ContentClassification): Promise<HybridChunk[]> {
    const chunks: HybridChunk[] = [];
    let currentChunk: DocumentStructure[] = [];
    let currentTopic: string | null = null;

    for (const element of elements) {
      const elementTopic = this.extractTopic(element);

      // Check if we have a topic boundary
      if (currentTopic && elementTopic && currentTopic !== elementTopic) {
        // Create chunk for current topic
        if (currentChunk.length > 0) {
          chunks.push(this.createChunk(currentChunk, {
            topic: currentTopic,
            semanticBoundary: true,
            contextElements: currentChunk.map(e => e.position)
          }));
          currentChunk = [];
        }
      }

      currentChunk.push(element);
      currentTopic = elementTopic;
    }

    // Don't forget the last chunk
    if (currentChunk.length > 0) {
      chunks.push(this.createChunk(currentChunk, {
        topic: currentTopic || 'unknown',
        semanticBoundary: true,
        contextElements: currentChunk.map(e => e.position)
      }));
    }

    return chunks;
  }

  private extractTopic(element: DocumentStructure): string | null {
    const content = element.content.toLowerCase();

    // Financial metrics topics
    if (content.includes('irr') || content.includes('dpi') || content.includes('tvpi')) {
      return 'fund_performance';
    }

    // Investment topics
    if (content.includes('invested') || content.includes('funding') || content.includes('capital')) {
      return 'investment_activity';
    }

    // Company topics
    if (content.includes('portfolio') || content.includes('company')) {
      return 'portfolio_companies';
    }

    // Market topics
    if (content.includes('market') || content.includes('sector') || content.includes('industry')) {
      return 'market_analysis';
    }

    return null;
  }

  protected determineChunkType(elements: DocumentStructure[]): ChunkType {
    const hasFinancialKeywords = elements.some(e =>
      /\b(irr|dpi|tvpi|nav)\b/i.test(e.content)
    );
    return hasFinancialKeywords ? 'fund_metrics' : 'narrative_text';
  }

  protected extractHierarchy(elements: DocumentStructure[]): string[] {
    return elements[0]?.metadata.hierarchy || [];
  }

  protected generateMetadata(elements: DocumentStructure[]): ChunkMetadata {
    return {
      elementCount: elements.length,
      hasTables: elements.some(e => e.type === 'table'),
      hasHeadings: elements.some(e => e.type === 'heading'),
      estimatedTokens: this.estimateTokens(elements),
      contentDensity: this.calculateContentDensity(elements)
    };
  }

  private estimateTokens(elements: DocumentStructure[]): number {
    const totalChars = elements.reduce((sum, e) => sum + e.content.length, 0);
    return Math.ceil(totalChars / 3.5); // Rough token estimation
  }

  private calculateContentDensity(elements: DocumentStructure[]): number {
    const totalChars = elements.reduce((sum, e) => sum + e.content.length, 0);
    const numbersAndSymbols = (elements.reduce((sum, e) =>
      sum + (e.content.match(/[\d$%]/g) || []).length, 0
    ));
    return numbersAndSymbols / totalChars;
  }
}
```

#### 3.3 Structure Preserving Strategy
```typescript
// hybrid/strategies/structurePreservingStrategy.ts
export class StructurePreservingStrategy extends ChunkingStrategy {
  name = 'preserve_structure';

  canHandle(elements: DocumentStructure[], classification: ContentClassification): boolean {
    return classification.recommendedChunking === 'preserve_structure' ||
           elements.some(e => e.type === 'table');
  }

  async chunk(elements: DocumentStructure[], classification: ContentClassification): Promise<HybridChunk[]> {
    const chunks: HybridChunk[] = [];
    let currentChunk: DocumentStructure[] = [];
    let currentTableRows: string[] = [];

    for (const element of elements) {
      if (element.type === 'table') {
        // Collect all consecutive table rows
        currentTableRows.push(element.content);

        // Check if this is the end of the table
        const nextElement = elements[elements.indexOf(element) + 1];
        if (!nextElement || nextElement.type !== 'table') {
          // Create chunk for the complete table
          chunks.push(this.createChunk([{
            ...element,
            content: currentTableRows.join('\n')
          }], {
            structureType: 'table',
            preservedStructure: true,
            contextElements: [element.position]
          }));
          currentTableRows = [];
        }
      } else {
        // For non-table elements, chunk by size and semantic boundaries
        if (this.shouldCreateChunk(currentChunk, element)) {
          if (currentChunk.length > 0) {
            chunks.push(this.createChunk(currentChunk, {
              structureType: 'mixed',
              preservedStructure: true,
              contextElements: currentChunk.map(e => e.position)
            }));
            currentChunk = [];
          }
        }
        currentChunk.push(element);
      }
    }

    // Handle remaining elements
    if (currentChunk.length > 0) {
      chunks.push(this.createChunk(currentChunk, {
        structureType: 'narrative',
        preservedStructure: true,
        contextElements: currentChunk.map(e => e.position)
      }));
    }

    return chunks;
  }

  private shouldCreateChunk(currentChunk: DocumentStructure[], newElement: DocumentStructure): boolean {
    const currentSize = this.estimateTokens(currentChunk);
    const newSize = currentSize + this.estimateTokens([newElement]);

    // Create chunk if size limit exceeded
    if (newSize > 600) return true;

    // Create chunk if new element is a heading
    if (newElement.type === 'heading') return true;

    return false;
  }

  // Similar implementation for other required methods...
}
```

#### 3.4 Entity Boundary Strategy
```typescript
// hybrid/strategies/entityBoundaryStrategy.ts
export class EntityBoundaryStrategy extends ChunkingStrategy {
  name = 'entity_boundary';

  canHandle(elements: DocumentStructure[], classification: ContentClassification): boolean {
    return classification.recommendedChunking === 'entity_boundary' ||
           classification.primaryType === 'portfolio_company';
  }

  async chunk(elements: DocumentStructure[], classification: ContentClassification): Promise<HybridChunk[]> {
    const chunks: HybridChunk[] = [];
    let currentEntity: DocumentStructure[] = [];
    let currentCompany: string | null = null;

    for (const element of elements) {
      const entityName = this.extractEntityName(element);

      // Check if we have an entity boundary
      if (currentCompany && entityName && currentCompany !== entityName) {
        if (currentEntity.length > 0) {
          chunks.push(this.createChunk(currentEntity, {
            entityName: currentCompany,
            entityType: 'company',
            entityBoundary: true,
            contextElements: currentEntity.map(e => e.position)
          }));
          currentEntity = [];
        }
      }

      currentEntity.push(element);
      currentCompany = entityName || currentCompany;
    }

    // Handle remaining elements
    if (currentEntity.length > 0) {
      chunks.push(this.createChunk(currentEntity, {
        entityName: currentCompany || 'unknown',
        entityType: 'company',
        entityBoundary: true,
        contextElements: currentEntity.map(e => e.position)
      }));
    }

    return chunks;
  }

  private extractEntityName(element: DocumentStructure): string | null {
    // Extract company names using patterns
    const companyPattern = /\b([A-Z][a-z]+ (?:Inc|LLC|Corp|Ltd|Company))\b/;
    const match = element.content.match(companyPattern);
    return match ? match[1] : null;
  }

  // Implementation for other required methods...
}
```

### Phase 4: Hybrid Chunking Orchestrator (1.5 hours)

#### 4.1 Main Hybrid Chunking Function
```typescript
// hybrid/hybridChunker.ts
export class HybridChunker {
  private strategies: ChunkingStrategy[] = [
    new StructurePreservingStrategy(),
    new SemanticBoundaryStrategy(),
    new EntityBoundaryStrategy(),
    new TopicBoundaryStrategy(),
    new DefaultStrategy() // Fallback strategy
  ];

  private structuralAnalyzer = new StructuralAnalyzer();
  private contentClassifier = new ContentClassifier();

  async createHybridChunks(
    content: string,
    documentId: string,
    options: ChunkingOptions = {}
  ): Promise<HybridChunk[]> {
    console.log(`🧠 Starting hybrid chunking for document ${documentId}`);
    console.log(`📊 Input content: ${content.length} characters`);

    // Step 1: Structural analysis
    const elements = this.structuralAnalyzer.analyzeDocument(content);
    console.log(`✅ Analyzed ${elements.length} structural elements`);

    // Step 2: Group elements into logical sections
    const sections = this.groupIntoSections(elements);
    console.log(`📑 Identified ${sections.length} logical sections`);

    // Step 3: Process each section with appropriate strategy
    const allChunks: HybridChunk[] = [];
    let sectionIndex = 0;

    for (const section of sections) {
      // Classify content for strategy selection
      const classification = this.contentClassifier.classifyContent(
        section.elements,
        section.hierarchy
      );

      // Select appropriate strategy
      const strategy = this.selectStrategy(section.elements, classification);
      console.log(`🎯 Section ${sectionIndex + 1}: Using ${strategy.name} strategy`);

      // Create chunks using selected strategy
      const chunks = await strategy.chunk(section.elements, classification);

      // Add section context to chunks
      const enrichedChunks = chunks.map(chunk => ({
        ...chunk,
        context: {
          ...chunk.context,
          sectionIndex,
          totalSections: sections.length,
          documentId
        }
      }));

      allChunks.push(...enrichedChunks);
      sectionIndex++;
    }

    console.log(`🎉 Created ${allChunks.length} hybrid chunks`);
    return allChunks;
  }

  private groupIntoSections(elements: DocumentStructure[]): DocumentSection[] {
    const sections: DocumentSection[] = [];
    let currentSection: DocumentStructure[] = [];
    let currentHierarchy: string[] = [];

    for (const element of elements) {
      // Check if this is a new section boundary
      if (element.type === 'heading' && element.level === 1) {
        // Save previous section
        if (currentSection.length > 0) {
          sections.push({
            elements: currentSection,
            hierarchy: [...currentHierarchy],
            type: 'section'
          });
        }

        // Start new section
        currentSection = [element];
        currentHierarchy = [element.content];
      } else {
        currentSection.push(element);

        // Update hierarchy for subheadings
        if (element.type === 'heading') {
          const level = element.level || 1;
          currentHierarchy.length = level - 1;
          currentHierarchy.push(element.content);
        }
      }
    }

    // Don't forget the last section
    if (currentSection.length > 0) {
      sections.push({
        elements: currentSection,
        hierarchy: currentHierarchy,
        type: 'section'
      });
    }

    return sections;
  }

  private selectStrategy(
    elements: DocumentStructure[],
    classification: ContentClassification
  ): ChunkingStrategy {
    for (const strategy of this.strategies) {
      if (strategy.canHandle(elements, classification)) {
        return strategy;
      }
    }

    // Fallback to default strategy
    return this.strategies[this.strategies.length - 1];
  }
}
```

#### 4.2 Integration with Existing Pipeline
```typescript
// enhancedProcessing.ts - Update to use hybrid chunking
export const processDocumentWithHybridChunking = internalAction({
  args: {
    documentId: v.id("documents"),
    content: v.string(),
    useHybridChunking: v.boolean() // Feature flag
  },
  handler: async (ctx, args) => {
    const startTime = Date.now();

    try {
      console.log(`🚀 HYBRID PROCESSING: Starting for document ${args.documentId}`);

      let chunks: HybridChunk[];

      if (args.useHybridChunking) {
        // Use new hybrid chunking
        const hybridChunker = new HybridChunker();
        chunks = await hybridChunker.createHybridChunks(
          args.content,
          args.documentId
        );
      } else {
        // Fallback to original chunking
        chunks = await createLegacyChunks(args.content);
      }

      console.log(`✅ Created ${chunks.length} chunks`);

      // Generate embeddings and store
      let storedCount = 0;
      for (const chunk of chunks) {
        try {
          // Generate embedding
          const embedding = await generateEmbedding(chunk.content);

          // Store using enhanced schema
          await ctx.runMutation(internal.hybridChunking.storeHybridChunk, {
            documentId: args.documentId,
            content: chunk.content,
            type: chunk.type,
            hierarchy: chunk.hierarchy,
            context: chunk.context,
            metadata: chunk.metadata,
            embedding
          });

          storedCount++;
        } catch (error) {
          console.error(`❌ Failed to store chunk:`, error);
        }
      }

      const processingTime = (Date.now() - startTime) / 1000;
      console.log(`🎉 HYBRID PROCESSING COMPLETED: ${storedCount}/${chunks.length} chunks stored`);

      return {
        success: true,
        chunksStored: storedCount,
        processingTime,
        chunkingMethod: args.useHybridChunking ? 'hybrid' : 'legacy'
      };

    } catch (error) {
      console.error(`❌ HYBRID PROCESSING FAILED:`, error);
      return {
        success: false,
        chunksStored: 0,
        processingTime: (Date.now() - startTime) / 1000,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
});
```

## 🧪 Testing Strategy

### Unit Testing
```typescript
// tests/hybridChunking.test.ts
describe('HybridChunking', () => {
  let hybridChunker: HybridChunker;

  beforeEach(() => {
    hybridChunker = new HybridChunker();
  });

  test('creates semantic chunks for financial content', async () => {
    const financialContent = `
      # Fund Performance
      The fund achieved an IRR of 15.2% and DPI of 1.2x.

      # Portfolio Companies
      Company A was acquired for $100M.
    `;

    const chunks = await hybridChunker.createHybridChunks(financialContent, 'test-doc');

    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.some(c => c.type === 'fund_metrics')).toBe(true);
    expect(chunks.some(c => c.type === 'portfolio_company')).toBe(true);
  });

  test('preserves table structure', async () => {
    const tableContent = `
      | Company | Investment | Valuation |
      |---------|------------|-----------|
      | Company A | $10M | $50M |
      | Company B | $5M | $25M |
    `;

    const chunks = await hybridChunker.createHybridChunks(tableContent, 'test-doc');

    expect(chunks.length).toBe(1);
    expect(chunks[0].content).toContain('Company A');
    expect(chunks[0].context.structureType).toBe('table');
  });

  test('detects entity boundaries', async () => {
    const companyContent = `
      Company Inc. was founded in 2020 and raised $10M.
      They have 50 employees and growing revenue.

      Company LLC was acquired for $100M in 2023.
      The acquisition provided 5x returns to investors.
    `;

    const chunks = await hybridChunker.createHybridChunks(companyContent, 'test-doc');

    expect(chunks.length).toBe(2);
    expect(chunks[0].context.entityName).toBe('Company Inc.');
    expect(chunks[1].context.entityName).toBe('Company LLC');
  });
});
```

### Integration Testing
```typescript
// tests/hybridIntegration.test.ts
describe('Hybrid Chunking Integration', () => {
  test('integrates with modular extraction agents', async () => {
    const documentId = await createTestDocument('financial-report.pdf');

    // Process with hybrid chunking
    const chunkingResult = await processDocumentWithHybridChunking(ctx, {
      documentId,
      content: testFinancialContent,
      useHybridChunking: true
    });

    expect(chunkingResult.success).toBe(true);
    expect(chunkingResult.chunkingMethod).toBe('hybrid');

    // Test with modular agents
    const extractionResult = await processWithModularExtraction(ctx, {
      documentId,
      agentNames: ['FundMetricsSpecialist']
    });

    expect(extractionResult.agentResults).toBeDefined();
  });

  test('improves extraction accuracy', async () => {
    const testCases = [
      { content: financialReportContent, expectedMetrics: 3 },
      { content: companyUpdateContent, expectedCompanies: 2 },
      { content: marketAnalysisContent, expectedInsights: 1 }
    ];

    for (const testCase of testCases) {
      // Compare extraction results with legacy vs hybrid chunking
      const legacyResults = await processWithLegacyChunking(testCase.content);
      const hybridResults = await processWithHybridChunking(testCase.content);

      expect(hybridResults.accuracy).toBeGreaterThan(legacyResults.accuracy);
    }
  });
});
```

## 🚨 Rollback Strategy

### Feature Flag Implementation
```typescript
// Use feature flag to control hybrid chunking rollout
const HYBRID_CHUNKING_ENABLED = process.env.HYBRID_CHUNKING_ENABLED === 'true';

export const processDocumentEnhanced = internalAction({
  args: { documentId: v.id("documents"), content: v.string() },
  handler: async (ctx, args) => {
    if (HYBRID_CHUNKING_ENABLED) {
      return processDocumentWithHybridChunking(ctx, {
        ...args,
        useHybridChunking: true
      });
    } else {
      return processDocumentWithLegacyChunking(ctx, args);
    }
  }
});
```

### Rollback Procedures
1. **Feature Flag Control**: Disable hybrid chunking via environment variable
2. **Parallel Processing**: Run both systems and compare results during transition
3. **Gradual Rollout**: Enable for specific document types first
4. **Performance Monitoring**: Monitor processing time and accuracy

## 📁 Files to Create/Modify

### New Files
- `convex/hybrid/hybridChunker.ts` - Main hybrid chunking orchestrator
- `convex/hybrid/structuralAnalyzer.ts` - Document structure analysis
- `convex/hybrid/contentClassifier.ts` - Content type classification
- `convex/hybrid/strategies/baseStrategy.ts` - Base strategy interface
- `convex/hybrid/strategies/semanticBoundaryStrategy.ts` - Semantic boundary chunking
- `convex/hybrid/strategies/structurePreservingStrategy.ts` - Structure-preserving chunking
- `convex/hybrid/strategies/entityBoundaryStrategy.ts` - Entity boundary chunking
- `convex/hybrid/strategies/topicBoundaryStrategy.ts` - Topic boundary chunking
- `convex/hybrid/strategies/defaultStrategy.ts` - Fallback strategy
- `convex/hybrid/types.ts` - Type definitions for hybrid chunking

### Modified Files
- `convex/enhancedProcessing.ts` - Integrate hybrid chunking option
- `convex/schema.ts` - Add hybrid chunking tables (if needed)
- `convex/queries.ts` - Add hybrid chunking queries
- `convex/ocrActionsFallback.ts` - Use hybrid chunking in OCR pipeline

## 📊 Success Metrics

### Chunking Quality Metrics
- **Semantic Coherence**: 90%+ of chunks maintain semantic unity
- **Context Preservation**: 95%+ of hierarchical relationships preserved
- **Boundary Accuracy**: 85%+ of chunk boundaries align with natural content breaks
- **Coverage Completeness**: 98%+ of important content included in chunks

### Processing Performance Metrics
- **Processing Speed**: Complete within 30 seconds for typical VC reports
- **Memory Efficiency**: 40% reduction in memory usage vs legacy approaches
- **Scalability**: Handle documents up to 10x current size

### Extraction Improvement Metrics
- **Accuracy Improvement**: 40% improvement in extraction accuracy
- **Confidence Scores**: 20% increase in average confidence scores
- **False Positive Reduction**: 50% reduction in false extractions

## 🔄 Dependencies and Integration

### Required Environment
- Database schema from Task 016
- Modular agents from Task 017
- GPT-4o-mini API access for content classification
- OpenAI embeddings API

### Integration Points
- Document processing pipeline
- Modular extraction agents
- Vector search and RAG functionality
- Frontend document viewing

## ⚠️ Risk Assessment

### High Risks
- **Performance Impact**: Hybrid chunking may be slower than simple paragraph splitting
  - *Mitigation*: Optimize algorithms, use caching, monitor performance
- **Boundary Detection Errors**: Incorrect chunk boundaries may split related information
  - *Mitigation*: Comprehensive testing, fallback strategies, user feedback mechanisms

### Medium Risks
- **Complexity Increase**: More complex system may be harder to maintain
  - *Mitigation*: Clear documentation, modular design, comprehensive tests
- **Compatibility Issues**: May not work well with existing agents
  - *Mitigation*: Careful integration testing, backward compatibility

## 📝 Implementation Notes

### Key Design Decisions
1. **Strategy Pattern**: Different chunking strategies for different content types
2. **Docling Inspiration**: Learn from proven hybrid chunking approaches
3. **Progressive Enhancement**: Can fall back to simple chunking if needed
4. **Context Preservation**: Maintain document hierarchy and relationships
5. **Modular Integration**: Works seamlessly with modular extraction agents

### Performance Considerations
- Use caching for content classification results
- Optimize regular expressions for content analysis
- Parallel process independent sections when possible
- Monitor and optimize memory usage for large documents

## 🎉 Completion Criteria

### Hybrid Chunking Implementation
- [ ] All chunking strategies implemented and tested
- [ ] Structural analyzer working for different document types
- [ ] Content classifier accurately categorizing content
- [ ] Hybrid orchestrator selecting appropriate strategies
- [ ] Integration with existing pipeline working

### Quality and Performance
- [ ] 90%+ semantic coherence in generated chunks
- [ ] Processing time under 30 seconds for typical documents
- [ ] Extraction accuracy improvement of 40%+
- [ ] Comprehensive test coverage (90%+)
- [ ] Performance benchmarks met

### Integration and Rollout
- [ ] Feature flag implementation working
- [ ] Backward compatibility maintained
- [ ] Rollback procedures tested
- [ ] Documentation complete
- [ ] Team training materials prepared

## 📚 Related Documentation

- [Extraction Pipeline Optimization Plan](/ai_docs/dev_docs/extraction-pipeline-optimization-plan.md)
- [Docling RAG Agent Reference](/refs/docling-rag-agent)
- [Hybrid Chunking Guidelines](/docs/guides/chunking/hybrid-chunking.md)
- [Task 016: Database Cleanup](016_database-cleanup-schema-optimization.md)
- [Task 017: Modular Extraction Architecture](017_modular-extraction-architecture.md)

## 🚀 Next Steps

After completing this hybrid chunking task:
1. **Task 019**: Implement Incremental Extraction Pipeline
2. **Task 020**: Add Smart Context Management
3. **Task 021**: Add Performance Monitoring and Analytics
4. **Task 022**: Complete End-to-End Integration Testing

This hybrid chunking implementation provides the intelligent document understanding foundation needed for accurate, context-aware extraction across the VC document analysis pipeline.