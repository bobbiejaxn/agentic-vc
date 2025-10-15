import { NextRequest, NextResponse } from "next/server";
import { MarketIntelligenceService } from "@/lib/ai/market-intelligence";

export async function POST(request: NextRequest) {
  try {
    const { companies, topics } = await request.json();

    if (
      (!companies || !Array.isArray(companies) || companies.length === 0) &&
      (!topics || !Array.isArray(topics) || topics.length === 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Either companies or topics must be provided",
        },
        { status: 400 }
      );
    }

    const marketIntelligence = new MarketIntelligenceService();
    const result = await marketIntelligence.getRecentNews(
      companies || [],
      topics || []
    );

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("News monitoring API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
