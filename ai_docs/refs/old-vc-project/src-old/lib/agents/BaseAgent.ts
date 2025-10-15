import { ChatOpenAI } from "@langchain/openai";
import { ChatVertexAI } from "@langchain/google-vertexai";

/**
 * Base Agent class inspired by Google ADK
 * Provides common functionality for all VC Intelligence agents
 */
export abstract class BaseAgent {
  protected name: string;
  protected description: string;
  protected llm: ChatOpenAI | ChatVertexAI;
  protected tools: any[] = [];

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    this.initializeLLM();
  }

  /**
   * Initialize the language model
   */
  private initializeLLM(): void {
    // Use Google Vertex AI if available, otherwise fallback to OpenAI
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      this.llm = new ChatVertexAI({
        model: "gemini-2.5-pro", // Updated to latest Gemini 2.5 Pro
        temperature: 0.1,
        maxOutputTokens: 8192,
      });
    } else {
      this.llm = new ChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0.1,
        maxTokens: 8192,
      });
    }
  }

  /**
   * Add a tool to the agent
   */
  protected addTool(tool: any): void {
    this.tools.push(tool);
  }

  /**
   * Execute a tool by name
   */
  protected async executeTool(toolName: string, args: any): Promise<any> {
    const tool = this.tools.find((t) => t.name === toolName);
    if (!tool) {
      throw new Error(`Tool ${toolName} not found`);
    }
    return await tool.execute(args);
  }

  /**
   * Generate a response using the LLM
   */
  protected async generateResponse(
    prompt: string,
    context?: any
  ): Promise<string> {
    try {
      const response = await this.llm.invoke(prompt);
      return response.content as string;
    } catch (error) {
      console.error(`Error generating response for ${this.name}:`, error);
      throw error;
    }
  }

  /**
   * Health check for the agent
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Test LLM connectivity
      await this.generateResponse("Hello, this is a health check.");
      return true;
    } catch (error) {
      console.error(`Health check failed for ${this.name}:`, error);
      return false;
    }
  }

  /**
   * Get agent information
   */
  getInfo(): { name: string; description: string; tools: string[] } {
    return {
      name: this.name,
      description: this.description,
      tools: this.tools.map((t) => t.name),
    };
  }
}
