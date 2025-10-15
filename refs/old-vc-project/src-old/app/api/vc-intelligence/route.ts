import { NextRequest, NextResponse } from "next/server";
import { HybridVCIntelligenceAgent } from "@/lib/agents/HybridVCIntelligenceAgent";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { DevAuthBypass } from "@/lib/auth/dev-bypass";

/**
 * VC Intelligence API - Main endpoint for AI agent orchestration
 * Inspired by Google ADK's agent communication patterns
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    // Authentication
    let userId: string | null = null;
    const devUserId = request.headers.get("x-dev-user-id");
    if (devUserId && DevAuthBypass.isDevUser(devUserId)) {
      userId = devUserId;
    } else {
      const cookieStore = await cookies();
      const supabase = createServerComponentClient({
        cookies: () => cookieStore,
      });
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userId = user?.id || null;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Initialize Hybrid VC Intelligence Agent
    const vcAgent = new HybridVCIntelligenceAgent();

    let result: any;

    switch (action) {
      case "process_document":
        if (!data.document) {
          return NextResponse.json(
            { error: "Document data is required" },
            { status: 400 }
          );
        }
        result = await vcAgent.processFundDocument(data.document);
        break;

      case "analyze_portfolio":
        if (!data.portfolioId) {
          return NextResponse.json(
            { error: "Portfolio ID is required" },
            { status: 400 }
          );
        }
        result = await vcAgent.analyzePortfolio(data.portfolioId);
        break;

      case "get_market_intelligence":
        if (!data.query) {
          return NextResponse.json(
            { error: "Query is required" },
            { status: 400 }
          );
        }
        result = await vcAgent.getMarketIntelligence(data.query);
        break;

      case "search_similar_documents":
        if (!data.query) {
          return NextResponse.json(
            { error: "Query is required" },
            { status: 400 }
          );
        }
        result = await vcAgent.searchSimilarDocuments(
          data.query,
          data.similarityThreshold || 0.7,
          data.maxResults || 10
        );
        break;

      case "get_document_recommendations":
        if (!data.documentId) {
          return NextResponse.json(
            { error: "Document ID is required" },
            { status: 400 }
          );
        }
        result = await vcAgent.getDocumentRecommendations(
          data.documentId,
          data.maxResults || 5
        );
        break;

      case "health_check":
        result = await vcAgent.healthCheck();
        break;

      default:
        return NextResponse.json(
          {
            error:
              "Invalid action. Supported actions: process_document, analyze_portfolio, get_market_intelligence, search_similar_documents, get_document_recommendations, health_check",
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      action,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("VC Intelligence API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for health check
 */
export async function GET() {
  try {
    const vcAgent = new HybridVCIntelligenceAgent();
    const healthCheck = await vcAgent.healthCheck();

    return NextResponse.json({
      success: true,
      status: "healthy",
      agents: healthCheck,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      {
        error: "Health check failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
