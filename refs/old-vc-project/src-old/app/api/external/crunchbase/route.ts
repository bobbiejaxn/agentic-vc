import { NextRequest, NextResponse } from "next/server";

interface CrunchbaseApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<CrunchbaseApiResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const companyName = searchParams.get("company");
    const endpoint = searchParams.get("endpoint") || "search";

    if (!companyName) {
      return NextResponse.json(
        { success: false, error: "Company name is required" },
        { status: 400 }
      );
    }

    // Get Crunchbase API key from environment
    const crunchbaseApiKey = process.env.CRUNCHBASE_API_KEY;
    if (!crunchbaseApiKey) {
      return NextResponse.json(
        { success: false, error: "Crunchbase API key not configured" },
        { status: 500 }
      );
    }

    let url: string;
    let options: RequestInit = {
      headers: {
        "X-cb-user-key": crunchbaseApiKey,
        "Content-Type": "application/json",
      },
    };

    switch (endpoint) {
      case "search":
        url = `https://api.crunchbase.com/v4/entities/organizations?name=${encodeURIComponent(
          companyName
        )}`;
        break;
      case "company":
        url = `https://api.crunchbase.com/v4/entities/organizations/${companyName}`;
        break;
      case "funding":
        url = `https://api.crunchbase.com/v4/entities/organizations/${companyName}/funding_rounds`;
        break;
      default:
        return NextResponse.json(
          { success: false, error: "Invalid endpoint" },
          { status: 400 }
        );
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Crunchbase API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Crunchbase API proxy error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch Crunchbase data" },
      { status: 500 }
    );
  }
}
