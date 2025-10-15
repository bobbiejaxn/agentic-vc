import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getWebSocketManager } from "@/lib/websocket/server";

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, data } = body;

    // Get WebSocket manager
    const wsManager = getWebSocketManager();
    if (!wsManager) {
      return NextResponse.json(
        { error: "WebSocket not available" },
        { status: 503 }
      );
    }

    // Send real-time update based on type
    switch (type) {
      case "portfolio_update":
        wsManager.sendPortfolioUpdate(user.id, data.portfolioId, data);
        break;

      case "document_processing":
        wsManager.sendDocumentUpdate(user.id, data.documentId, data);
        break;

      case "investment_update":
        wsManager.sendInvestmentUpdate(user.id, data.investmentId, data);
        break;

      case "notification":
        wsManager.sendNotification(user.id, data);
        break;

      default:
        return NextResponse.json(
          { error: "Invalid update type" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: "Real-time update sent",
      connectedUsers: wsManager.getConnectedUsersCount(),
    });
  } catch (error: any) {
    console.error("Error sending WebSocket update:", error);
    return NextResponse.json(
      { error: "Failed to send update", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get WebSocket manager
    const wsManager = getWebSocketManager();
    if (!wsManager) {
      return NextResponse.json(
        { error: "WebSocket not available" },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      connectedUsers: wsManager.getConnectedUsersCount(),
      isUserConnected: wsManager.isUserConnected(user.id),
    });
  } catch (error: any) {
    console.error("Error getting WebSocket status:", error);
    return NextResponse.json(
      { error: "Failed to get status", details: error.message },
      { status: 500 }
    );
  }
}
