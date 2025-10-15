# Task 019: Incremental Extraction Pipeline Implementation

## 🎯 Objective
Implement an incremental extraction pipeline that moves away from the monolithic "all-or-nothing" approach to a resilient, progressive processing system that can handle partial failures, resume processing, and provide real-time feedback during document analysis.

## 📋 Task Details

### **Type**: Pipeline Architecture & Resilience Engineering
### **Priority**: High - Critical for system reliability and user experience
### **Estimated Time**: 7-9 hours
### **Dependencies**: Task 016 (Database Cleanup), Task 017 (Modular Architecture), Task 018 (Hybrid Chunking)
### **Impact**: Critical - Enables fault-tolerant processing and better user experience

## 📖 Context & Problem Statement

### Current Monolithic Pipeline Issues
The existing extraction system suffers from significant reliability problems:

1. **All-or-Nothing Processing**: Single failure breaks entire document processing
2. **No Progress Tracking**: Users have no visibility into processing progress
3. **Failure Recovery**: Must restart entire processing if any component fails
4. **Poor User Experience**: Long processing times with no feedback
5. **Resource Inefficiency**: Failed processing wastes computation time and API costs

### Incremental Pipeline Benefits
- **Resilient Processing**: Component failures don't break entire pipeline
- **Progressive Processing**: Can process and store results incrementally
- **Real-time Feedback**: Users can see processing progress and partial results
- **Efficient Recovery**: Can resume processing from point of failure
- **Better Resource Utilization**: Only reprocess failed components, not entire document

## ✅ Acceptance Criteria

### Incremental Processing Requirements
- [ ] **Step-by-Step Processing**: Break extraction into discrete, independent steps
- [ ] **Progress Tracking**: Real-time status updates for each processing step
- [ ] **Partial Result Storage**: Store results as they become available
- [ ] **Failure Isolation**: Failures in one step don't prevent other steps from completing
- [ ] **Resume Capability**: Can resume processing from any failed step
- [ ] **Rollback Support**: Can rollback partial results if needed

### User Experience Requirements
- [ ] **Real-time Progress**: Live progress indicators during processing
- [ ] **Partial Results Display**: Show available results even if processing incomplete
- [ ] **Error Transparency**: Clear error messages for failed steps
- [ ] **Retry Mechanisms**: Users can retry failed steps individually
- [ ] **Processing Control**: Users can pause, resume, or cancel processing

### System Reliability Requirements
- [ ] **80% Success Rate**: At least 80% of documents should have some successful extraction
- [ ] **Fast Recovery**: Resume processing within 5 seconds of failure
- [ ] **Resource Efficiency**: 50% reduction in redundant processing
- [ ] **Monitoring**: Comprehensive logging and monitoring of pipeline health

## 🔧 Technical Implementation Plan

### Phase 1: Pipeline State Management (2 hours)

#### 1.1 Pipeline State Schema
```typescript
// pipeline/pipelineState.ts
interface PipelineStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startTime?: number;
  endTime?: number;
  duration?: number;
  result?: PipelineStepResult;
  error?: string;
  retryCount: number;
  dependencies: string[]; // Other steps this depends on
  parallelGroup?: string; // Can run in parallel with steps in same group
}

interface PipelineState {
  id: string;
  documentId: string;
  status: 'initialized' | 'running' | 'completed' | 'failed' | 'paused';
  currentStep?: string;
  totalSteps: number;
  completedSteps: number;
  failedSteps: number;
  startTime: number;
  endTime?: number;
  estimatedDuration?: number;
  steps: Map<string, PipelineStep>;
  metadata: {
    documentType: string;
    processingOptions: ProcessingOptions;
    priority: 'low' | 'normal' | 'high';
  };
}

interface PipelineStepResult {
  success: boolean;
  data?: any;
  metrics: {
    itemsProcessed: number;
    confidence: number;
    processingTime: number;
    resourcesUsed: {
      tokens: number;
      apiCalls: number;
      memoryMB: number;
    };
  };
  artifacts?: string[]; // IDs of stored artifacts
}
```

