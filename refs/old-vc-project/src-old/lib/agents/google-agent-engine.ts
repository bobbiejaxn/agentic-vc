// ADK Infrastructure - Google Agent Engine
// Provides AI engine capabilities using Google Vertex AI

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AgentEngineConfig {
  projectId: string;
  location: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
}

export interface AgentEngineResponse {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  metadata: {
    model: string;
    finishReason: string;
    safetyRatings?: any[];
  };
}

export class GoogleAgentEngine {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private config: AgentEngineConfig;

  constructor(config: AgentEngineConfig) {
    this.config = {
      temperature: 0.1,
      maxTokens: 4096,
      topP: 0.8,
      topK: 40,
      ...config,
    };

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_AI_API_KEY is not set in environment variables.");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: this.config.model,
    });
  }

  /**
   * Generate text using the configured model
   */
  public async generateText(
    prompt: string,
    options?: {
      temperature?: number;
      maxTokens?: number;
      topP?: number;
      topK?: number;
    }
  ): Promise<AgentEngineResponse> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;

      return {
        text: response.text(),
        usage: {
          promptTokens: 0, // Gemini API doesn't provide detailed token usage
          completionTokens: 0,
          totalTokens: 0,
        },
        metadata: {
          model: this.config.model,
          finishReason: "STOP",
          safetyRatings: [],
        },
      };
    } catch (error) {
      console.error("Google Agent Engine error:", error);
      throw new Error(
        `AI generation failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Generate structured JSON response
   */
  public async generateStructuredResponse<T>(
    prompt: string,
    schema: Record<string, any>,
    options?: {
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<T> {
    try {
      const structuredPrompt = `${prompt}

Please respond with ONLY a valid JSON object that matches this schema:
${JSON.stringify(schema, null, 2)}

Requirements:
- Return only the JSON object, no additional text
- Use null for missing values, not empty strings
- Ensure all required fields are present
- Validate data types match the schema

Do not include any explanations, comments, or formatting outside the JSON object.`;

      const response = await this.generateText(structuredPrompt, {
        temperature: options?.temperature ?? 0.1, // Lower temperature for structured output
        maxTokens: options?.maxTokens ?? 4096,
      });

      // Extract JSON from response
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      return JSON.parse(jsonMatch[0]) as T;
    } catch (error) {
      console.error("Structured response generation error:", error);
      throw new Error(
        `Structured response generation failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Generate multiple responses for comparison
   */
  public async generateMultipleResponses(
    prompt: string,
    count: number = 3,
    options?: {
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<AgentEngineResponse[]> {
    const responses: AgentEngineResponse[] = [];

    for (let i = 0; i < count; i++) {
      try {
        const response = await this.generateText(prompt, {
          temperature: (options?.temperature ?? 0.7) + i * 0.1, // Vary temperature slightly
          maxTokens: options?.maxTokens ?? this.config.maxTokens,
        });
        responses.push(response);
      } catch (error) {
        console.error(`Error generating response ${i + 1}:`, error);
        // Continue with other responses
      }
    }

    return responses;
  }

  /**
   * Generate response with retry logic
   */
  public async generateWithRetry(
    prompt: string,
    maxRetries: number = 3,
    options?: {
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<AgentEngineResponse> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.generateText(prompt, options);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Unknown error");
        console.error(`Attempt ${attempt + 1} failed:`, lastError);

        if (attempt < maxRetries - 1) {
          // Wait before retry (exponential backoff)
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * Math.pow(2, attempt))
          );
        }
      }
    }

    throw new Error(
      `Failed to generate response after ${maxRetries} attempts: ${lastError?.message}`
    );
  }

  /**
   * Get engine configuration
   */
  public getConfig(): AgentEngineConfig {
    return { ...this.config };
  }

  /**
   * Update engine configuration
   */
  public updateConfig(updates: Partial<AgentEngineConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  /**
   * Test engine connectivity
   */
  public async testConnection(): Promise<boolean> {
    try {
      await this.generateText("Test connection", { maxTokens: 10 });
      return true;
    } catch (error) {
      console.error("Engine connection test failed:", error);
      return false;
    }
  }

  /**
   * Get model information
   */
  public getModelInfo(): {
    model: string;
    projectId: string;
    location: string;
    capabilities: string[];
  } {
    return {
      model: this.config.model,
      projectId: this.config.projectId,
      location: this.config.location,
      capabilities: [
        "text_generation",
        "structured_output",
        "multi_turn_conversation",
        "safety_filtering",
      ],
    };
  }
}

// Default engine instance
export const googleAgentEngine = new GoogleAgentEngine({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || "",
  location: process.env.DOCUMENT_AI_LOCATION || "us-central1",
  model: "gemini-2.5-flash-preview-09-2025", // Updated to latest Gemini 2.5 Flash Preview
  temperature: 0.1,
  maxTokens: 4096,
});
