import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { PortfolioService } from "@/lib/database/portfolios";

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

    // Get all user portfolios
    const portfolios = await PortfolioService.getUserPortfolios(user.id);

    if (portfolios.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // Fetch investments from all portfolios
    const investmentPromises = portfolios.map(async (portfolio) => {
      try {
        const investments = await PortfolioService.getPortfolioInvestments(
          portfolio.id
        );
        return investments.map((investment) => ({
          ...investment,
          portfolioName: portfolio.name,
          portfolioId: portfolio.id,
        }));
      } catch (error) {
        console.error(
          `Error fetching investments for portfolio ${portfolio.id}:`,
          error
        );
        return [];
      }
    });

    const investmentResults = await Promise.all(investmentPromises);
    const allInvestments = investmentResults.flat();

    return NextResponse.json({
      success: true,
      data: allInvestments,
    });
  } catch (error) {
    console.error("Error fetching investments:", error);
    return NextResponse.json(
      { error: "Failed to fetch investments" },
      { status: 500 }
    );
  }
}