#### 1.2 Pipeline State Management
```typescript
// pipeline/stateManager.ts
export class PipelineStateManager {
  constructor(private ctx: any) {}

  async initializePipeline(
    documentId: string,
    options: ProcessingOptions
  ): Promise<string> {
    const pipelineId = generatePipelineId();
    const steps = this.createPipelineSteps();

    const initialState: PipelineState = {
      id: pipelineId,
      documentId,
      status: 'initialized',
      totalSteps: steps.length,
      completedSteps: 0,
      failedSteps: 0,
      startTime: Date.now(),
      steps: new Map(steps.map(step => [step.id, step])),
      metadata: {
        documentType: await this.detectDocumentType(documentId),
        processingOptions: options,
        priority: options.priority || 'normal'
      }
    };

    await this.savePipelineState(initialState);
    return pipelineId;
  }

  private createPipelineSteps(): PipelineStep[] {
    return [
      {
        id: 'document_analysis',
        name: 'Document Analysis',
        description: 'Analyze document structure and content',
        status: 'pending',
        retryCount: 0,
        dependencies: [],
        parallelGroup: 'initialization'
      },
      {
        id: 'hybrid_chunking',
        name: 'Hybrid Chunking',
        description: 'Create intelligent chunks using hybrid strategies',
        status: 'pending',
        retryCount: 0,
        dependencies: ['document_analysis'],
        parallelGroup: undefined
      },
      {
        id: 'vector_embedding',
        name: 'Vector Embedding Generation',
        description: 'Generate embeddings for semantic search',
        status: 'pending',
        retryCount: 3, // More retries for external API
        dependencies: ['hybrid_chunking'],
        parallelGroup: 'parallel_processing'
      },
      {
        id: 'fund_metrics_extraction',
        name: 'Fund Metrics Extraction',
        description: 'Extract financial performance metrics',
        status: 'pending',
        retryCount: 2,
        dependencies: ['hybrid_chunking'],
        parallelGroup: 'parallel_processing'
      },
      {
        id: 'company_intelligence_extraction',
        name: 'Company Intelligence Extraction',
        description: 'Extract portfolio company information',
        status: 'pending',
        retryCount: 2,
        dependencies: ['hybrid_chunking'],
        parallelGroup: 'parallel_processing'
      },
      {
        id: 'co_investor_analysis',
        name: 'Co-Investor Analysis',
        description: 'Analyze co-investor relationships',
        status: 'pending',
        retryCount: 2,
        dependencies: ['hybrid_chunking'],
        parallelGroup: 'parallel_processing'
      },
      {
        id: 'market_intelligence_synthesis',
        name: 'Market Intelligence Synthesis',
        description: 'Synthesize market insights and trends',
        status: 'pending',
        retryCount: 1,
        dependencies: ['hybrid_chunking'],
        parallelGroup: 'parallel_processing'
      },
      {
        id: 'result_aggregation',
        name: 'Result Aggregation',
        description: 'Aggregate and finalize all extraction results',
        status: 'pending',
        retryCount: 1,
        dependencies: ['vector_embedding', 'fund_metrics_extraction',
                      'company_intelligence_extraction', 'co_investor_analysis',
                      'market_intelligence_synthesis'],
        parallelGroup: 'finalization'
      }
    ];
  }

  async updateStepStatus(
    pipelineId: string,
    stepId: string,
    status: PipelineStep['status'],
    result?: PipelineStepResult,
    error?: string
  ): Promise<void> {
    const state = await this.getPipelineState(pipelineId);
    const step = state.steps.get(stepId);

    if (!step) {
      throw new Error(`Step ${stepId} not found in pipeline ${pipelineId}`);
    }

    // Update step
    step.status = status;
    if (result) step.result = result;
    if (error) step.error = error;

    if (status === 'running' && !step.startTime) {
      step.startTime = Date.now();
    }

    if (status === 'completed' || status === 'failed') {
      step.endTime = Date.now();
      step.duration = step.endTime - step.startTime!;
    }

    // Update pipeline statistics
    if (status === 'completed') {
      state.completedSteps++;
    } else if (status === 'failed') {
      state.failedSteps++;
    }

    // Update overall pipeline status
    await this.updatePipelineStatus(state);
    await this.savePipelineState(state);

    // Emit progress update
    await this.emitProgressUpdate(state, stepId);
  }

  private async updatePipelineStatus(state: PipelineState): Promise<void> {
    const steps = Array.from(state.steps.values());
    const completedSteps = steps.filter(s => s.status === 'completed').length;
    const failedSteps = steps.filter(s => s.status === 'failed').length;
    const runningSteps = steps.filter(s => s.status === 'running').length;

    if (completedSteps === steps.length) {
      state.status = 'completed';
      state.endTime = Date.now();
    } else if (failedSteps > steps.length * 0.3) { // Too many failures
      state.status = 'failed';
      state.endTime = Date.now();
    } else if (runningSteps > 0) {
      state.status = 'running';
    }

    state.completedSteps = completedSteps;
    state.failedSteps = failedSteps;
  }

  private async emitProgressUpdate(state: PipelineState, stepId: string): Promise<void> {
    // Emit real-time progress update to frontend
    await this.ctx.runMutation(internal.pipeline.emitProgressUpdate, {
      pipelineId: state.id,
      documentId: state.documentId,
      stepId,
      status: state.status,
      progress: {
        totalSteps: state.totalSteps,
        completedSteps: state.completedSteps,
        failedSteps: state.failedSteps,
        currentStep: Array.from(state.steps.values()).find(s => s.status === 'running')?.id
      }
    });
  }
}
```

### Phase 2: Incremental Step Processors (3 hours)

