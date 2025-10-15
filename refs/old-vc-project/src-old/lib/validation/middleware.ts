// Validation middleware for API routes
// Implements the "validate before processing" strategy from schema-validation-strategies.md

import { NextRequest, NextResponse } from "next/server";
import { z, ZodSchema } from "zod";

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

/**
 * Validates request data against a Zod schema
 * Returns human-friendly error messages as recommended in the guide
 */
export function validateRequest<T>(
  data: unknown,
  schema: ZodSchema<T>
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  // Transform Zod errors into human-friendly format
  const errors: ValidationError[] = result.error.errors.map((error) => ({
    field: error.path.join("."),
    message: error.message,
    code: error.code,
  }));

  return {
    success: false,
    errors,
  };
}

/**
 * Middleware wrapper for API route validation
 * Automatically validates request data and returns 400 with detailed errors
 */
export function withValidation<T>(
  schema: ZodSchema<T>,
  getData: (request: NextRequest) => unknown
) {
  return function validationMiddleware(
    request: NextRequest,
    handler: (request: NextRequest, validatedData: T) => Promise<NextResponse>
  ) {
    return async (request: NextRequest) => {
      try {
        const data = getData(request);
        const validation = validateRequest(data, schema);

        if (!validation.success) {
          return NextResponse.json(
            {
              success: false,
              error: "Validation failed",
              details: validation.errors,
            },
            { status: 400 }
          );
        }

        return await handler(request, validation.data!);
      } catch (error) {
        console.error("Validation middleware error:", error);
        return NextResponse.json(
          {
            success: false,
            error: "Internal validation error",
          },
          { status: 500 }
        );
      }
    };
  };
}

/**
 * Validates extracted data from AI processing
 * Ensures data quality before storing in database
 */
export function validateExtractedData(data: unknown): ValidationResult<any> {
  // Import schema dynamically to avoid circular dependencies
  const { ExtractedDataSchema } = require("./schemas");
  return validateRequest(data, ExtractedDataSchema);
}

/**
 * Validates document processing results
 * Ensures processing completed successfully with valid data
 */
export function validateProcessingResult(data: unknown): ValidationResult<any> {
  // Import schema dynamically to avoid circular dependencies
  const { DocumentProcessingResultSchema } = require("./schemas");
  return validateRequest(data, DocumentProcessingResultSchema);
}

/**
 * Creates a validation error response
 * Standardized error format for API responses
 */
export function createValidationErrorResponse(errors: ValidationError[]) {
  return NextResponse.json(
    {
      success: false,
      error: "Validation failed",
      details: errors,
    },
    { status: 400 }
  );
}

/**
 * Validates file upload data
 * Ensures file meets requirements before processing
 */
export function validateFileUpload(file: File): ValidationResult<File> {
  const errors: ValidationError[] = [];

  // Check file size (max 50MB)
  if (file.size > 50 * 1024 * 1024) {
    errors.push({
      field: "file",
      message: "File size must be less than 50MB",
      code: "too_big",
    });
  }

  // Check file type
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  if (!allowedTypes.includes(file.type)) {
    errors.push({
      field: "file",
      message:
        "File type not supported. Please upload PDF, DOC, DOCX, or TXT files",
      code: "invalid_type",
    });
  }

  if (errors.length > 0) {
    return {
      success: false,
      errors,
    };
  }

  return {
    success: true,
    data: file,
  };
}
