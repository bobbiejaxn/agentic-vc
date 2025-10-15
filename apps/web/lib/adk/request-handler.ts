import { shouldUseAgentEngine } from "@/lib/config/backend-config";
import { getAuthHeaders } from "@/lib/config/server-auth";
import type {
  ProcessingResult,
  RequestHandler,
  RequestPayload,
} from "./request-types";

/**
 * Abstract base class for request handlers
 * Consolidates shared request execution logic and error handling
 */
abstract class AbstractRequestHandler implements RequestHandler {
  protected abstract getHandlerName(): string;
  protected abstract getLogPrefix(): string;

  async handleRequest(
    sessionId: string,
    userMessage: string,
    userId: string,
  ): Promise<ProcessingResult> {
    // Validate environment using shared logic
    const envResult = this.validateEnvironment(sessionId);
    if (!envResult.success) {
      return envResult;
    }

    this.logProcessingStart(sessionId);

    // Create handler-specific payload (implemented by subclasses)
    const payload = await this.createPayload(
      sessionId,
      userMessage,
      userId,
      envResult.url,
    );

    // Execute request using shared logic
    return await this.executeRequest(payload, sessionId);
  }

  protected abstract createPayload(
    sessionId: string,
    userMessage: string,
    userId: string,
    adkUrl: string,
  ): Promise<RequestPayload>;

  /**
   * Shared environment validation logic
   */
  private validateEnvironment(
    sessionId: string,
  ):
    | { success: true; url: string; sessionId: string }
    | { success: false; sessionId: string; error: string } {
    const adkUrl = process.env.ADK_URL;
    if (!adkUrl) {
      return {
        success: false,
        sessionId,
        error: "ADK_URL environment variable not configured",
      } as const;
    }
    return { success: true, url: adkUrl, sessionId } as const;
  }

  /**
   * Shared request execution logic (eliminates code duplication)
   */
  private async executeRequest(
    payload: RequestPayload,
    sessionId: string,
  ): Promise<ProcessingResult> {
    try {
      console.log(
        `📤 [${this.getLogPrefix()}] Sending request to:`,
        payload.endpoint,
      );

      const response = await fetch(payload.endpoint, {
        method: "POST",
        headers: payload.headers,
        body: JSON.stringify(payload.body),
      });

      console.log(
        `📥 [${this.getLogPrefix()}] Response status:`,
        response.status,
      );

      if (!response.ok) {
        const errorMessage = `${this.getHandlerName()} request failed: ${
          response.status
        } ${response.statusText}`;
        console.error(`❌ [${this.getLogPrefix()}]`, errorMessage);
        return {
          success: false,
          sessionId,
          error: errorMessage,
        };
      }

      console.log(`✅ [${this.getLogPrefix()}] Request completed successfully`);
      return { success: true, sessionId };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown network error";
      console.error(`❌ [${this.getLogPrefix()}] Network error:`, errorMessage);
      return {
        success: false,
        sessionId,
        error: `${this.getHandlerName()} network error: ${errorMessage}`,
      };
    }
  }

  /**
   * Shared logging logic
   */
  private logProcessingStart(sessionId: string): void {
    console.log(
      `${this.getLogPrefix()} Processing request for session:`,
      sessionId,
    );
  }
}

/**
 * Localhost Request Handler
 * Handles requests to local ADK server using ADK format payloads
 */
class LocalhostHandler extends AbstractRequestHandler {
  protected getHandlerName(): string {
    return "Localhost";
  }

  protected getLogPrefix(): string {
    return "🏠 [LOCALHOST_HANDLER]";
  }

  /**
   * Create ADK format payload for localhost server
   */
  protected async createPayload(
    sessionId: string,
    userMessage: string,
    userId: string,
    adkUrl: string,
  ): Promise<RequestPayload> {
    const headers = await getAuthHeaders();

    return {
      endpoint: `${adkUrl}/run`,
      body: {
        app_name: "competitor_analysis_agent",
        user_id: userId,
        session_id: sessionId,
        new_message: {
          role: "user",
          parts: [{ text: userMessage }],
        },
        streaming: false,
      },
      headers,
    };
  }
}

/**
 * Agent Engine Request Handler
 * Handles requests to Google Cloud Agent Engine using simple input format
 */
class AgentEngineHandler extends AbstractRequestHandler {
  protected getHandlerName(): string {
    return "Agent Engine";
  }

  protected getLogPrefix(): string {
    return "🤖 [AGENT_ENGINE_HANDLER]";
  }

  /**
   * Create simple input format payload for Agent Engine
   */
  protected async createPayload(
    sessionId: string,
    userMessage: string,
    userId: string,
    adkUrl: string,
  ): Promise<RequestPayload> {
    const headers = await getAuthHeaders();

    return {
      endpoint: adkUrl.replace(":query", ":streamQuery"),
      body: {
        input: {
          user_id: userId,
          session_id: sessionId,
          message: userMessage,
        },
      },
      headers,
    };
  }
}

/**
 * Unified Request Handler Factory
 *
 * Provides clean interface for agent processing that abstracts away
 * backend-specific implementation details
 */
export class UnifiedRequestHandler {
  /**
   * Process agent request using appropriate backend handler
   */
  async processAgentRequest(
    sessionId: string,
    userMessage: string,
    userId: string,
  ): Promise<ProcessingResult> {
    console.log("🔄 [UNIFIED_HANDLER] Processing agent request:", {
      sessionId,
      messagePreview: userMessage.substring(0, 50) + "...",
      userId,
    });

    const handler = this.createHandler();
    const result = await handler.handleRequest(sessionId, userMessage, userId);

    if (result.success) {
      console.log("✅ [UNIFIED_HANDLER] Agent request completed successfully");
    } else {
      console.error("❌ [UNIFIED_HANDLER] Agent request failed:", result.error);
    }

    return result;
  }

  /**
   * Factory method for handler selection based on backend configuration
   */
  private createHandler(): RequestHandler {
    if (shouldUseAgentEngine()) {
      console.log("🤖 [UNIFIED_HANDLER] Using Agent Engine handler");
      return new AgentEngineHandler();
    } else {
      console.log("🏠 [UNIFIED_HANDLER] Using Localhost handler");
      return new LocalhostHandler();
    }
  }
}