#### 2.1 Step Processor Interface
```typescript
// pipeline/stepProcessor.ts
export abstract class StepProcessor {
  abstract stepId: string;
  abstract maxRetries: number;

  constructor(
    protected ctx: any,
    protected stateManager: PipelineStateManager
  ) {}

  abstract execute(
    pipelineId: string,
    input: any
  ): Promise<PipelineStepResult>;

  async executeWithRetry(
    pipelineId: string,
    input: any,
    maxRetries: number = this.maxRetries
  ): Promise<PipelineStepResult> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Update status to running
        await this.stateManager.updateStepStatus(
          pipelineId,
          this.stepId,
          'running'
        );

        // Execute the step
        const result = await this.execute(pipelineId, input);

        // Update status to completed
        await this.stateManager.updateStepStatus(
          pipelineId,
          this.stepId,
          'completed',
          result
        );

        return result;

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');

        // Increment retry count
        const state = await this.stateManager.getPipelineState(pipelineId);
        const step = state.steps.get(this.stepId)!;
        step.retryCount = attempt;

        // Log error
        console.error(`Step ${this.stepId} attempt ${attempt} failed:`, error);

        if (attempt === maxRetries) {
          // Final attempt failed
          await this.stateManager.updateStepStatus(
            pipelineId,
            this.stepId,
            'failed',
            undefined,
            lastError.message
          );
          throw lastError;
        } else {
          // Wait before retry (exponential backoff)
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError!;
  }
}
```

