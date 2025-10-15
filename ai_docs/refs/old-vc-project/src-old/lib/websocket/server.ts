import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export interface WebSocketMessage {
  type:
    | "portfolio_update"
    | "document_processing"
    | "notification"
    | "investment_update";
  userId: string;
  data: any;
  timestamp: Date;
}

export class WebSocketManager {
  private io: SocketIOServer;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket", "polling"],
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on("connection", async (socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Handle user authentication
      socket.on("authenticate", async (data: { token: string }) => {
        try {
          // Verify the user token with Supabase
          const supabase = createServerComponentClient({
            cookies: () => cookies(),
          });

          const {
            data: { user },
            error,
          } = await supabase.auth.getUser(data.token);

          if (user && !error) {
            this.connectedUsers.set(user.id, socket.id);
            socket.join(`user:${user.id}`);
            socket.emit("authenticated", { userId: user.id });
            console.log(`User ${user.id} authenticated and connected`);
          } else {
            socket.emit("authentication_error", { message: "Invalid token" });
          }
        } catch (error) {
          console.error("Authentication error:", error);
          socket.emit("authentication_error", {
            message: "Authentication failed",
          });
        }
      });

      // Handle portfolio updates
      socket.on("subscribe_portfolio", (data: { portfolioId: string }) => {
        socket.join(`portfolio:${data.portfolioId}`);
        console.log(
          `Socket ${socket.id} subscribed to portfolio ${data.portfolioId}`
        );
      });

      // Handle document processing updates
      socket.on("subscribe_documents", (data: { userId: string }) => {
        socket.join(`documents:${data.userId}`);
        console.log(
          `Socket ${socket.id} subscribed to documents for user ${data.userId}`
        );
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);

        // Remove user from connected users map
        for (const [userId, socketId] of this.connectedUsers.entries()) {
          if (socketId === socket.id) {
            this.connectedUsers.delete(userId);
            break;
          }
        }
      });
    });
  }

  // Send portfolio update to specific user
  public sendPortfolioUpdate(userId: string, portfolioId: string, data: any) {
    const message: WebSocketMessage = {
      type: "portfolio_update",
      userId,
      data,
      timestamp: new Date(),
    };

    this.io.to(`user:${userId}`).emit("portfolio_update", message);
    this.io.to(`portfolio:${portfolioId}`).emit("portfolio_update", message);
  }

  // Send document processing update
  public sendDocumentUpdate(userId: string, documentId: string, data: any) {
    const message: WebSocketMessage = {
      type: "document_processing",
      userId,
      data: { documentId, ...data },
      timestamp: new Date(),
    };

    this.io.to(`user:${userId}`).emit("document_update", message);
    this.io.to(`documents:${userId}`).emit("document_update", message);
  }

  // Send investment update
  public sendInvestmentUpdate(userId: string, investmentId: string, data: any) {
    const message: WebSocketMessage = {
      type: "investment_update",
      userId,
      data: { investmentId, ...data },
      timestamp: new Date(),
    };

    this.io.to(`user:${userId}`).emit("investment_update", message);
  }

  // Send notification to user
  public sendNotification(userId: string, notification: any) {
    const message: WebSocketMessage = {
      type: "notification",
      userId,
      data: notification,
      timestamp: new Date(),
    };

    this.io.to(`user:${userId}`).emit("notification", message);
  }

  // Broadcast to all connected users
  public broadcast(type: string, data: any) {
    this.io.emit(type, {
      type,
      data,
      timestamp: new Date(),
    });
  }

  // Get connected users count
  public getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Check if user is connected
  public isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }
}

// Global WebSocket manager instance
let wsManager: WebSocketManager | null = null;

export function getWebSocketManager(): WebSocketManager | null {
  return wsManager;
}

export function initializeWebSocket(server: HTTPServer): WebSocketManager {
  if (!wsManager) {
    wsManager = new WebSocketManager(server);
  }
  return wsManager;
}
