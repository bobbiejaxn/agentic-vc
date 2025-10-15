# Task 017: Modular Extraction Architecture Implementation

## 🎯 Objective
Implement a modular extraction architecture that breaks away from the monolithic approach, enabling independent development, testing, and deployment of extraction components following 12 Factor Agent principles.

## 📋 Task Details

### **Type**: Architecture & Refactoring
### **Priority**: High - Foundation for incremental extraction improvements
### **Estimated Time**: 6-8 hours
### **Dependencies**: Task 016 (Database Cleanup)
### **Impact**: Critical - Enables agile extraction development and testing

## 📖 Context & Problem Statement

### Current Monolithic Issues
The existing extraction system suffers from monolithic architecture problems:

1. **All-or-Nothing Processing**: Extraction fails completely if any component fails
2. **Tightly Coupled Components**: Changes in one area affect entire pipeline
3. **Difficult Testing**: Can't test individual extraction components in isolation
4. **Deployment Complexity**: Must deploy entire system for any single change
5. **Poor Error Isolation**: Single component failure breaks entire pipeline

### Modular Architecture Goals
- **Independent Components**: Each extraction type works independently
- **Incremental Processing**: Can add/update extraction types without affecting others
- **Isolated Testing**: Test each component in isolation
- **Resilient Processing**: Failures in one component don't affect others
- **Scalable Development**: Team can work on different components simultaneously

## ✅ Acceptance Criteria

### Modular Architecture Requirements
- [ ] **Specialized Agent Classes**: Separate classes for each extraction domain
- [ ] **Independent Processing**: Each agent works independently without affecting others
- [ ] **Standardized Interface**: Common interface for all extraction agents
- [ ] **Isolated Storage**: Each component stores results in dedicated tables
- [ ] **Flexible Orchestration**: Can run individual or multiple agents as needed
- [ ] **Error Isolation**: Failures in one agent don't affect others

### Development Experience
- [ ] **Easy Testing**: Can test each agent in isolation
- [ ] **Simple Debugging**: Clear logs and error handling per component
- [ ] **Modular Development**: Can add new extraction types without changing existing code
- [ ] **Configuration-Driven**: Agent behavior configurable without code changes

### Code Quality
- [ ] **Type Safety**: Strong TypeScript types for all components
- [ ] **Clear Interfaces**: Well-defined contracts between components
- [ ] **Documentation**: Comprehensive documentation for each agent
- [ ] **Error Handling**: Robust error handling and recovery

## 🔧 Technical Implementation Plan

### Phase 1: Architecture Design (2 hours)

#### 1.1 Agent Interface Design
```typescript
// Base interface for all extraction agents
interface ExtractionAgent<T = any> {
  readonly name: string;
  readonly version: string;
  readonly supportedTypes: ContentType[];

  // Core extraction methods
  canProcess(chunk: ProcessedChunk): boolean;
  extract(chunk: ProcessedChunk): Promise<ExtractionResult<T>>;
  validate(result: ExtractionResult<T>): ValidationResult;

  // Configuration and monitoring
  configure(config: AgentConfig): void;
  getMetrics(): AgentMetrics;
}
```

#### 1.2 Domain-Specific Agents
```typescript
// Fund Metrics Specialist Agent
class FundMetricsAgent implements ExtractionAgent<FundMetrics> {
  readonly name = "FundMetricsSpecialist";
  readonly version = "1.0.0";
  readonly supportedTypes = ["fund_metrics", "financial_table"];

  async extract(chunk: ProcessedChunk): Promise<ExtractionResult<FundMetrics>> {
    // Specialized fund metrics extraction logic
  }
}

// Portfolio Company Intelligence Agent
class PortfolioCompanyAgent implements ExtractionAgent<CompanyIntelligence> {
  readonly name = "PortfolioCompanyIntelligence";
  readonly version = "1.0.0";
  readonly supportedTypes = ["portfolio_company", "investment"];

  async extract(chunk: ProcessedChunk): Promise<ExtractionResult<CompanyIntelligence>> {
    // Specialized company intelligence extraction logic
  }
}

// Co-Investor Analysis Agent
class CoInvestorAgent implements ExtractionAgent<CoInvestorData> {
  readonly name = "CoInvestorAnalysis";
  readonly version = "1.0.0";
  readonly supportedTypes = ["co_investor", "partner"];

  async extract(chunk: ProcessedChunk): Promise<ExtractionResult<CoInvestorData>> {
    // Specialized co-investor extraction logic
  }
}

// Market Intelligence Synthesis Agent
class MarketIntelligenceAgent implements ExtractionAgent<MarketInsights> {
  readonly name = "MarketIntelligenceSynthesis";
  readonly version = "1.0.0";
  readonly supportedTypes = ["market_data", "sector"];

  async extract(chunk: ProcessedChunk): Promise<ExtractionResult<MarketInsights>> {
    // Specialized market intelligence synthesis logic
  }
}
```