#### 2.2 Individual Step Processors
```typescript
// pipeline/steps/documentAnalysisStep.ts
export class DocumentAnalysisStep extends StepProcessor {
  stepId = 'document_analysis';
  maxRetries = 1;

  async execute(pipelineId: string, input: { documentId: string }): Promise<PipelineStepResult> {
    const startTime = Date.now();

    // Get document content
    const document = await this.ctx.runQuery(internal.documents.getDocument, {
      id: input.documentId
    });

    const content = await this.ctx.runQuery(internal.documents.getDocumentContent, {
      documentId: input.documentId
    });

    // Analyze document structure and characteristics
    const analysis = await this.analyzeDocument(document, content.content);

    // Store analysis results
    await this.ctx.runMutation(internal.pipeline.storeDocumentAnalysis, {
      pipelineId,
      documentId: input.documentId,
      analysis
    });

    const processingTime = Date.now() - startTime;

    return {
      success: true,
      data: analysis,
      metrics: {
        itemsProcessed: 1,
        confidence: 0.95,
        processingTime,
        resourcesUsed: {
          tokens: 0,
          apiCalls: 0,
          memoryMB: 50
        }
      },
      artifacts: [`analysis_${pipelineId}`]
    };
  }

  private async analyzeDocument(document: any, content: string): Promise<DocumentAnalysis> {
    return {
      documentType: this.detectDocumentType(content),
      pageCount: this.estimatePageCount(content),
      hasFinancialTables: this.hasFinancialTables(content),
      hasCompanyData: this.hasCompanyData(content),
      complexity: this.assessComplexity(content),
      estimatedProcessingTime: this.estimateProcessingTime(content),
      recommendedAgents: this.recommendAgents(content)
    };
  }

  private detectDocumentType(content: string): string {
    if (content.includes('Limited Partner') || content.includes('Capital Account')) {
      return 'capital_account_statement';
    } else if (content.includes('Portfolio') && content.includes('Valuation')) {
      return 'portfolio_valuation';
    } else if (content.includes('IRR') || content.includes('DPI') || content.includes('TVPI')) {
      return 'fund_performance_report';
    } else if (content.includes('Market') && content.includes('Analysis')) {
      return 'market_analysis';
    } else {
      return 'general_document';
    }
  }

  // Additional analysis methods...
}

// pipeline/steps/hybridChunkingStep.ts
export class HybridChunkingStep extends StepProcessor {
  stepId = 'hybrid_chunking';
  maxRetries = 2;

  async execute(pipelineId: string, input: { documentId: string }): Promise<PipelineStepResult> {
    const startTime = Date.now();

    // Get document content
    const document = await this.ctx.runQuery(internal.documents.getDocument, {
      id: input.documentId
    });

    // Use hybrid chunking from Task 018
    const hybridChunker = new HybridChunker();
    const chunks = await hybridChunker.createHybridChunks(
      document.content,
      input.documentId
    );

    // Store chunks incrementally
    let storedChunks = 0;
    const chunkIds: string[] = [];

    for (const chunk of chunks) {
      try {
        // Generate embedding
        const embedding = await generateEmbedding(chunk.content);

        // Store chunk
        const chunkId = await this.ctx.runMutation(internal.chunks.storeChunk, {
          pipelineId,
          documentId: input.documentId,
          content: chunk.content,
          type: chunk.type,
          hierarchy: chunk.hierarchy,
          metadata: chunk.metadata,
          embedding
        });

        chunkIds.push(chunkId);
        storedChunks++;

        // Update progress for large chunk sets
        if (storedChunks % 10 === 0) {
          await this.emitChunkingProgress(pipelineId, storedChunks, chunks.length);
        }

      } catch (error) {
        console.error(`Failed to store chunk:`, error);
        // Continue processing other chunks
      }
    }

    const processingTime = Date.now() - startTime;

    return {
      success: true,
      data: {
        chunkCount: storedChunks,
        chunkIds,
        averageChunkSize: chunks.reduce((sum, c) => sum + c.content.length, 0) / chunks.length
      },
      metrics: {
        itemsProcessed: storedChunks,
        confidence: 0.9,
        processingTime,
        resourcesUsed: {
          tokens: chunks.reduce((sum, c) => sum + c.content.length, 0) / 4, // Rough token estimate
          apiCalls: storedChunks,
          memoryMB: 100
        }
      },
      artifacts: chunkIds
    };
  }

  private async emitChunkingProgress(pipelineId: string, processed: number, total: number): Promise<void> {
    await this.ctx.runMutation(internal.pipeline.emitStepProgress, {
      pipelineId,
      stepId: this.stepId,
      progress: processed / total,
      message: `Processed ${processed}/${total} chunks`
    });
  }
}

// pipeline/steps/fundMetricsExtractionStep.ts
export class FundMetricsExtractionStep extends StepProcessor {
  stepId = 'fund_metrics_extraction';
  maxRetries = 2;

  async execute(pipelineId: string, input: { documentId: string }): Promise<PipelineStepResult> {
    const startTime = Date.now();

    // Get chunks for this document
    const chunks = await this.ctx.runQuery(internal.chunks.getDocumentChunks, {
      documentId: input.documentId,
      types: ['fund_metrics', 'financial_table']
    });

    if (chunks.length === 0) {
      return {
        success: true,
        data: { metrics: [], message: 'No fund metrics chunks found' },
        metrics: {
          itemsProcessed: 0,
          confidence: 1.0,
          processingTime: Date.now() - startTime,
          resourcesUsed: { tokens: 0, apiCalls: 0, memoryMB: 10 }
        }
      };
    }

    // Use FundMetricsAgent from Task 017
    const agent = new FundMetricsAgent(this.getAgentConfig());
    let extractedMetrics: FundMetrics[] = [];
    let processedChunks = 0;

    for (const chunk of chunks) {
      try {
        if (agent.canProcess(chunk)) {
          const result = await agent.extract(chunk);
          if (result.success && result.data) {
            extractedMetrics.push(result.data);

            // Store result immediately
            await this.ctx.runMutation(internal.metrics.storeFundMetrics, {
              pipelineId,
              documentId: input.documentId,
              chunkId: chunk.id,
              metrics: result.data,
              confidence: result.confidence,
              agent: agent.name
            });
          }
        }
        processedChunks++;
      } catch (error) {
        console.error(`Failed to process chunk ${chunk.id}:`, error);
        // Continue with other chunks
      }
    }

    const processingTime = Date.now() - startTime;

    return {
      success: true,
      data: {
        metricsCount: extractedMetrics.length,
        chunksProcessed: processedChunks,
        totalChunks: chunks.length
      },
      metrics: {
        itemsProcessed: extractedMetrics.length,
        confidence: extractedMetrics.length > 0 ? 0.85 : 0.5,
        processingTime,
        resourcesUsed: {
          tokens: chunks.reduce((sum, c) => sum + c.tokenCount, 0),
          apiCalls: processedChunks,
          memoryMB: 75
        }
      },
      artifacts: extractedMetrics.map((_, index) => `fund_metrics_${pipelineId}_${index}`)
    };
  }

  private getAgentConfig(): FundMetricsConfig {
    return {
      model: 'gpt-4o-mini',
      confidenceThreshold: 0.7,
      maxRetries: 2
    };
  }
}
```

### Phase 3: Pipeline Orchestration (2 hours)

