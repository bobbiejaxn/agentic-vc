// ADK Agent Server API - Document Processing Endpoint
// Processes documents through the complete agent pipeline

import { NextRequest, NextResponse } from "next/server";
import { handleDocumentProcessing } from "@/lib/agents/adk-agent-server";
import { getDevUser, DevAuthBypass } from "@/lib/auth/dev-bypass";

export async function POST(request: NextRequest) {
  try {
    // Check for dev user bypass
    const devUser = getDevUser(request);
    if (!devUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Process document through ADK agent pipeline
    const response = await handleDocumentProcessing(request);

    // Add session ID to response headers for client to use
    const sessionId = request.headers.get("x-session-id");
    if (sessionId) {
      response.headers.set("x-session-id", sessionId);
    }

    return response;
  } catch (error) {
    console.error("Agent processing API error:", error);
    return NextResponse.json(
      {
        error: "Agent processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