#### 1.3 Agent Registry and Orchestration
```typescript
// Agent Registry for discovering and managing agents
class AgentRegistry {
  private agents: Map<string, ExtractionAgent> = new Map();

  register(agent: ExtractionAgent): void {
    this.agents.set(agent.name, agent);
  }

  getAgentsForType(contentType: ContentType): ExtractionAgent[] {
    return Array.from(this.agents.values())
      .filter(agent => agent.supportedTypes.includes(contentType));
  }

  getAgent(name: string): ExtractionAgent | undefined {
    return this.agents.get(name);
  }
}

// Modular Extraction Orchestrator
class ModularExtractionOrchestrator {
  constructor(private registry: AgentRegistry) {}

  async processChunk(chunk: ProcessedChunk, agentNames?: string[]): Promise<ExtractionResults> {
    // Get agents that can process this chunk
    const eligibleAgents = agentNames
      ? agentNames.map(name => this.registry.getAgent(name)).filter(Boolean) as ExtractionAgent[]
      : this.registry.getAgentsForType(chunk.type);

    const results: ExtractionResults = {
      chunkId: chunk.id,
      timestamp: Date.now(),
      extractions: [],
      errors: []
    };

    // Process chunk with each eligible agent independently
    for (const agent of eligibleAgents) {
      try {
        if (agent.canProcess(chunk)) {
          const result = await agent.extract(chunk);
          if (result.success) {
            results.extractions.push({
              agent: agent.name,
              type: result.type,
              data: result.data,
              confidence: result.confidence
            });
          }
        }
      } catch (error) {
        // Log error but don't fail other agents
        results.errors.push({
          agent: agent.name,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        console.error(`Agent ${agent.name} failed:`, error);
      }
    }

    return results;
  }
}
```

### Phase 2: Individual Agent Implementation (3 hours)

