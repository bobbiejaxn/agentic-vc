"use client";

import { useEffect, useState } from "react";
import { useWebSocket, WebSocketMessage } from "@/hooks/useWebSocket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, TrendingUp, TrendingDown, FileText, Bell } from "lucide-react";

interface PortfolioUpdate {
  id: string;
  type:
    | "value_change"
    | "new_investment"
    | "status_change"
    | "document_processed";
  portfolioId: string;
  portfolioName: string;
  message: string;
  value?: number;
  change?: number;
  changePercent?: number;
  timestamp: Date;
  isPositive?: boolean;
}

interface PortfolioUpdatesProps {
  userId: string;
  portfolioIds?: string[];
  maxUpdates?: number;
  showNotifications?: boolean;
}

export default function PortfolioUpdates({
  userId,
  portfolioIds = [],
  maxUpdates = 10,
  showNotifications = true,
}: PortfolioUpdatesProps) {
  const [updates, setUpdates] = useState<PortfolioUpdate[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    isConnected,
    lastMessage,
    subscribeToPortfolio,
    subscribeToDocuments,
  } = useWebSocket();

  // Subscribe to portfolio and document updates
  useEffect(() => {
    if (isConnected) {
      // Subscribe to all specified portfolios
      portfolioIds.forEach((portfolioId) => {
        subscribeToPortfolio(portfolioId);
      });

      // Subscribe to document updates for this user
      subscribeToDocuments(userId);
    }
  }, [
    isConnected,
    portfolioIds,
    userId,
    subscribeToPortfolio,
    subscribeToDocuments,
  ]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      const newUpdate = processWebSocketMessage(lastMessage);
      if (newUpdate) {
        setUpdates((prev) => [newUpdate, ...prev].slice(0, maxUpdates));
      }
    }
  }, [lastMessage, maxUpdates]);

  const processWebSocketMessage = (
    message: WebSocketMessage
  ): PortfolioUpdate | null => {
    switch (message.type) {
      case "portfolio_update":
        return {
          id: `portfolio-${Date.now()}`,
          type: "value_change",
          portfolioId: message.data.portfolioId,
          portfolioName: message.data.portfolioName || "Portfolio",
          message: `Portfolio value updated to $${message.data.totalValue?.toLocaleString()}`,
          value: message.data.totalValue,
          change: message.data.valueChange,
          changePercent: message.data.valueChangePercent,
          timestamp: new Date(message.timestamp),
          isPositive: (message.data.valueChange || 0) >= 0,
        };

      case "investment_update":
        return {
          id: `investment-${Date.now()}`,
          type: "new_investment",
          portfolioId: message.data.portfolioId,
          portfolioName: message.data.portfolioName || "Portfolio",
          message: `New investment: ${
            message.data.companyName
          } - $${message.data.amountInvested?.toLocaleString()}`,
          value: message.data.amountInvested,
          timestamp: new Date(message.timestamp),
          isPositive: true,
        };

      case "document_processing":
        return {
          id: `document-${Date.now()}`,
          type: "document_processed",
          portfolioId: message.data.portfolioId || "",
          portfolioName: message.data.portfolioName || "Portfolio",
          message: `Document "${message.data.documentName}" processing ${message.data.status}`,
          timestamp: new Date(message.timestamp),
          isPositive: message.data.status === "completed",
        };

      case "notification":
        return {
          id: `notification-${Date.now()}`,
          type: "status_change",
          portfolioId: message.data.portfolioId || "",
          portfolioName: message.data.portfolioName || "Portfolio",
          message: message.data.message,
          timestamp: new Date(message.timestamp),
          isPositive: message.data.type !== "error",
        };

      default:
        return null;
    }
  };

  const getUpdateIcon = (type: PortfolioUpdate["type"]) => {
    switch (type) {
      case "value_change":
        return <TrendingUp className="h-4 w-4" />;
      case "new_investment":
        return <TrendingUp className="h-4 w-4" />;
      case "document_processed":
        return <FileText className="h-4 w-4" />;
      case "status_change":
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getUpdateBadgeVariant = (update: PortfolioUpdate) => {
    if (update.type === "document_processed") {
      return update.isPositive ? "default" : "destructive";
    }
    if (update.type === "value_change") {
      return update.isPositive ? "default" : "destructive";
    }
    return "secondary";
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const clearUpdates = () => {
    setUpdates([]);
  };

  if (!showNotifications || updates.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-heading">Live Updates</CardTitle>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-xs text-gray-500">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
            {updates.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearUpdates}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {updates.slice(0, isExpanded ? maxUpdates : 3).map((update) => (
            <div
              key={update.id}
              className="flex items-start gap-3 p-3  border bg-gray-50"
            >
              <div
                className={`p-1 rounded-full ${
                  update.isPositive
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {getUpdateIcon(update.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant={getUpdateBadgeVariant(update)}
                    className="text-xs"
                  >
                    {update.type.replace("_", " ")}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(update.timestamp)}
                  </span>
                </div>

                <p className="text-sm text-gray-900 mb-1">{update.message}</p>

                {update.portfolioName && (
                  <p className="text-xs text-gray-600">
                    {update.portfolioName}
                  </p>
                )}

                {update.change !== undefined && (
                  <div className="flex items-center gap-1 mt-1">
                    {update.isPositive ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span
                      className={`text-xs font-mono ${
                        update.isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {update.isPositive ? "+" : ""}$
                      {update.change.toLocaleString()}
                      {update.changePercent &&
                        ` (${update.changePercent.toFixed(1)}%)`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {updates.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-xs"
            >
              {isExpanded ? "Show Less" : `Show ${updates.length - 3} More`}
            </Button>
          )}

          {updates.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              No recent updates
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