#### 3.1 Pipeline Orchestrator
```typescript
// pipeline/orchestrator.ts
export class IncrementalPipelineOrchestrator {
  private stepProcessors: Map<string, StepProcessor>;

  constructor(private ctx: any) {
    this.stepProcessors = new Map([
      ['document_analysis', new DocumentAnalysisStep(ctx, null!)],
      ['hybrid_chunking', new HybridChunkingStep(ctx, null!)],
      ['vector_embedding', new VectorEmbeddingStep(ctx, null!)],
      ['fund_metrics_extraction', new FundMetricsExtractionStep(ctx, null!)],
      ['company_intelligence_extraction', new CompanyIntelligenceStep(ctx, null!)],
      ['co_investor_analysis', new CoInvestorAnalysisStep(ctx, null!)],
      ['market_intelligence_synthesis', new MarketIntelligenceStep(ctx, null!)],
      ['result_aggregation', new ResultAggregationStep(ctx, null!)]
    ]);
  }

  async executePipeline(
    documentId: string,
    options: ProcessingOptions = {}
  ): Promise<string> {
    const stateManager = new PipelineStateManager(this.ctx);

    // Initialize pipeline
    const pipelineId = await stateManager.initializePipeline(documentId, options);

    // Update processors with state manager
    for (const [stepId, processor] of this.stepProcessors) {
      processor['stateManager'] = stateManager;
    }

    // Start pipeline execution
    this.executePipelineAsync(pipelineId, stateManager);

    return pipelineId;
  }

  private async executePipelineAsync(
    pipelineId: string,
    stateManager: PipelineStateManager
  ): Promise<void> {
    try {
      const state = await stateManager.getPipelineState(pipelineId);
      state.status = 'running';
      await stateManager.savePipelineState(state);

      // Execute steps in dependency order
      await this.executeStepsInDependencyOrder(pipelineId, stateManager);

      // Mark pipeline as completed
      const finalState = await stateManager.getPipelineState(pipelineId);
      finalState.status = 'completed';
      finalState.endTime = Date.now();
      await stateManager.savePipelineState(finalState);

      // Emit completion event
      await this.emitPipelineCompletion(pipelineId, finalState);

    } catch (error) {
      console.error(`Pipeline ${pipelineId} failed:`, error);

      const state = await stateManager.getPipelineState(pipelineId);
      state.status = 'failed';
      state.endTime = Date.now();
      await stateManager.savePipelineState(state);

      await this.emitPipelineFailure(pipelineId, state, error);
    }
  }

  private async executeStepsInDependencyOrder(
    pipelineId: string,
    stateManager: PipelineStateManager
  ): Promise<void> {
    const state = await stateManager.getPipelineState(pipelineId);
    const steps = Array.from(state.steps.values());

    // Create dependency graph
    const executedSteps = new Set<string>();
    let remainingSteps = [...steps];

    while (remainingSteps.length > 0) {
      // Find steps that can be executed (all dependencies completed)
      const executableSteps = remainingSteps.filter(step =>
        step.status === 'pending' &&
        step.dependencies.every(dep => executedSteps.has(dep))
      );

      if (executableSteps.length === 0) {
        // Check if we have failed steps that block progress
        const failedBlockingSteps = remainingSteps.filter(step =>
          step.status === 'failed' &&
          remainingSteps.some(other => other.dependencies.includes(step.id))
        );

        if (failedBlockingSteps.length > 0) {
          throw new Error(`Pipeline blocked by failed steps: ${failedBlockingSteps.map(s => s.id).join(', ')}`);
        } else {
          throw new Error('Circular dependency detected in pipeline steps');
        }
      }

      // Group by parallel group and execute
      const parallelGroups = this.groupByParallelGroup(executableSteps);

      for (const group of parallelGroups) {
        // Execute steps in parallel
        const promises = group.map(async (step) => {
          const processor = this.stepProcessors.get(step.id);
          if (!processor) {
            throw new Error(`No processor found for step ${step.id}`);
          }

          try {
            await processor.executeWithRetry(pipelineId, { documentId: state.documentId });
            executedSteps.add(step.id);
          } catch (error) {
            console.error(`Step ${step.id} failed permanently:`, error);
            // Don't add to executedSteps, but continue with other steps
          }
        });

        await Promise.allSettled(promises);

        // Remove executed steps from remaining
        remainingSteps = remainingSteps.filter(step => !executedSteps.has(step.id));
      }
    }
  }

  private groupByParallelGroup(steps: PipelineStep[]): PipelineStep[][] {
    const groups = new Map<string, PipelineStep[]>();

    for (const step of steps) {
      const groupKey = step.parallelGroup || step.id;
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(step);
    }

    return Array.from(groups.values());
  }

  async resumePipeline(pipelineId: string): Promise<void> {
    const stateManager = new PipelineStateManager(this.ctx);
    const state = await stateManager.getPipelineState(pipelineId);

    if (state.status !== 'failed' && state.status !== 'paused') {
      throw new Error(`Cannot resume pipeline in status: ${state.status}`);
    }

    // Reset failed steps to pending
    for (const [stepId, step] of state.steps) {
      if (step.status === 'failed') {
        step.status = 'pending';
        step.retryCount = 0;
        step.error = undefined;
      }
    }

    state.status = 'running';
    state.endTime = undefined;
    await stateManager.savePipelineState(state);

    // Continue execution from current state
    await this.executePipelineAsync(pipelineId, stateManager);
  }

  async retryStep(pipelineId: string, stepId: string): Promise<void> {
    const stateManager = new PipelineStateManager(this.ctx);
    const state = await stateManager.getPipelineState(pipelineId);
    const step = state.steps.get(stepId);

    if (!step) {
      throw new Error(`Step ${stepId} not found`);
    }

    if (step.status !== 'failed') {
      throw new Error(`Cannot retry step ${stepId} in status: ${step.status}`);
    }

    // Reset step
    step.status = 'pending';
    step.retryCount = 0;
    step.error = undefined;
    await stateManager.savePipelineState(state);

    // Execute the step
    const processor = this.stepProcessors.get(stepId);
    if (!processor) {
      throw new Error(`No processor found for step ${stepId}`);
    }

    await processor.executeWithRetry(pipelineId, { documentId: state.documentId });
  }
}
```