#### 2.1 Fund Metrics Specialist Agent
```typescript
// agents/fundMetricsAgent.ts
export class FundMetricsAgent implements ExtractionAgent<FundMetrics> {
  private openai: OpenAI;
  private config: FundMetricsConfig;

  constructor(config: FundMetricsConfig) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.config = config;
  }

  canProcess(chunk: ProcessedChunk): boolean {
    const content = chunk.content.toLowerCase();
    return chunk.hasFinancialData && (
      content.includes('irr') ||
      content.includes('dpi') ||
      content.includes('tvpi') ||
      content.includes('fund') ||
      chunk.type === 'fund_metrics'
    );
  }

  async extract(chunk: ProcessedChunk): Promise<ExtractionResult<FundMetrics>> {
    if (!this.canProcess(chunk)) {
      return { success: false, reason: 'Cannot process this chunk type' };
    }

    const prompt = `
      You are a fund performance metrics extraction specialist.
      Extract precise financial metrics from this document chunk.

      Context: ${chunk.section}
      Content Type: ${chunk.type}
      Importance: ${chunk.importance}

      Extract the following metrics if present:
      - IRR (Net and Gross)
      - DPI (Distributions to Paid-in Capital)
      - TVPI (Total Value to Paid-in Capital)
      - Called Capital
      - Distributions
      - Fund NAV
      - MOIC (Multiple on Invested Capital)

      Return JSON with confidence scores for each metric.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini", // Using GPT-4o-mini as specified
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: chunk.content }
        ],
        response_format: { type: "json_object" }
      });

      const extractedData = JSON.parse(response.choices[0].message.content || '{}');

      // Validate and structure the results
      const fundMetrics = this.structureFundMetrics(extractedData);
      const confidence = this.calculateConfidence(extractedData, chunk);

      return {
        success: true,
        type: 'fund_metrics',
        data: fundMetrics,
        confidence,
        metadata: {
          agent: this.name,
          processingTime: Date.now(),
          chunkId: chunk.id
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
    // Structure and validate the extracted metrics
    return {
      irr: raw.irr ? { value: raw.irr.value, confidence: raw.irr.confidence || 0.8 } : null,
      dpi: raw.dpi ? { value: raw.dpi.value, confidence: raw.dpi.confidence || 0.8 } : null,
      tvpi: raw.tvpi ? { value: raw.tvpi.value, confidence: raw.tvpi.confidence || 0.8 } : null,
      calledCapital: raw.calledCapital,
      distributions: raw.distributions,
      fundNAV: raw.fundNAV,
      timestamp: Date.now()
    };
  }

  private calculateConfidence(data: any, chunk: ProcessedChunk): number {
    // Calculate confidence based on data completeness and chunk characteristics
    const hasFinancialData = chunk.hasFinancialData ? 0.2 : 0;
    const dataCompleteness = Object.keys(data).length / 6; // 6 key metrics expected
    const importanceFactor = chunk.importance / 100;

    return Math.min(1, hasFinancialData + (dataCompleteness * 0.5) + (importanceFactor * 0.3));
  }
}
```

#### 2.2 Portfolio Company Intelligence Agent
```typescript
// agents/portfolioCompanyAgent.ts
export class PortfolioCompanyAgent implements ExtractionAgent<CompanyIntelligence> {
  // Similar implementation pattern for company intelligence extraction
  // Focus on company names, valuations, investment details, performance metrics
}
```

#### 2.3 Co-Investor Analysis Agent
```typescript
// agents/coInvestorAgent.ts
export class CoInvestorAgent implements ExtractionAgent<CoInvestorData> {
  // Specialized for co-investor relationship mapping and analysis
}
```

#### 2.4 Market Intelligence Synthesis Agent
```typescript
// agents/marketIntelligenceAgent.ts
export class MarketIntelligenceAgent implements ExtractionAgent<MarketInsights> {
  // Synthesizes market insights across multiple chunks and documents
}
```

### Phase 3: Integration and Orchestration (2 hours)

#### 3.1 Agent Registration System
```typescript
// orchestration/agentRegistry.ts
export const initializeAgentRegistry = (): AgentRegistry => {
  const registry = new AgentRegistry();

  // Register all available agents
  registry.register(new FundMetricsAgent(fundMetricsConfig));
  registry.register(new PortfolioCompanyAgent(companyConfig));
  registry.register(new CoInvestorAgent(coInvestorConfig));
  registry.register(new MarketIntelligenceAgent(marketConfig));

  return registry;
};
```

#### 3.2 Modular Extraction Actions
```typescript
// actions/modularExtraction.ts
export const processWithModularExtraction = internalAction({
  args: {
    documentId: v.id("documents"),
    agentNames: v.optional(v.array(v.string())), // Optional specific agents
    chunkIds: v.optional(v.array(v.id("chunks"))), // Optional specific chunks
  },
  handler: async (ctx, args) => {
    // Initialize agent registry
    const registry = initializeAgentRegistry();
    const orchestrator = new ModularExtractionOrchestrator(registry);

    // Get chunks to process
    const chunks = await getChunksForProcessing(ctx, args.documentId, args.chunkIds);

    const results: ProcessingResults = {
      documentId: args.documentId,
      totalChunks: chunks.length,
      processedChunks: 0,
      agentResults: {},
      errors: []
    };

    // Process each chunk independently
    for (const chunk of chunks) {
      try {
        const chunkResults = await orchestrator.processChunk(chunk, args.agentNames);

        // Store results from each agent independently
        for (const extraction of chunkResults.extractions) {
          await storeExtractionResult(ctx, {
            documentId: args.documentId,
            chunkId: chunk.id,
            agent: extraction.agent,
            type: extraction.type,
            data: extraction.data,
            confidence: extraction.confidence,
            timestamp: Date.now()
          });
        }

        results.processedChunks++;
        results.agentResults[chunk.id] = chunkResults;

      } catch (error) {
        results.errors.push({
          chunkId: chunk.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        console.error(`Failed to process chunk ${chunk.id}:`, error);
      }
    }

    return results;
  }
});
```

#### 3.3 Individual Agent Actions
```typescript
// Enable running individual agents
export const processWithFundMetricsAgent = internalAction({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return processWithModularExtraction(ctx, {
      documentId: args.documentId,
      agentNames: ["FundMetricsSpecialist"]
    });
  }
});

export const processWithCompanyAgent = internalAction({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return processWithModularExtraction(ctx, {
      documentId: args.documentId,
      agentNames: ["PortfolioCompanyIntelligence"]
    });
  }
});
```

### Phase 4: Storage and Query Updates (1 hour)

#### 4.1 Modular Storage Tables
```typescript
// Schema updates for modular extraction
const modularSchema = {
  // Agent-specific result tables
  fundMetricsExtractions: {
    id: v.id("fundMetricsExtractions"),
    documentId: v.id("documents"),
    chunkId: v.id("chunks"),
    agent: v.string(),
    data: v.object(FundMetricsSchema),
    confidence: v.number(),
    timestamp: v.number()
  },

  companyIntelligenceExtractions: {
    id: v.id("companyIntelligenceExtractions"),
    documentId: v.id("documents"),
    chunkId: v.id("chunks"),
    agent: v.string(),
    data: v.object(CompanyIntelligenceSchema),
    confidence: v.number(),
    timestamp: v.number()
  },

  // Similar tables for other agent types
};
```

#### 4.2 Modular Queries
```typescript
// queries/modularQueries.ts
export const getFundMetricsExtractions = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("fundMetricsExtractions")
      .withIndex("by_document", q => q.eq("documentId", args.documentId))
      .collect();
  }
});

