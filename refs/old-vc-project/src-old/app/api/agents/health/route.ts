// ADK Agent Server API - Health Check Endpoint
// Provides health status of the agent server and its components

import { NextResponse } from "next/server";
import { handleHealthCheck } from "@/lib/agents/adk-agent-server";

export async function GET() {
  try {
    return await handleHealthCheck();
  } catch (error) {
    console.error("Health check API error:", error);
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
