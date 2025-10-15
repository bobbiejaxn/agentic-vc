// ADK Infrastructure - InMemorySessionService
// Manages agent sessions and context for the VC Portfolio Intelligence System

import { AgentContext } from "./base-agent";
import { PortfolioIntelligenceOrchestrator } from "./portfolio-orchestrator";

export interface SessionData {
  sessionId: string;
  userId: string;
  portfolioId?: string;
  createdAt: Date;
  lastAccessedAt: Date;
  context: AgentContext;
  orchestrator?: PortfolioIntelligenceOrchestrator;
  metadata: Record<string, any>;
}

export class InMemorySessionService {
  private sessions: Map<string, SessionData> = new Map();
  private readonly sessionTimeout: number = 30 * 60 * 1000; // 30 minutes
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Start cleanup interval
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredSessions();
    }, 5 * 60 * 1000); // Cleanup every 5 minutes
  }

  /**
   * Create a new session
   */
  public createSession(
    userId: string,
    portfolioId?: string,
    metadata?: Record<string, any>
  ): SessionData {
    const sessionId = this.generateSessionId();
    const now = new Date();

    const context: AgentContext = {
      sessionId,
      userId,
      portfolioId,
      metadata: metadata || {},
    };

    const sessionData: SessionData = {
      sessionId,
      userId,
      portfolioId,
      createdAt: now,
      lastAccessedAt: now,
      context,
      metadata: metadata || {},
    };

    this.sessions.set(sessionId, sessionData);
    return sessionData;
  }

  /**
   * Get session by ID
   */
  public getSession(sessionId: string): SessionData | null {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return null;
    }

    // Check if session is expired
    if (this.isSessionExpired(session)) {
      this.sessions.delete(sessionId);
      return null;
    }

    // Update last accessed time
    session.lastAccessedAt = new Date();
    return session;
  }

  /**
   * Get or create orchestrator for session
   */
  public getOrchestrator(
    sessionId: string
  ): PortfolioIntelligenceOrchestrator | null {
    const session = this.getSession(sessionId);

    if (!session) {
      return null;
    }

    if (!session.orchestrator) {
      session.orchestrator = new PortfolioIntelligenceOrchestrator(
        session.context
      );
    }

    return session.orchestrator;
  }

  /**
   * Update session context
   */
  public updateSessionContext(
    sessionId: string,
    updates: Partial<AgentContext>
  ): boolean {
    const session = this.getSession(sessionId);

    if (!session) {
      return false;
    }

    session.context = { ...session.context, ...updates };

    // Update orchestrator context if it exists
    if (session.orchestrator) {
      session.orchestrator.updateContext(session.context);
    }

    return true;
  }

  /**
   * Update session metadata
   */
  public updateSessionMetadata(
    sessionId: string,
    updates: Record<string, any>
  ): boolean {
    const session = this.getSession(sessionId);

    if (!session) {
      return false;
    }

    session.metadata = { ...session.metadata, ...updates };
    return true;
  }

  /**
   * Delete session
   */
  public deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  /**
   * Get all sessions for a user
   */
  public getUserSessions(userId: string): SessionData[] {
    const userSessions: SessionData[] = [];

    for (const session of this.sessions.values()) {
      if (session.userId === userId && !this.isSessionExpired(session)) {
        userSessions.push(session);
      }
    }

    return userSessions.sort(
      (a, b) => b.lastAccessedAt.getTime() - a.lastAccessedAt.getTime()
    );
  }

  /**
   * Get session statistics
   */
  public getSessionStats(): {
    totalSessions: number;
    activeSessions: number;
    expiredSessions: number;
    averageSessionAge: number;
  } {
    const now = new Date();
    let totalSessions = 0;
    let activeSessions = 0;
    let expiredSessions = 0;
    let totalAge = 0;

    for (const session of this.sessions.values()) {
      totalSessions++;

      if (this.isSessionExpired(session)) {
        expiredSessions++;
      } else {
        activeSessions++;
        totalAge += now.getTime() - session.createdAt.getTime();
      }
    }

    return {
      totalSessions,
      activeSessions,
      expiredSessions,
      averageSessionAge: activeSessions > 0 ? totalAge / activeSessions : 0,
    };
  }

  /**
   * Cleanup expired sessions
   */
  private cleanupExpiredSessions(): void {
    const expiredSessions: string[] = [];

    for (const [sessionId, session] of this.sessions.entries()) {
      if (this.isSessionExpired(session)) {
        expiredSessions.push(sessionId);
      }
    }

    for (const sessionId of expiredSessions) {
      this.sessions.delete(sessionId);
    }

    if (expiredSessions.length > 0) {
      console.log(`Cleaned up ${expiredSessions.length} expired sessions`);
    }
  }

  /**
   * Check if session is expired
   */
  private isSessionExpired(session: SessionData): boolean {
    const now = new Date();
    const timeSinceLastAccess =
      now.getTime() - session.lastAccessedAt.getTime();
    return timeSinceLastAccess > this.sessionTimeout;
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Destroy the session service
   */
  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.sessions.clear();
  }
}

// Singleton instance
export const sessionService = new InMemorySessionService();
