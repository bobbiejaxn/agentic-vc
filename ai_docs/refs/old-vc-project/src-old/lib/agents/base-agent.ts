// Base Agent Infrastructure for VC Portfolio Intelligence System
// Implements ADK-style agent architecture with Google Vertex AI

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AgentContext {
  sessionId: string;
  userId: string;
  portfolioId?: string;
  documentId?: string;
  metadata?: Record<string, any>;
}

export interface AgentResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  confidence?: number;
  metadata?: Record<string, any>;
}

export interface AgentMessage {
  role: "system" | "user" | "assistant";
  content: string;
  metadata?: Record<string, any>;
}

export abstract class BaseAgent {
  protected genAI: GoogleGenerativeAI;
  protected model: any;
  protected context: AgentContext;
  protected messages: AgentMessage[] = [];

  constructor(context: AgentContext) {
    this.context = context;

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_AI_API_KEY is not set in environment variables.");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-09-2025", // Updated to latest Gemini 2.5 Flash Preview
    });
  }

  /**
   * Abstract method to be implemented by specific agents
   */
  abstract execute(input: any): Promise<AgentResult>;

  /**
   * Add system message to conversation
   */
  protected addSystemMessage(
    content: string,
    metadata?: Record<string, any>
  ): void {
    this.messages.push({
      role: "system",
      content,
      metadata,
    });
  }

  /**
   * Add user message to conversation
   */
  protected addUserMessage(
    content: string,
    metadata?: Record<string, any>
  ): void {
    this.messages.push({
      role: "user",
      content,
      metadata,
    });
  }

  /**
   * Add assistant message to conversation
   */
  protected addAssistantMessage(
    content: string,
    metadata?: Record<string, any>
  ): void {
    this.messages.push({
      role: "assistant",
      content,
      metadata,
    });
  }

  /**
   * Generate response using Google Generative AI with retry logic
   */
  protected async generateResponse(
    prompt: string,
    maxRetries: number = 3
  ): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Unknown error");
        console.error(
          `AI generation attempt ${attempt} failed:`,
          lastError.message
        );

        // Check if it's a retryable error (503, 429, etc.)
        const isRetryable = this.isRetryableError(lastError);

        if (!isRetryable || attempt === maxRetries) {
          break;
        }

        // Exponential backoff: 2^attempt seconds
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new Error(
      `AI generation failed after ${maxRetries} attempts: ${
        lastError?.message || "Unknown error"
      }`
    );
  }

  /**
   * Check if an error is retryable
   */
  private isRetryableError(error: Error): boolean {
    const message = error.message.toLowerCase();
    return (
      message.includes("503") || // Service Unavailable
      message.includes("429") || // Too Many Requests
      message.includes("overloaded") ||
      message.includes("rate limit") ||
      message.includes("timeout")
    );
  }

  /**
   * Generate structured JSON response
   */
  protected async generateStructuredResponse<T>(
    prompt: string,
    schema: Record<string, any>
  ): Promise<T> {
    try {
      const structuredPrompt = `${prompt}

Please respond with ONLY a valid JSON object that matches this schema:
${JSON.stringify(schema, null, 2)}

Do not include any additional text, explanations, or formatting. Return only the JSON object.`;

      const response = await this.generateResponse(structuredPrompt);

      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      // Clean the JSON string by removing control characters and fixing common issues
      let cleanedJson = jsonMatch[0]
        .replace(/[\x00-\x1F\x7F]/g, "") // Remove control characters
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim();

      // Fix common JSON issues
      cleanedJson = cleanedJson
        .replace(/,(\s*[}\]])/g, "$1") // Remove trailing commas
        .replace(/([^\\])\\([^"\\\/bfnrt])/g, "$1\\\\$2") // Fix unescaped backslashes
        .replace(/([^\\])\\([^"\\\/bfnrt])/g, "$1\\\\$2") // Double fix for nested issues
        .replace(/([^\\])\\([^"\\\/bfnrt])/g, "$1\\\\$2") // Triple fix for deeply nested issues
        .replace(/([^\\])\\([^"\\\/bfnrt])/g, "$1\\\\$2") // Quadruple fix for complex cases
        .replace(/([^\\])\\([^"\\\/bfnrt])/g, "$1\\\\$2") // Quintuple fix for edge cases
        .replace(/([^\\])\\([^"\\\/bfnrt])/g, "$1\\\\$2"); // Sextuple fix for extreme cases

      // Additional JSON validation and repair
      try {
        // Try to parse and re-stringify to validate
        const parsed = JSON.parse(cleanedJson);
        cleanedJson = JSON.stringify(parsed);
      } catch (validationError) {
        // If still invalid, try more aggressive cleaning
        cleanedJson = cleanedJson
          .replace(/[^\x20-\x7E]/g, "") // Remove all non-printable characters
          .replace(/([^\\])\\([^"\\\/bfnrt])/g, "$1\\\\$2") // Fix remaining backslashes
          .replace(/,(\s*[}\]])/g, "$1") // Remove any remaining trailing commas
          .replace(/([^\\])\\([^"\\\/bfnrt])/g, "$1\\\\$2"); // Final backslash fix
      }

      return JSON.parse(cleanedJson) as T;
    } catch (error) {
      console.error("Error generating structured response:", error);

      // Last resort: try to extract valid JSON parts
      try {
        console.log("Attempting fallback JSON extraction...");
        const fallbackJson = this.extractValidJsonParts(cleanedJson);
        if (fallbackJson) {
          console.log("Fallback JSON extraction successful");
          return JSON.parse(fallbackJson) as T;
        }
      } catch (fallbackError) {
        console.error("Fallback JSON extraction also failed:", fallbackError);
      }

      throw new Error(
        `Structured response generation failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Extract valid JSON parts from malformed JSON
   */
  private extractValidJsonParts(jsonString: string): string | null {
    try {
      // Try to find the largest valid JSON object
      const openBraces = jsonString.indexOf("{");
      if (openBraces === -1) return null;

      let braceCount = 0;
      let endIndex = -1;

      for (let i = openBraces; i < jsonString.length; i++) {
        if (jsonString[i] === "{") braceCount++;
        if (jsonString[i] === "}") braceCount--;
        if (braceCount === 0) {
          endIndex = i;
          break;
        }
      }

      if (endIndex === -1) return null;

      const candidateJson = jsonString.substring(openBraces, endIndex + 1);

      // Try to parse the candidate
      JSON.parse(candidateJson);
      return candidateJson;
    } catch (error) {
      return null;
    }
  }

  /**
   * Validate agent result
   */
  protected validateResult<T>(
    data: T,
    validator: (data: T) => boolean
  ): boolean {
    return validator(data);
  }

  /**
   * Create error result
   */
  protected createErrorResult(
    error: string,
    metadata?: Record<string, any>
  ): AgentResult {
    return {
      success: false,
      error,
      metadata,
    };
  }

  /**
   * Create success result
   */
  protected createSuccessResult<T>(
    data: T,
    confidence?: number,
    metadata?: Record<string, any>
  ): AgentResult<T> {
    return {
      success: true,
      data,
      confidence,
      metadata,
    };
  }

  /**
   * Get agent context
   */
  public getContext(): AgentContext {
    return this.context;
  }

  /**
   * Update agent context
   */
  public updateContext(updates: Partial<AgentContext>): void {
    this.context = { ...this.context, ...updates };
  }

  /**
   * Clear conversation history
   */
  public clearMessages(): void {
    this.messages = [];
  }

  /**
   * Get conversation history
   */
  public getMessages(): AgentMessage[] {
    return [...this.messages];
  }
}
