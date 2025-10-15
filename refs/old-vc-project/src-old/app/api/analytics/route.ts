import { NextRequest, NextResponse } from "next/server";
import { PortfolioAnalyticsService } from "@/lib/analytics/portfolio-analytics";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "summary";
    const userId =
      request.headers.get("x-dev-user-id") ||
      "550e8400-e29b-41d4-a716-446655440003";

    let data;

    switch (type) {
      case "summary":
        data = await PortfolioAnalyticsService.getPortfolioAnalytics(userId);
        break;
      case "sector-performance":
        data = await PortfolioAnalyticsService.getSectorAnalysis(userId);
        break;
      case "stage-performance":
        data = await PortfolioAnalyticsService.getStageAnalysis(userId);
        break;
      case "top-investments":
        const limit = parseInt(searchParams.get("limit") || "10");
        data = await PortfolioAnalyticsService.getTopPerformingInvestments(
          userId,
          limit
        );
        break;
      case "document-stats":
        data = await PortfolioAnalyticsService.getDocumentProcessingStats(
          userId
        );
        break;
      default:
        return NextResponse.json(
          { error: "Invalid analytics type" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data,
      type,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