### Phase 4: Real-time Progress and Control (1.5 hours)

#### 4.1 Progress Tracking and Updates
```typescript
// pipeline/progressTracking.ts
export const emitProgressUpdate = internalMutation({
  args: {
    pipelineId: v.string(),
    documentId: v.id("documents"),
    stepId: v.string(),
    status: v.union(v.literal("running"), v.literal("completed"), v.literal("failed")),
    progress: v.object({
      totalSteps: v.number(),
      completedSteps: v.number(),
      failedSteps: v.number(),
      currentStep: v.optional(v.string())
    })
  },
  handler: async (ctx, args) => {
    // Store progress update in database
    await ctx.db.insert("pipelineProgress", {
      pipelineId: args.pipelineId,
      documentId: args.documentId,
      stepId: args.stepId,
      status: args.status,
      progress: args.progress,
      timestamp: Date.now()
    });

    // Emit to connected clients via Convex subscriptions
    // This will automatically update frontend components
  }
});

export const getPipelineProgress = query({
  args: { pipelineId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pipelineProgress")
      .withIndex("by_pipeline", q => q.eq("pipelineId", args.pipelineId))
      .order("desc")
      .first();
  }
});
```

#### 4.2 Pipeline Control Actions
```typescript
// pipeline/controlActions.ts
export const pausePipeline = internalAction({
  args: { pipelineId: v.string() },
  handler: async (ctx, args) => {
    const stateManager = new PipelineStateManager(ctx);
    const state = await stateManager.getPipelineState(args.pipelineId);

    if (state.status !== 'running') {
      throw new Error(`Cannot pause pipeline in status: ${state.status}`);
    }

    state.status = 'paused';
    await stateManager.savePipelineState(state);

    return { success: true, message: 'Pipeline paused' };
  }
});

export const cancelPipeline = internalAction({
  args: { pipelineId: v.string() },
  handler: async (ctx, args) => {
    const stateManager = new PipelineStateManager(ctx);
    const state = await stateManager.getPipelineState(args.pipelineId);

    if (state.status === 'completed') {
      throw new Error('Cannot cancel completed pipeline');
    }

    state.status = 'cancelled';
    state.endTime = Date.now();
    await stateManager.savePipelineState(state);

    // Clean up partial results if requested
    await cleanupPartialResults(args.pipelineId);

    return { success: true, message: 'Pipeline cancelled' };
  }
});

export const retryPipeline = internalAction({
  args: {
    pipelineId: v.string(),
    fromStep: v.optional(v.string()) // Retry from specific step
  },
  handler: async (ctx, args) => {
    const orchestrator = new IncrementalPipelineOrchestrator(ctx);

    if (args.fromStep) {
      await orchestrator.retryStep(args.pipelineId, args.fromStep);
    } else {
      await orchestrator.resumePipeline(args.pipelineId);
    }

    return { success: true, message: 'Pipeline retry initiated' };
  }
});
```

#### 4.3 Frontend Integration
```typescript
// src/components/PipelineProgress.tsx
export function PipelineProgress({ pipelineId }: { pipelineId: string }) {
  const progress = useQuery(api.pipeline.getPipelineProgress, { pipelineId });

  if (!progress) return <div>Starting processing...</div>;

  const { status, progress: progressData } = progress;
  const percentage = Math.round((progressData.completedSteps / progressData.totalSteps) * 100);

  return (
    <div className="pipeline-progress">
      <div className="progress-header">
        <h3>Document Processing</h3>
        <Badge variant={status === 'completed' ? 'default' : 'secondary'}>
          {status}
        </Badge>
      </div>

      <Progress value={percentage} className="w-full" />

      <div className="progress-details">
        <span>{progressData.completedSteps}/{progressData.totalSteps} steps</span>
        {progressData.failedSteps > 0 && (
          <span className="text-red-500">
            {progressData.failedSteps} failed
          </span>
        )}
      </div>

      {progressData.currentStep && (
        <div className="current-step">
          Currently: {progressData.currentStep}
        </div>
      )}

      {/* Control buttons */}
      <div className="pipeline-controls">
        {status === 'failed' && (
          <Button onClick={() => retryPipeline(pipelineId)}>
            Retry
          </Button>
        )}
        {status === 'running' && (
          <Button variant="outline" onClick={() => pausePipeline(pipelineId)}>
            Pause
          </Button>
        )}
      </div>
    </div>
  );
}
```

