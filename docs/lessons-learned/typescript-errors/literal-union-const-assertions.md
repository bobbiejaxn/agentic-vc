### Title

TypeScript: Using Const Assertions for Literal Union Types

### Issue

When implementing the categorizeChunk function for document processing, TypeScript threw errors: "Type 'string' is not assignable to type 'tier1_critical' | 'tier2_strategic' | 'tier3_analytics'". The function was returning string values instead of the expected literal types.

### Root Cause

TypeScript was widening the inferred types to `string` instead of preserving the literal union types. When working with discriminated unions or strict database schemas, regular string assignments don't match literal type requirements.

### Solution / Fix

1. Used `as const` assertions to preserve literal types in function returns
2. Applied const assertions to individual return values
3. Ensured type consistency throughout the function

```typescript
// Before - TypeScript error
function categorizeChunk(chunk: any): {
  tier: "tier1_critical" | "tier2_strategic" | "tier3_analytics",
  type: "fund_metrics" | "portfolio_company" | ...
} {
  const tier = metadata.priority === "critical" ? "tier1_critical" :
               metadata.priority === "important" ? "tier2_strategic" : "tier3_analytics";
  // Error: tier is inferred as string, not literal type
  return { tier, type };
}

// After - Using const assertions
function categorizeChunk(chunk: any): {
  tier: "tier1_critical" | "tier2_strategic" | "tier3_analytics",
  type: "fund_metrics" | "portfolio_company" | ...
} {
  const tier = metadata.priority === "critical" ? "tier1_critical" as const :
               metadata.priority === "important" ? "tier2_strategic" as const : "tier3_analytics" as const;

  const type = hasTables ? "financial_table" as const :
                hasFinancialData ? "fund_metrics" as const : "narrative_text" as const;

  return { tier, type }; // Now matches expected literal types
}
```

### Lessons Learned

- **Const Assertions Preserve Literal Types**: Use `as const` when working with literal union types to prevent type widening
- **Database Schema Strictness**: Convex and other typed databases require exact type matches, not string compatibility
- **Type Safety First**: Explicit type assertions are better than implicit type inference for critical data paths
- **Universal Application**: This pattern applies to any TypeScript project working with:
  - Database schemas (Prisma, Drizzle, Convex)
  - API response type definitions
  - Configuration objects with specific allowed values
  - Redux/State management action types
  - Component prop validation libraries