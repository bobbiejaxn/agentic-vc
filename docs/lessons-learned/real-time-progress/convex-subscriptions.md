### Title

Real-time Progress Tracking: Creating Responsive User Experiences with Convex Subscriptions

### Issue

During implementation of the OCR and enhanced processing pipeline, users needed visibility into long-running operations. Without real-time feedback, users couldn't distinguish between failed processing, slow operations, or successful completion. This led to poor user experience and support overhead.

### Root Cause

The document processing pipeline involves multiple time-consuming steps:
1. File upload and storage
2. OCR processing (external API call)
3. Enhanced chunking (vector embeddings)
4. Intelligence extraction (multiple API calls)
5. Database storage

Without real-time status updates, users were left guessing about operation status. Traditional polling was inefficient and didn't provide granular progress information.

### Solution / Fix

1. **Dedicated Progress Tracking Table**: Created `processingJobs` table for granular progress tracking
2. **Real-time Subscriptions**: Used Convex subscriptions for live UI updates
3. **Progressive Status Updates**: Implemented granular progress steps throughout the pipeline
4. **Error State Handling**: Added comprehensive error reporting and retry mechanisms
5. **Progressive Enhancement**: Built UI components that gracefully handle loading states

```typescript
// Progress tracking in processing pipeline
export const updateOCRProgress = internalMutation({
  args: {
    documentId: v.id("documents"),
    status: v.union(v.literal("uploaded"), v.literal("processing"), v.literal("processed"), v.literal("completed"), v.literal("failed")),
    progress: v.number(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // Update document status
    await ctx.db.patch(args.documentId, {
      status: args.status,
      processedAt: args.status === "processed" || args.status === "completed" ? Date.now() : undefined,
    });

    // Update or create processing job record
    const existingJob = await ctx.db
      .query("processingJobs")
      .withIndex("by_document", q => q.eq("documentId", args.documentId))
      .filter((q) => q.eq(q.field("type"), "ocr"))
      .first();

    if (existingJob) {
      await ctx.db.patch(existingJob._id, {
        status: args.status === "failed" ? "failed" :
                args.status === "processed" ? "completed" : "running",
        errorMessage: args.status === "failed" ? args.message : undefined,
        completedAt: args.status === "processed" ? Date.now() : undefined,
      });
    } else {
      await ctx.db.insert("processingJobs", {
        documentId: args.documentId,
        type: "ocr",
        status: "running",
        startedAt: Date.now(),
        retryCount: 0,
      });
    }
  },
});

// Real-time UI component
export function OCRProgressIndicator({ documentId }: { documentId: Id<"documents"> }) {
  const processingJob = useQuery(
    api.processing.getProcessingJob,
    { documentId, type: "ocr" }
  );

  const progress = processingJob?.progress || 0;
  const status = processingJob?.status || "pending";

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">
          {status === "running" ? "Processing..." :
           status === "completed" ? "Completed" :
           status === "failed" ? "Failed" : "Pending"}
        </span>
        <span className="text-sm text-gray-500">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      {processingJob?.message && (
        <p className="text-xs text-gray-600 mt-1">{processingJob.message}</p>
      )}
    </div>
  );
}
```

### Lessons Learned

- **Real-time Subscriptions are Essential**: Convex subscriptions provide instant UI updates without polling overhead
- **Granular Progress Tracking**: Users need more than just "running/completed" - they want percentage progress and status messages
- **Centralized Progress State**: Use dedicated tables for progress tracking rather than scattering status across multiple records
- **Error State Visibility**: Failed operations must be clearly visible with actionable error messages
- **Progressive Enhancement**: UI components should handle all possible states (pending, running, completed, failed)
- **Universal Application**: This pattern applies to any long-running operation:
  - File uploads and processing
  - Data import/export operations
  - External API integrations
  - Machine learning model training/inference
  - Report generation
  - Batch data operations

- **Performance Considerations**: Update progress judiciously - too frequent updates can impact performance, too sparse updates hurt user experience
- **Retry Logic Integration**: Progress tracking must work seamlessly with retry mechanisms for failed operations
- **User Experience Priority**: Real-time feedback transforms user perception of system reliability and performance