# Null Safety Patterns: Preventing Runtime Errors in Data-Heavy Applications

_Implementing robust null safety patterns to prevent runtime errors when dealing with dynamic or potentially undefined data._

## Issue

Multiple runtime errors occurred due to attempting to call methods on undefined values:
- `Cannot read properties of undefined (reading 'toFixed')` errors in OverviewPage
- Empty table cells in PortfolioPage due to undefined data
- Broken calculations when fund metrics were undefined

## Root Cause

- **Missing null checks**: Code assumed data would always be present and properly formatted
- **Inconsistent data structure**: Some funds/companies had undefined `moic`, `irr`, or other metrics
- **No data validation**: Frontend didn't validate data before attempting operations
- **Poor error boundaries**: No graceful handling of missing or malformed data

## Solution / Fix

### 1. Implemented Comprehensive Null Safety Checks
```typescript
// Filter out funds with undefined metrics before calculations
const validFunds = (funds || []).filter(
  (f) => f.vintage && f.moic !== undefined && f.irr !== undefined
);

// Safe property access with fallbacks
const moicValue = fund.moic !== undefined ? fund.moic.toFixed(2) : 'N/A';
```

### 2. Added Data Validation and Filtering
```typescript
// Filter companies with valid data before rendering
const validCompanies = companies?.filter(company => 
  company.companyName && 
  company.totalInvestment !== undefined &&
  company.currentValue !== undefined
) || [];
```

### 3. Implemented Graceful Fallbacks
```typescript
// Provide meaningful defaults for missing data
const formatValue = (val: string | number): string => {
  if (typeof val === "string") return val;
  if (val === undefined || val === null) return 'N/A';
  // ... formatting logic
};
```

### 4. Enhanced Error Boundaries
```typescript
// Safe rendering with conditional checks
{company.ownership !== undefined 
  ? `${company.ownership.toFixed(2)}%`
  : 'N/A'
}
```

## Lessons Learned

### 1. Always Assume Data Might Be Missing or Malformed
**Universal Application**: In any system processing external data, user input, or API responses, implement defensive programming practices. This applies to web applications, mobile apps, data processing pipelines, and any system handling dynamic data.

### 2. Filter Invalid Data Before Processing
**Universal Application**: Validate and filter data at the entry point rather than handling errors throughout the application. This applies to data imports, API integrations, user input validation, and any data processing workflow.

### 3. Provide Meaningful Fallbacks for Missing Data
**Universal Application**: When data is missing, show "N/A", "Unknown", or other meaningful indicators rather than empty spaces or errors. This improves user experience and makes data quality issues visible. This applies to dashboards, reports, forms, and any data display interface.

### 4. Use Type Guards and Runtime Checks
**Universal Application**: Implement runtime type checking and validation, especially in dynamically typed languages or when dealing with external data sources. This applies to JavaScript/TypeScript applications, API integrations, and any system with uncertain data types.

### 5. Design for Data Inconsistency
**Universal Application**: Real-world data is often inconsistent, incomplete, or malformed. Design your systems to handle these realities gracefully rather than assuming perfect data. This applies to data migration projects, legacy system integrations, and any real-world application.

### 6. Error Prevention is Better Than Error Handling
**Universal Application**: Preventing errors through validation and null checks is more effective than trying to catch and handle them after they occur. This applies to form validation, API design, database operations, and any user-facing functionality.

### 7. Consistent Error Handling Patterns
**Universal Application**: Establish consistent patterns for handling missing data across your application. This makes the codebase more maintainable and provides a predictable user experience. This applies to any large application or system with multiple data sources.