export const getCompanyIntelligenceExtractions = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("companyIntelligenceExtractions")
      .withIndex("by_document", q => q.eq("documentId", args.documentId))
      .collect();
  }
});
```

## 🧪 Testing Strategy

### Unit Testing
```typescript
// tests/fundMetricsAgent.test.ts
describe('FundMetricsAgent', () => {
  let agent: FundMetricsAgent;

  beforeEach(() => {
    agent = new FundMetricsAgent(testConfig);
  });

  test('can process fund metrics chunks', () => {
    const fundChunk = createTestChunk({
      type: 'fund_metrics',
      content: 'IRR: 15.2%, DPI: 1.2x'
    });
    expect(agent.canProcess(fundChunk)).toBe(true);
  });

  test('cannot process narrative chunks', () => {
    const narrativeChunk = createTestChunk({
      type: 'narrative_text',
      content: 'This is a story about...'
    });
    expect(agent.canProcess(narrativeChunk)).toBe(false);
  });

  test('extracts fund metrics correctly', async () => {
    const chunk = createFundMetricsTestChunk();
    const result = await agent.extract(chunk);

    expect(result.success).toBe(true);
    expect(result.data?.irr).toBeDefined();
    expect(result.confidence).toBeGreaterThan(0.7);
  });
});
```

### Integration Testing
```typescript
// tests/modularExtraction.test.ts
describe('ModularExtractionOrchestrator', () => {
  test('processes chunk with multiple agents independently', async () => {
    const orchestrator = new ModularExtractionOrchestrator(testRegistry);
    const chunk = createTestChunk();

    const results = await orchestrator.processChunk(chunk);

    expect(results.extractions.length).toBeGreaterThan(0);
    expect(results.errors.length).toBe(0);
  });

  test('isolates agent failures', async () => {
    const orchestrator = new ModularExtractionOrchestrator(testRegistryWithFailingAgent);
    const chunk = createTestChunk();

    const results = await orchestrator.processChunk(chunk);

    expect(results.extractions.length).toBeGreaterThan(0); // Other agents still work
    expect(results.errors.length).toBe(1); // Failing agent isolated
  });
});
```

## 🚨 Rollback Strategy

### Rollback Procedures
1. **Feature Flags**: Use feature flags to enable/disable modular extraction
2. **Parallel Processing**: Run both old and new systems in parallel during transition
3. **Gradual Migration**: Migrate document processing gradually
4. **Data Compatibility**: Ensure new results are compatible with existing frontend

### Rollback Triggers
- High error rates (>15% failure rate)
- Performance degradation (>30% slower processing)
- Data quality issues (confidence scores <70%)

## 📁 Files to Create/Modify

### New Files
- `convex/agents/base/ExtractionAgent.ts` - Base interface and types
- `convex/agents/fundMetricsAgent.ts` - Fund metrics specialist
- `convex/agents/portfolioCompanyAgent.ts` - Company intelligence specialist
- `convex/agents/coInvestorAgent.ts` - Co-investor analysis specialist
- `convex/agents/marketIntelligenceAgent.ts` - Market intelligence synthesis
- `convex/orchestration/agentRegistry.ts` - Agent registration system
- `convex/orchestration/modularOrchestrator.ts` - Modular extraction orchestration
- `convex/actions/modularExtraction.ts` - Modular extraction actions

### Modified Files
- `convex/schema.ts` - Add modular extraction tables
- `convex/queries.ts` - Add modular extraction queries
- `convex/extractionOrchestrator.ts` - Integrate with modular system
- Frontend files to use new modular queries

## 📊 Success Metrics

### Development Metrics
- **Agent Independence**: Each agent can be developed and tested independently
- **Code Reusability**: Shared interfaces and utilities reduce duplication by 40%
- **Testing Coverage**: 90%+ test coverage for individual agents
- **Error Isolation**: Single agent failure doesn't affect overall processing

### Performance Metrics
- **Processing Speed**: 25% improvement through parallel agent processing
- **Error Rate**: 50% reduction in processing failures through error isolation
- **Development Velocity**: 2x faster development of new extraction types
- **Debugging Time**: 60% reduction in debugging time

## 🔄 Dependencies and Integration

### Required Environment
- GPT-4o-mini API access
- Database schema from Task 016
- Testing environment with realistic financial documents

### Integration Points
- Document processing pipeline
- Chunk storage system (from Task 016)
- Frontend data visualization
- Error monitoring and logging

## ⚠️ Risk Assessment

### High Risks
- **Complexity Increase**: Mitigation through clear interfaces and documentation
- **Performance Overhead**: Mitigation through efficient agent orchestration
- **Testing Complexity**: Mitigation through comprehensive unit and integration tests

### Medium Risks
- **Data Consistency**: Mitigation through careful schema design
- **Learning Curve**: Mitigation through detailed documentation and examples

## 📝 Implementation Notes

### Key Architectural Decisions
1. **Interface-First Design**: All agents implement common ExtractionAgent interface
2. **Error Isolation**: Agent failures don't affect other agents
3. **Configuration-Driven**: Agent behavior configurable without code changes
4. **Parallel Processing**: Agents can run in parallel for better performance

### 12 Factor Agent Principles Applied
- **Factor 1 (Codebase)**: One repo, modular agent architecture
- **Factor 2 (Dependencies)**: Clear dependency declaration and isolation
- **Factor 3 (Config)**: Configuration-driven agent behavior
- **Factor 10 (Processes)**: Stateless agent processes for reliability

## 🎉 Completion Criteria

### Architecture Implementation
- [ ] All four domain agents implemented and tested
- [ ] Agent registry and orchestration system working
- [ ] Modular extraction actions functional
- [ ] Error isolation verified (agent failures don't affect others)
- [ ] Individual agent actions working

### Integration and Testing
- [ ] All agents can run independently
- [ ] Combined processing works with multiple agents
- [ ] Unit tests for each agent (90%+ coverage)
- [ ] Integration tests for orchestration system
- [ ] Frontend integration working with new modular system

### Performance and Quality
- [ ] Processing speed improvement (target: 25% faster)
- [ ] Error rate reduction (target: 50% fewer failures)
- [ ] Documentation complete for all agents
- [ ] Rollback procedures tested

## 📚 Related Documentation

- [Extraction Pipeline Optimization Plan](/ai_docs/dev_docs/extraction-pipeline-optimization-plan.md)
- [12 Factor Agent Guidelines](https://github.com/humanlayer/12-factor-agents)
- [GPT-4o-mini API Documentation](https://platform.openai.com/docs/models/gpt-4o-mini)
- [Task 016: Database Cleanup](016_database-cleanup-schema-optimization.md)

## 🚀 Next Steps

After completing this modular architecture task:
1. **Task 018**: Implement Hybrid Chunking from Docling Inspiration
2. **Task 019**: Implement Incremental Extraction Pipeline
3. **Task 020**: Add Smart Context Management
4. **Task 021**: Add Performance Monitoring and Analytics

This modular architecture provides the foundation for agile, resilient extraction processing that can evolve independently for each domain while maintaining overall system stability.