## 🧪 Testing Strategy

### Pipeline Testing
```typescript
// tests/incrementalPipeline.test.ts
describe('Incremental Pipeline', () => {
  test('processes document with step failures gracefully', async () => {
    const documentId = await createTestDocument();

    // Mock one step to fail
    jest.spyOn(FundMetricsStep.prototype, 'execute')
        .mockRejectedValueOnce(new Error('API failure'));

    const pipelineId = await orchestrator.executePipeline(documentId);

    // Wait for pipeline completion
    const state = await waitForPipelineCompletion(pipelineId);

    expect(state.status).toBe('completed'); // Should complete despite failure
    expect(state.failedSteps).toBe(1);
    expect(state.completedSteps).toBeGreaterThan(5); // Other steps should complete
  });

  test('can resume from failed state', async () => {
    const documentId = await createTestDocument();

    // First run with failure
    const pipelineId = await orchestrator.executePipeline(documentId);
    await waitForPipelineFailure(pipelineId);

    // Fix the issue and retry
    jest.clearAllMocks();
    await orchestrator.resumePipeline(pipelineId);

    const state = await waitForPipelineCompletion(pipelineId);
    expect(state.status).toBe('completed');
  });

  test('provides real-time progress updates', async () => {
    const documentId = await createTestDocument();
    const progressUpdates: any[] = [];

    // Subscribe to progress updates
    const unsubscribe = subscribeToProgress(pipelineId, (update) => {
      progressUpdates.push(update);
    });

    await orchestrator.executePipeline(documentId);

    expect(progressUpdates.length).toBeGreaterThan(5);
    expect(progressUpdates[0].status).toBe('running');
    expect(progressUpdates[progressUpdates.length - 1].status).toBe('completed');
  });
});
```

### Performance Testing
```typescript
// tests/pipelinePerformance.test.ts
describe('Pipeline Performance', () => {
  test('processes typical VC report within 60 seconds', async () => {
    const documentId = await createTestDocument('vc-capital-account.pdf');

    const startTime = Date.now();
    const pipelineId = await orchestrator.executePipeline(documentId);
    await waitForPipelineCompletion(pipelineId);
    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(60000); // 60 seconds
  });

  test('handles concurrent pipelines efficiently', async () => {
    const documentIds = await createMultipleTestDocuments(5);
    const startTime = Date.now();

    // Execute pipelines concurrently
    const pipelinePromises = documentIds.map(id =>
      orchestrator.executePipeline(id)
    );

    const pipelineIds = await Promise.all(pipelinePromises);

    // Wait for all to complete
    await Promise.all(
      pipelineIds.map(id => waitForPipelineCompletion(id))
    );

    const duration = Date.now() - startTime;

    // Should be faster than sequential processing
    expect(duration).toBeLessThan(120000); // 2 minutes for 5 documents
  });
});
```

## 🚨 Rollback Strategy

### Feature Flags
```typescript
const INCREMENTAL_PIPELINE_ENABLED = process.env.INCREMENTAL_PIPELINE_ENABLED === 'true';

export const processDocument = internalAction({
  args: { documentId: v.id("documents"), options: v.optional(ProcessingOptions) },
  handler: async (ctx, args) => {
    if (INCREMENTAL_PIPELINE_ENABLED) {
      const orchestrator = new IncrementalPipelineOrchestrator(ctx);
      return await orchestrator.executePipeline(args.documentId, args.options);
    } else {
      // Fallback to legacy processing
      return processDocumentLegacy(ctx, args);
    }
  }
});
```

### Rollback Procedures
1. **Feature Flag Control**: Disable incremental pipeline via environment variable
2. **Data Migration**: Ensure incremental results are compatible with legacy queries
3. **Performance Monitoring**: Compare performance metrics between systems
4. **Gradual Rollout**: Enable for specific users or document types first

## 📁 Files to Create/Modify

### New Files
- `convex/pipeline/orchestrator.ts` - Main pipeline orchestration logic
- `convex/pipeline/stateManager.ts` - Pipeline state management
- `convex/pipeline/stepProcessor.ts` - Base step processor interface
- `convex/pipeline/steps/documentAnalysisStep.ts` - Document analysis processor
- `convex/pipeline/steps/hybridChunkingStep.ts` - Hybrid chunking processor
- `convex/pipeline/steps/fundMetricsExtractionStep.ts` - Fund metrics processor
- `convex/pipeline/steps/companyIntelligenceStep.ts` - Company intelligence processor
- `convex/pipeline/steps/coInvestorAnalysisStep.ts` - Co-investor analysis processor
- `convex/pipeline/steps/marketIntelligenceStep.ts` - Market intelligence processor
- `convex/pipeline/steps/resultAggregationStep.ts` - Result aggregation processor
- `convex/pipeline/controlActions.ts` - Pipeline control actions (pause, resume, retry)
- `convex/pipeline/progressTracking.ts` - Progress tracking and updates
- `convex/schema.ts` - Add pipeline state and progress tables

