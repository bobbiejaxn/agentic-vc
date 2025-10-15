### Title

Convex: Understanding Function Type Separation (Actions vs Queries vs Mutations)

### Issue

During implementation of the document processing pipeline, encountered errors when trying to define queries and mutations in files with `"use node";` directive. The error "Only actions can be defined in Node.js" caused confusion about proper Convex function architecture.

### Root Cause

Convex has strict separation between different function types:
- **Actions**: Can use `"use node";` and access external APIs, but have limited database access
- **Queries**: Read-only database access, cannot use `"use node";`
- **Mutations**: Can write to database, cannot use `"use node";`

The `"use node";` directive at file level applies to ALL functions in that file, making it incompatible with queries/mutations.

### Solution / Fix

1. Removed `"use node";` from file-level and added it only to individual action handlers
2. Separated action functions that need external API access from query/mutation functions
3. Used proper internal function calls (ctx.runQuery, ctx.runMutation) from actions to access data

```typescript
// Correct pattern - "use node" only in action handler
export const processWithExternalAPI = internalAction({
  handler: async (ctx, args) => {
    "use node"; // Only here, not at file level

    // Action logic with external API calls
    const result = await externalAPI.call();

    // Use internal functions for data access
    const data = await ctx.runMutation(internal.myModule.updateData, result);
  }
});

export const getData = internalQuery({
  handler: async (ctx, args) => {
    // Query logic - no "use node" needed
    return await ctx.db.get(args.id);
  }
});
```

### Lessons Learned

- **Function Type Separation is Critical**: Actions, queries, and mutations have distinct capabilities and limitations
- **"use node" Scope Matters**: Apply `"use node";` only to functions that need external API access, not at file level
- **Proper Data Access Patterns**: Actions must use ctx.runQuery/runMutation to access data, never direct ctx.db access
- **Architecture Planning**: Plan function types before implementation to avoid refactoring later
- **Universal Application**: This pattern applies to any serverless function platform (Firebase Functions, AWS Lambda) with different execution contexts