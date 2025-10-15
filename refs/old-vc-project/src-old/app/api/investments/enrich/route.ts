import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { DataEnrichmentService } from "@/lib/external-data/data-enrichment";
import { PortfolioService } from "@/lib/database/portfolios";

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

    // Get request body
    const body = await request.json();
    const { investmentIds, portfolioId } = body;

    let investments = [];

    if (portfolioId) {
      // Enrich all investments in a portfolio
      investments = await PortfolioService.getPortfolioInvestments(portfolioId);
    } else if (investmentIds && investmentIds.length > 0) {
      // Enrich specific investments
      // This would require a new method to get investments by IDs
      // For now, we'll get all user investments and filter
      const portfolios = await PortfolioService.getUserPortfolios(user.id);
      const allInvestments = [];

      for (const portfolio of portfolios) {
        const portfolioInvestments =
          await PortfolioService.getPortfolioInvestments(portfolio.id);
        allInvestments.push(...portfolioInvestments);
      }

      investments = allInvestments.filter((inv) =>
        investmentIds.includes(inv.id)
      );
    } else {
      return NextResponse.json(
        { error: "Either portfolioId or investmentIds must be provided" },
        { status: 400 }
      );
    }

    if (investments.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "No investments found to enrich",
      });
    }

    // Enrich the investments with external data
    const enrichedInvestments =
      await DataEnrichmentService.batchEnrichInvestments(investments);

    return NextResponse.json({
      success: true,
      data: enrichedInvestments,
      message: `Successfully enriched ${enrichedInvestments.length} investments`,
    });
  } catch (error) {
    console.error("Error enriching investments:", error);
    return NextResponse.json(
      { error: "Failed to enrich investments" },
      { status: 500 }
    );
  }
}

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

    const { searchParams } = new URL(request.url);
    const sector = searchParams.get("sector");

    if (sector) {
      // Get sector benchmarks
      const benchmarks = await DataEnrichmentService.getSectorBenchmarks(
        sector
      );
      return NextResponse.json({
        success: true,
        data: benchmarks,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        message: "Data enrichment service is available",
        endpoints: {
          enrich: "POST /api/investments/enrich",
          benchmarks: "GET /api/investments/enrich?sector=<sector>",
        },
      },
    });
  } catch (error) {
    console.error("Error getting enrichment info:", error);
    return NextResponse.json(
      { error: "Failed to get enrichment information" },
      { status: 500 }
    );
  }
}
