import { NextRequest, NextResponse } from "next/server";
import { MarketIntelligenceService } from "@/lib/ai/market-intelligence";

export async function POST(request: NextRequest) {
  try {
    const { sector } = await request.json();

    if (!sector || typeof sector !== "string") {
      return NextResponse.json(
        { success: false, error: "Sector is required" },
        { status: 400 }
      );
    }

    const marketIntelligence = new MarketIntelligenceService();
    const result = await marketIntelligence.analyzeMarket(sector);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Market analysis API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
