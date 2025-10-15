import { NextRequest, NextResponse } from "next/server";

interface NewsApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<NewsApiResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const sources = searchParams.get("sources");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const language = searchParams.get("language") || "en";
    const pageSize = searchParams.get("pageSize") || "10";

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    // Get News API key from environment
    const newsApiKey = process.env.NEWS_API_KEY;
    if (!newsApiKey) {
      return NextResponse.json(
        { success: false, error: "News API key not configured" },
        { status: 500 }
      );
    }

    const url = new URL("https://newsapi.org/v2/everything");
    url.searchParams.set("q", query);
    url.searchParams.set("apiKey", newsApiKey);
    url.searchParams.set("language", language);
    url.searchParams.set("pageSize", pageSize);

    if (sources) url.searchParams.set("sources", sources);
    if (from) url.searchParams.set("from", from);
    if (to) url.searchParams.set("to", to);

    const response = await fetch(url.toString());

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `News API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("News API proxy error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch news data" },
      { status: 500 }
    );
  }
}
