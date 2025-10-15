import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/drizzle/connection";
import { analysis_results } from "@/lib/drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("documentId");
    const userId =
      request.headers.get("x-dev-user-id") ||
      "550e8400-e29b-41d4-a716-446655440003";

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    // Get analysis results for the document
    const results = await db
      .select()
      .from(analysis_results)
      .where(
        and(
          eq(analysis_results.document_id, documentId),
          eq(analysis_results.user_id, userId)
        )
      )
      .orderBy(desc(analysis_results.created_at))
      .limit(1);

    if (results.length === 0) {
      return NextResponse.json(
        { error: "No analysis results found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: results[0],
    });
  } catch (error) {
    console.error("Error fetching analysis results:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
