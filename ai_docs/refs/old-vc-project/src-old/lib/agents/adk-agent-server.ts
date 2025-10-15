// ADK Agent Server - VC Portfolio Intelligence System
// Main server that orchestrates all agents and provides API endpoints

import { NextRequest, NextResponse } from "next/server";
import {
  PortfolioIntelligenceOrchestrator,
  DocumentProcessingRequest,
  DocumentProcessingResult,
} from "./portfolio-orchestrator";
import { sessionService, InMemorySessionService } from "./session-service";
import { googleAgentEngine, GoogleAgentEngine } from "./google-agent-engine";

export interface ADKServerConfig {
  sessionService: InMemorySessionService;
  agentEngine: GoogleAgentEngine;
  maxConcurrentSessions: number;
  sessionTimeout: number;
}

export class ADKAgentServer {
  private config: ADKServerConfig;
  private activeSessions: Set<string> = new Set();

  constructor(config?: Partial<ADKServerConfig>) {
    this.config = {
      sessionService: config?.sessionService || sessionService,
      agentEngine: config?.agentEngine || googleAgentEngine,
      maxConcurrentSessions: config?.maxConcurrentSessions || 100,
      sessionTimeout: config?.sessionTimeout || 30 * 60 * 1000, // 30 minutes
    };
  }

  /**
   * Process document through the ADK agent pipeline
   */
  public async processDocument(
    request: DocumentProcessingRequest,
    sessionId?: string
  ): Promise<DocumentProcessingResult> {
    try {
      // Get or create session
      const session = sessionId
        ? this.config.sessionService.getSession(sessionId)
        : this.config.sessionService.createSession(
            request.userId,
            request.portfolioId
          );

      if (!session) {
        throw new Error("Failed to create or retrieve session");
      }

      // Check concurrent session limit
      if (this.activeSessions.size >= this.config.maxConcurrentSessions) {
        throw new Error("Maximum concurrent sessions reached");
      }

      this.activeSessions.add(session.sessionId);

      try {
        // Get orchestrator for the session
        const orchestrator = this.config.sessionService.getOrchestrator(
          session.sessionId
        );
        if (!orchestrator) {
          throw new Error("Failed to create orchestrator");
        }

        // Process document with retry logic
        const result = await orchestrator.processDocumentWithRetry(request);

        if (!result.success) {
          throw new Error(result.error || "Document processing failed");
        }

        return result.data!;
      } finally {
        this.activeSessions.delete(session.sessionId);
      }
    } catch (error) {
      console.error("ADK Agent Server error:", error);
      throw error;
    }
  }

  /**
   * Get session information
   */
  public getSessionInfo(sessionId: string): {
    sessionId: string;
    userId: string;
    portfolioId?: string;
    createdAt: Date;
    lastAccessedAt: Date;
    isActive: boolean;
    pipelineStatus: any;
  } | null {
    const session = this.config.sessionService.getSession(sessionId);
    if (!session) {
      return null;
    }

    const orchestrator = this.config.sessionService.getOrchestrator(sessionId);
    const pipelineStatus = orchestrator?.getPipelineStatus();

    return {
      sessionId: session.sessionId,
      userId: session.userId,
      portfolioId: session.portfolioId,
      createdAt: session.createdAt,
      lastAccessedAt: session.lastAccessedAt,
      isActive: this.activeSessions.has(sessionId),
      pipelineStatus,
    };
  }

  /**
   * Get server statistics
   */
  public getServerStats(): {
    activeSessions: number;
    maxConcurrentSessions: number;
    sessionStats: any;
    engineInfo: any;
  } {
    return {
      activeSessions: this.activeSessions.size,
      maxConcurrentSessions: this.config.maxConcurrentSessions,
      sessionStats: this.config.sessionService.getSessionStats(),
      engineInfo: this.config.agentEngine.getModelInfo(),
    };
  }

  /**
   * Health check endpoint
   */
  public async healthCheck(): Promise<{
    status: "healthy" | "unhealthy";
    timestamp: string;
    services: {
      sessionService: boolean;
      agentEngine: boolean;
    };
    stats: any;
  }> {
    const engineHealthy = await this.config.agentEngine.testConnection();
    const sessionServiceHealthy = true; // In-memory service is always available

    return {
      status: engineHealthy && sessionServiceHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        sessionService: sessionServiceHealthy,
        agentEngine: engineHealthy,
      },
      stats: this.getServerStats(),
    };
  }
}

// Singleton instance
export const adkAgentServer = new ADKAgentServer();

/**
 * API Route Handler for Document Processing
 */
export async function handleDocumentProcessing(
  request: NextRequest
): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validate request
    const requiredFields = [
      "fileName",
      "fileType",
      "fileSize",
      "rawText",
      "userId",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const documentRequest: DocumentProcessingRequest = {
      fileName: body.fileName,
      fileType: body.fileType,
      fileSize: body.fileSize,
      rawText: body.rawText,
      userId: body.userId,
      portfolioId: body.portfolioId,
      documentId: body.documentId,
    };

    const sessionId = request.headers.get("x-session-id");
    const result = await adkAgentServer.processDocument(
      documentRequest,
      sessionId || undefined
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Document processing API error:", error);
    return NextResponse.json(
      {
        error: "Document processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * API Route Handler for Session Management
 */
export async function handleSessionManagement(
  request: NextRequest
): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("sessionId");

    if (request.method === "GET") {
      if (sessionId) {
        // Get specific session
        const sessionInfo = adkAgentServer.getSessionInfo(sessionId);
        if (!sessionInfo) {
          return NextResponse.json(
            { error: "Session not found" },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, data: sessionInfo });
      } else {
        // Get server stats
        const stats = adkAgentServer.getServerStats();
        return NextResponse.json({ success: true, data: stats });
      }
    } else if (request.method === "DELETE" && sessionId) {
      // Delete session
      const deleted = sessionService.deleteSession(sessionId);
      return NextResponse.json({
        success: deleted,
        message: deleted ? "Session deleted" : "Session not found",
      });
    } else {
      return NextResponse.json(
        { error: "Invalid request method" },
        { status: 405 }
      );
    }
  } catch (error) {
    console.error("Session management API error:", error);
    return NextResponse.json(
      {
        error: "Session management failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * API Route Handler for Health Check
 */
export async function handleHealthCheck(): Promise<NextResponse> {
  try {
    const health = await adkAgentServer.healthCheck();
    const status = health.status === "healthy" ? 200 : 503;

    return NextResponse.json(health, { status });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
