"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { io, Socket } from "socket.io-client";

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

export interface UseWebSocketOptions {
  autoConnect?: boolean;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

export interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (event: string, data: any) => void;
  subscribeToPortfolio: (portfolioId: string) => void;
  subscribeToDocuments: (userId: string) => void;
  lastMessage: WebSocketMessage | null;
}

export function useWebSocket(
  options: UseWebSocketOptions = {}
): UseWebSocketReturn {
  const {
    autoConnect = true,
    reconnectAttempts = 3, // Reduced from 5 to prevent connection buildup
    reconnectDelay = 2000, // Increased delay to reduce connection frequency
  } = options;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionAttemptRef = useRef(0); // Track connection attempts to prevent loops
  const supabase = createClientComponentClient();

  const connect = useCallback(async () => {
    if (socket?.connected || isConnecting) return;

    // Prevent too many connection attempts
    if (connectionAttemptRef.current > 10) {
      console.warn("Too many WebSocket connection attempts, stopping");
      return;
    }
    connectionAttemptRef.current++;

    setIsConnecting(true);
    setError(null);

    try {
      // Get the current session token
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        // For development, use dev bypass instead of throwing error
        console.log("No Supabase session, using dev mode for WebSocket");
        setIsConnected(false);
        setIsConnecting(false);
        setError("WebSocket server not available in development mode");
        return;
      }

      // Disconnect existing socket first to prevent leaks
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }

      // Create socket connection with connection limits
      const newSocket = io(
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        {
          transports: ["websocket", "polling"],
          auth: {
            token: session.access_token,
          },
          forceNew: true, // Force new connection to prevent reuse issues
          timeout: 5000, // Add timeout
          reconnection: false, // Disable automatic reconnection to prevent loops
        }
      );

      // Set up event listeners
      newSocket.on("connect", () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectAttemptsRef.current = 0;

        // Authenticate with the server
        newSocket.emit("authenticate", { token: session.access_token });
      });

      newSocket.on("authenticated", (data: { userId: string }) => {
        console.log("WebSocket authenticated for user:", data.userId);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("WebSocket disconnected:", reason);
        setIsConnected(false);
        setIsConnecting(false);

        // Attempt to reconnect if not a manual disconnect
        if (
          reason !== "io client disconnect" &&
          reconnectAttemptsRef.current < reconnectAttempts
        ) {
          reconnectAttemptsRef.current++;
          console.log(
            `Attempting to reconnect (${reconnectAttemptsRef.current}/${reconnectAttempts})`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay * reconnectAttemptsRef.current);
        }
      });

      newSocket.on("connect_error", (err) => {
        console.error("WebSocket connection error:", err);
        setError(err.message);
        setIsConnecting(false);
      });

      newSocket.on("authentication_error", (data: { message: string }) => {
        console.error("WebSocket authentication error:", data.message);
        setError(data.message);
        setIsConnecting(false);
      });

      // Set up message handlers
      newSocket.on("portfolio_update", (message: WebSocketMessage) => {
        console.log("Portfolio update received:", message);
        setLastMessage(message);
      });

      newSocket.on("document_update", (message: WebSocketMessage) => {
        console.log("Document update received:", message);
        setLastMessage(message);
      });

      newSocket.on("investment_update", (message: WebSocketMessage) => {
        console.log("Investment update received:", message);
        setLastMessage(message);
      });

      newSocket.on("notification", (message: WebSocketMessage) => {
        console.log("Notification received:", message);
        setLastMessage(message);
      });

      setSocket(newSocket);
    } catch (err) {
      console.error("Failed to connect WebSocket:", err);
      setError(err instanceof Error ? err.message : "Connection failed");
      setIsConnecting(false);
    }
  }, [socket, isConnecting, supabase, reconnectAttempts, reconnectDelay]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (socket) {
      // Remove all listeners before disconnecting to prevent memory leaks
      socket.removeAllListeners();
      socket.disconnect();
      setSocket(null);
    }

    setIsConnected(false);
    setIsConnecting(false);
    reconnectAttemptsRef.current = 0;
  }, [socket]);

  const sendMessage = useCallback(
    (event: string, data: any) => {
      if (socket?.connected) {
        socket.emit(event, data);
      } else {
        console.warn("WebSocket not connected, cannot send message");
      }
    },
    [socket]
  );

  const subscribeToPortfolio = useCallback(
    (portfolioId: string) => {
      sendMessage("subscribe_portfolio", { portfolioId });
    },
    [sendMessage]
  );

  const subscribeToDocuments = useCallback(
    (userId: string) => {
      sendMessage("subscribe_documents", { userId });
    },
    [sendMessage]
  );

  // Auto-connect on mount with connection leak fixes
  useEffect(() => {
    // Disable WebSocket in development mode to prevent connection errors
    if (process.env.NODE_ENV === "development") {
      console.log("WebSocket disabled in development mode");
      return;
    }

    if (autoConnect && !socket?.connected && !isConnecting) {
      console.log("WebSocket auto-connecting with leak prevention");
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect]); // Remove connect/disconnect from deps to prevent infinite loop

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    socket,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    sendMessage,
    subscribeToPortfolio,
    subscribeToDocuments,
    lastMessage,
  };
}
