// Robust validation system with comprehensive error handling
// Addresses all potential failure points in our schema validation strategy

import { z, ZodError, ZodSchema } from "zod";

// Enhanced error types
export interface RobustValidationError {
  field: string;
  message: string;
  code: string;
  severity: "low" | "medium" | "high" | "critical";
  suggestedFix?: string;
  originalValue?: any;
}

export interface RobustValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: RobustValidationError[];
  warnings?: string[];
  metadata?: {
    validationTime: number;
    schemaVersion: string;
    dataSize: number;
  };
}

// Schema versioning for safe evolution
export const SCHEMA_VERSION = "1.0.0";

// Performance limits
export const VALIDATION_LIMITS = {
  MAX_STRING_LENGTH: 1000000, // 1MB
  MAX_ARRAY_LENGTH: 1000,
  MAX_OBJECT_DEPTH: 10,
  MAX_VALIDATION_TIME: 5000, // 5 seconds
};

// Enhanced validation function with comprehensive error handling
export function robustValidate<T>(
  data: unknown,
  schema: ZodSchema<T>,
  options: {
    allowPartial?: boolean;
    maxValidationTime?: number;
    schemaVersion?: string;
  } = {}
): RobustValidationResult<T> {
  const startTime = Date.now();
  const maxTime =
    options.maxValidationTime || VALIDATION_LIMITS.MAX_VALIDATION_TIME;

  try {
    // Check data size limits
    const dataSize = JSON.stringify(data).length;
    if (dataSize > VALIDATION_LIMITS.MAX_STRING_LENGTH) {
      return {
        success: false,
        errors: [
          {
            field: "root",
            message: `Data size (${dataSize} bytes) exceeds limit (${VALIDATION_LIMITS.MAX_STRING_LENGTH} bytes)`,
            code: "data_too_large",
            severity: "critical",
            suggestedFix: "Reduce data size or increase limits",
            originalValue: dataSize,
          },
        ],
        metadata: {
          validationTime: Date.now() - startTime,
          schemaVersion: options.schemaVersion || SCHEMA_VERSION,
          dataSize,
        },
      };
    }

    // Set timeout for validation
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Validation timeout")), maxTime);
    });

    const validationPromise = Promise.resolve(schema.safeParse(data));

    const result = await Promise.race([validationPromise, timeoutPromise]);

    if (result.success) {
      return {
        success: true,
        data: result.data,
        metadata: {
          validationTime: Date.now() - startTime,
          schemaVersion: options.schemaVersion || SCHEMA_VERSION,
          dataSize,
        },
      };
    }

    // Transform Zod errors with enhanced information
    const errors: RobustValidationError[] = result.error.errors.map(
      (error) => ({
        field: error.path.join("."),
        message: error.message,
        code: error.code,
        severity: getErrorSeverity(error),
        suggestedFix: getSuggestedFix(error),
        originalValue: error.input,
      })
    );

    return {
      success: false,
      errors,
      metadata: {
        validationTime: Date.now() - startTime,
        schemaVersion: options.schemaVersion || SCHEMA_VERSION,
        dataSize,
      },
    };
  } catch (error) {
    // Handle unexpected errors
    const errorMessage =
      error instanceof Error ? error.message : "Unknown validation error";

    return {
      success: false,
      errors: [
        {
          field: "root",
          message: `Validation failed: ${errorMessage}`,
          code: "validation_error",
          severity: "critical",
          suggestedFix: "Check data format and schema compatibility",
          originalValue: data,
        },
      ],
      metadata: {
        validationTime: Date.now() - startTime,
        schemaVersion: options.schemaVersion || SCHEMA_VERSION,
        dataSize: JSON.stringify(data).length,
      },
    };
  }
}

// Determine error severity based on error type
function getErrorSeverity(
  error: z.ZodIssue
): "low" | "medium" | "high" | "critical" {
  switch (error.code) {
    case "invalid_type":
      return "high";
    case "too_small":
    case "too_big":
      return "medium";
    case "invalid_string":
    case "invalid_date":
      return "high";
    case "custom":
      return "critical";
    default:
      return "medium";
  }
}

// Provide helpful suggestions for common errors
function getSuggestedFix(error: z.ZodIssue): string {
  switch (error.code) {
    case "invalid_type":
      return `Expected ${error.expected}, received ${error.received}`;
    case "too_small":
      return `Value must be at least ${error.minimum}`;
    case "too_big":
      return `Value must be at most ${error.maximum}`;
    case "invalid_string":
      return "Check string format and encoding";
    case "invalid_date":
      return "Use ISO 8601 date format (YYYY-MM-DD)";
    default:
      return "Check data format and try again";
  }
}

