import { NextRequest, NextResponse } from "next/server";

interface AlphaVantageApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<AlphaVantageApiResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    const functionType = searchParams.get("function") || "GLOBAL_QUOTE";

    if (!symbol) {
      return NextResponse.json(
        { success: false, error: "Symbol is required" },
        { status: 400 }
      );
    }

    // Get Alpha Vantage API key from environment
    const alphaVantageApiKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (!alphaVantageApiKey) {
      return NextResponse.json(
        { success: false, error: "Alpha Vantage API key not configured" },
        { status: 500 }
      );
    }

    const url = `https://www.alphavantage.co/query?function=${functionType}&symbol=${encodeURIComponent(
      symbol
    )}&apikey=${alphaVantageApiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Alpha Vantage API error: ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Alpha Vantage API proxy error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch Alpha Vantage data" },
      { status: 500 }
    );
  }
}