### Modified Files
- `convex/enhancedProcessing.ts` - Integrate with incremental pipeline
- `convex/queries.ts` - Add pipeline progress queries
- Frontend components to display pipeline progress and controls

## 📊 Success Metrics

### Reliability Metrics
- **Pipeline Success Rate**: 80%+ of pipelines complete with some successful steps
- **Failure Recovery**: 90%+ of failed pipelines can be successfully resumed
- **Step Success Rate**: 95%+ of individual steps complete successfully
- **Data Loss**: 0% data loss during failures and retries

### Performance Metrics
- **Processing Time**: 30% improvement in overall processing time
- **Resource Efficiency**: 50% reduction in redundant processing
- **Recovery Time**: Resume processing within 5 seconds of failure
- **Concurrent Processing**: Support 10+ concurrent pipelines

### User Experience Metrics
- **Progress Visibility**: Real-time progress updates for all processing steps
- **Partial Results**: Users can access results as soon as available
- **Error Transparency**: Clear error messages and recovery options
- **Control Options**: Users can pause, resume, and retry processing

## 🔄 Dependencies and Integration

### Required Environment
- Database schema from Task 016
- Modular agents from Task 017
- Hybrid chunking from Task 018
- GPT-4o-mini API access
- Convex real-time subscriptions

### Integration Points
- Document upload and processing pipeline
- Modular extraction agents
- Hybrid chunking system
- Frontend progress visualization
- Error monitoring and alerting

## ⚠️ Risk Assessment

### High Risks
- **Increased Complexity**: More complex system may be harder to debug
  - *Mitigation*: Comprehensive logging, monitoring, and debugging tools
- **Resource Contention**: Concurrent pipelines may compete for resources
  - *Mitigation*: Resource limits, queue management, monitoring

### Medium Risks
- **State Management Complexity**: Managing pipeline state across failures
  - *Mitigation*: Robust state management, comprehensive testing
- **Performance Overhead**: Incremental processing may have overhead
  - *Mitigation*: Performance optimization, monitoring, benchmarks

## 📝 Implementation Notes

### Key Architectural Decisions
1. **Dependency-Based Execution**: Steps execute in dependency order with parallel groups
2. **Immediate Result Storage**: Store results as soon as they become available
3. **Comprehensive State Management**: Track all pipeline state for recovery
4. **Real-time Updates**: Live progress tracking via Convex subscriptions
5. **Granular Control**: Users can control individual steps and retry failures

### 12 Factor Principles Applied
- **Factor 3 (Config)**: Pipeline behavior configurable
- **Factor 8 (Concurrency)**: Scale out via multiple pipeline instances
- **Factor 9 (Disposability)**: Fast startup and graceful shutdown
- **Factor 11 (Logs)**: Comprehensive logging for debugging

## 🎉 Completion Criteria

### Pipeline Implementation
- [ ] All step processors implemented and tested
- [ ] Pipeline orchestration working with dependency resolution
- [ ] State management robust across failures and restarts
- [ ] Real-time progress updates working
- [ ] Pipeline control actions (pause, resume, retry) functional

### Reliability and Performance
- [ ] 80%+ pipeline success rate with partial results
- [ ] Resume capability working for failed pipelines
- [ ] Processing time improvement of 30%+
- [ ] Resource efficiency improvement of 50%+
- [ ] Comprehensive error handling and recovery

### User Experience
- [ ] Real-time progress visualization in frontend
- [ ] Partial results accessible during processing
- [ ] Clear error messages and recovery options
- [ ] Pipeline control interface working
- [ ] Mobile-responsive progress display

## 📚 Related Documentation

- [Extraction Pipeline Optimization Plan](/ai_docs/dev_docs/extraction-pipeline-optimization-plan.md)
- [12 Factor Agent Guidelines](https://github.com/humanlayer/12-factor-agents)
- [Task 016: Database Cleanup](016_database-cleanup-schema-optimization.md)
- [Task 017: Modular Extraction Architecture](017_modular-extraction-architecture.md)
- [Task 018: Hybrid Chunking Implementation](018_hybrid-chunking-implementation.md)

## 🚀 Next Steps

After completing this incremental pipeline task:
1. **Task 020**: Smart Context Management
2. **Task 021**: Performance Monitoring and Analytics
3. **Task 022**: Complete End-to-End Integration Testing
4. **Task 023**: Documentation and Training Materials

This incremental pipeline implementation provides the resilient, fault-tolerant foundation needed for reliable document processing at scale while giving users visibility and control over the extraction process.