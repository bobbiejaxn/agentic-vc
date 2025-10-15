import { NextRequest, NextResponse } from "next/server";
import { MarketIntelligenceService } from "@/lib/ai/market-intelligence";

export async function POST(request: NextRequest) {
  try {
    const { companyName } = await request.json();

    if (!companyName || typeof companyName !== "string") {
      return NextResponse.json(
        { success: false, error: "Company name is required" },
        { status: 400 }
      );
    }

    const marketIntelligence = new MarketIntelligenceService();
    const result = await marketIntelligence.researchCompany(companyName);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Company research API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
