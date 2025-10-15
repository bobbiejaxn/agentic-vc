import { NextRequest, NextResponse } from "next/server";
import { PortfolioRealtimeService } from "@/lib/realtime/portfolio-realtime";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "status";
    const userId =
      request.headers.get("x-dev-user-id") ||
      "550e8400-e29b-41d4-a716-446655440003";

    switch (action) {
      case "status":
        const status = PortfolioRealtimeService.getSubscriptionStatus(userId);
        return NextResponse.json({
          success: true,
          data: {
            ...status,
            activeSubscriptions:
              PortfolioRealtimeService.getActiveSubscriptionCount(),
          },
        });

      case "subscribe":
        // This would typically be handled by WebSocket connection
        // For now, return subscription info
        return NextResponse.json({
          success: true,
          data: {
            message: "Real-time subscriptions available",
            userId,
            availableChannels: [
              "portfolio_updates",
              "analytics_updates",
              "custom_updates",
            ],
          },
        });

      case "unsubscribe":
        PortfolioRealtimeService.unsubscribeFromAll(userId);
        return NextResponse.json({
          success: true,
          data: {
            message: "Unsubscribed from all real-time updates",
            userId,
          },
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Realtime API error:", error);
    return NextResponse.json(
      { error: "Failed to handle real-time request" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, update } = body;
    const devUserId =
      request.headers.get("x-dev-user-id") ||
      "550e8400-e29b-41d4-a716-446655440003";
    const targetUserId = userId || devUserId;

    switch (action) {
      case "broadcast":
        if (!update) {
          return NextResponse.json(
            { error: "Update data required" },
            { status: 400 }
          );
        }

        await PortfolioRealtimeService.broadcastUpdate(targetUserId, update);
        return NextResponse.json({
          success: true,
          data: {
            message: "Update broadcasted successfully",
            userId: targetUserId,
          },
        });

      case "test":
        // Send a test update
        await PortfolioRealtimeService.broadcastUpdate(targetUserId, {
          type: "portfolio_updated",
          data: {
            message: "Test real-time update",
            timestamp: new Date().toISOString(),
          },
        });
        return NextResponse.json({
          success: true,
          data: {
            message: "Test update sent",
            userId: targetUserId,
          },
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Realtime API error:", error);
    return NextResponse.json(
      { error: "Failed to handle real-time request" },
      { status: 500 }
    );
  }
}

