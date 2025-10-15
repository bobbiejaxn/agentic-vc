import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { PortfolioService } from "@/lib/database/portfolios";
import { z } from "zod";

const createPortfolioSchema = z.object({
  name: z.string().min(1, "Portfolio name is required"),
  description: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user portfolios
    const portfolios = await PortfolioService.getUserPortfolios(user.id);

    return NextResponse.json({
      success: true,
      data: portfolios,
    });
  } catch (error) {
    console.error("Error fetching portfolios:", error);

    // If it's a database connection error, return empty array instead of 500
    if (
      error instanceof Error &&
      (error.message.includes("relation") ||
        error.message.includes("does not exist") ||
        error.message.includes("authentication failed"))
    ) {
      return NextResponse.json({
        success: true,
        data: [], // Return empty array for missing tables
        message: "Database tables not yet initialized",
      });
    }

    return NextResponse.json(
      { error: "Failed to fetch portfolios" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const validatedData = createPortfolioSchema.parse(body);

    // Create portfolio
    const portfolio = await PortfolioService.createPortfolio(user.id, {
      name: validatedData.name,
      description: validatedData.description || "",
    });

    return NextResponse.json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    console.error("Error creating portfolio:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create portfolio" },
      { status: 500 }
    );
  }
}
