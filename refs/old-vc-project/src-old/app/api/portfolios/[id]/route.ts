import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { PortfolioService } from "@/lib/database/portfolios";
import { z } from "zod";

const updatePortfolioSchema = z.object({
  name: z.string().min(1, "Portfolio name is required").optional(),
  description: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: portfolioId } = await params;

    // Get portfolio investments directly from Supabase
    const { data: investments, error } = await supabase
      .from("investments")
      .select("*")
      .eq("portfolio_id", portfolioId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch investments: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      data: investments,
    });
  } catch (error) {
    console.error("Error fetching portfolio investments:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio investments" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: portfolioId } = await params;

    // Parse request body
    const body = await request.json();
    const validatedData = updatePortfolioSchema.parse(body);

    // Update portfolio (implementation needed in PortfolioService)
    // const updatedPortfolio = await PortfolioService.updatePortfolio(portfolioId, validatedData);

    return NextResponse.json({
      success: true,
      message: "Portfolio updated successfully",
    });
  } catch (error) {
    console.error("Error updating portfolio:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update portfolio" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: portfolioId } = await params;

    // Delete portfolio (implementation needed in PortfolioService)
    // await PortfolioService.deletePortfolio(portfolioId);

    return NextResponse.json({
      success: true,
      message: "Portfolio deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json(
      { error: "Failed to delete portfolio" },
      { status: 500 }
    );
  }
}
