// ADK Agent Server API - Session Management Endpoint
// Manages agent sessions and provides server statistics

import { NextRequest, NextResponse } from "next/server";
import { handleSessionManagement } from "@/lib/agents/adk-agent-server";
import { getDevUser, DevAuthBypass } from "@/lib/auth/dev-bypass";

export async function GET(request: NextRequest) {
  try {
    // Check for dev user bypass
    const devUser = getDevUser(request);
    if (!devUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return await handleSessionManagement(request);
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

export async function DELETE(request: NextRequest) {
  try {
    // Check for dev user bypass
    const devUser = getDevUser(request);
    if (!devUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return await handleSessionManagement(request);
  } catch (error) {
    console.error("Session deletion API error:", error);
    return NextResponse.json(
      {
        error: "Session deletion failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