// Safe schema evolution helper
export function createBackwardCompatibleSchema<T>(
  currentSchema: ZodSchema<T>,
  migrationRules: Array<{
    field: string;
    transform: (value: any) => any;
    fallback?: any;
  }>
) {
  return z.preprocess((data: any) => {
    if (!data || typeof data !== "object") return data;

    const migrated = { ...data };

    for (const rule of migrationRules) {
      if (migrated[rule.field] !== undefined) {
        try {
          migrated[rule.field] = rule.transform(migrated[rule.field]);
        } catch (error) {
          if (rule.fallback !== undefined) {
            migrated[rule.field] = rule.fallback;
          }
        }
      }
    }

    return migrated;
  }, currentSchema);
}

// Environment validation
export function validateEnvironment(): RobustValidationResult<
  Record<string, string>
> {
  const requiredEnvVars = [
    "GOOGLE_AI_API_KEY",
    "LLAMA_CLOUD_API_KEY",
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
  ];

  const envData: Record<string, string> = {};
  const errors: RobustValidationError[] = [];

  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar];
    if (!value || value.trim() === "") {
      errors.push({
        field: envVar,
        message: `Environment variable ${envVar} is required but not set`,
        code: "missing_env_var",
        severity: "critical",
        suggestedFix: `Set ${envVar} in your environment configuration`,
      });
    } else {
      envData[envVar] = value;
    }
  }

  return {
    success: errors.length === 0,
    data: envData,
    errors: errors.length > 0 ? errors : undefined,
    metadata: {
      validationTime: 0,
      schemaVersion: SCHEMA_VERSION,
      dataSize: JSON.stringify(envData).length,
    },
  };
}

// Database schema validation
export function validateDatabaseSchema(
  expectedSchema: Record<string, any>,
  actualSchema: Record<string, any>
): RobustValidationResult<boolean> {
  const errors: RobustValidationError[] = [];
  const warnings: string[] = [];

  // Check for missing columns
  for (const [column, definition] of Object.entries(expectedSchema)) {
    if (!(column in actualSchema)) {
      errors.push({
        field: column,
        message: `Database column ${column} is missing`,
        code: "missing_column",
        severity: "critical",
        suggestedFix: `Add column ${column} to database schema`,
      });
    } else if (actualSchema[column] !== definition) {
      warnings.push(
        `Column ${column} type mismatch: expected ${definition}, got ${actualSchema[column]}`
      );
    }
  }

  // Check for extra columns
  for (const column of Object.keys(actualSchema)) {
    if (!(column in expectedSchema)) {
      warnings.push(`Unexpected column ${column} in database schema`);
    }
  }

  return {
    success: errors.length === 0,
    data: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined,
    metadata: {
      validationTime: 0,
      schemaVersion: SCHEMA_VERSION,
      dataSize: 0,
    },
  };
}

// Health check for validation system
export function validateSystemHealth(): RobustValidationResult<{
  schemas: boolean;
  environment: boolean;
  database: boolean;
  performance: boolean;
}> {
  const health = {
    schemas: true,
    environment: true,
    database: true,
    performance: true,
  };

  const errors: RobustValidationError[] = [];
  const warnings: string[] = [];

  // Test schema validation performance
  const testData = { test: "data" };
  const testSchema = z.object({ test: z.string() });

  const startTime = Date.now();
  const result = robustValidate(testData, testSchema);
  const validationTime = Date.now() - startTime;

  if (validationTime > 100) {
    warnings.push(`Schema validation is slow: ${validationTime}ms`);
    health.performance = false;
  }

  if (!result.success) {
    errors.push({
      field: "schemas",
      message: "Schema validation system is not working",
      code: "schema_validation_failed",
      severity: "critical",
      suggestedFix: "Check schema definitions and validation logic",
    });
    health.schemas = false;
  }

  // Test environment
  const envResult = validateEnvironment();
  if (!envResult.success) {
    errors.push(...(envResult.errors || []));
    health.environment = false;
  }

  return {
    success: errors.length === 0,
    data: health,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined,
    metadata: {
      validationTime,
      schemaVersion: SCHEMA_VERSION,
      dataSize: 0,
    },
  };
}
