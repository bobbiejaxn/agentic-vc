import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { PortfolioService } from "@/lib/database/portfolios";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; companyId: string }> }
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

    const { id: portfolioId, companyId } = await params;

    // Get portfolio investments directly from Supabase
    const { data: investments, error } = await supabase
      .from("investments")
      .select("*")
      .eq("portfolio_id", portfolioId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch investments: ${error.message}`);
    }
    const companyInvestment = investments.find((inv) => inv.id === companyId);

    if (!companyInvestment) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Transform investment data to company data format
    const companyData = {
      id: companyInvestment.id,
      name: companyInvestment.companyName,
      stage: companyInvestment.stage || "Unknown",
      sector: companyInvestment.sector || "Unknown",
      founded: companyInvestment.investmentDate
        ? new Date(companyInvestment.investmentDate).getFullYear() - 2 // Estimate founded date
        : new Date().getFullYear() - 5,
      location: "Unknown", // This would need to be added to the database schema
      website: "", // This would need to be added to the database schema
      description: companyInvestment.notes || "No description available",

      // Investment details
      invested: companyInvestment.amountInvested,
      valuation:
        companyInvestment.currentValue || companyInvestment.amountInvested,
      ownership: companyInvestment.ownershipPercentage || 0,
      moic: companyInvestment.moic || 1.0,
      irr: companyInvestment.irr || 0,
      investmentDate:
        companyInvestment.investmentDate?.toISOString().split("T")[0] || "",

      // Financial metrics (estimated from investment data)
      revenue: companyInvestment.currentValue
        ? Math.round(companyInvestment.currentValue * 0.1)
        : 0, // Estimate 10% of valuation as revenue
      revenueGrowth: 0, // Would need to be calculated from historical data
      employees: Math.round(
        (companyInvestment.currentValue || companyInvestment.amountInvested) /
          100000
      ), // Estimate based on valuation
      lastFunding: {
        date:
          companyInvestment.investmentDate?.toISOString().split("T")[0] || "",
        amount: companyInvestment.amountInvested,
        round: companyInvestment.stage || "Unknown",
        lead: "Unknown", // Would need to be added to the database schema
      },

      // Performance metrics
      performance: {
        revenueGrowth: 0, // Would need historical data
        customerGrowth: 0, // Would need historical data
        marketShare: 0, // Would need market data
        competitivePosition: "Unknown", // Would need market analysis
      },

      // Key metrics over time (simulated)
      metrics: [
        {
          date: new Date().toISOString().slice(0, 7),
          revenue: companyInvestment.currentValue
            ? Math.round(companyInvestment.currentValue * 0.1)
            : 0,
          customers: Math.round(
            (companyInvestment.currentValue ||
              companyInvestment.amountInvested) / 1000
          ),
          employees: Math.round(
            (companyInvestment.currentValue ||
              companyInvestment.amountInvested) / 100000
          ),
        },
      ],

      // Recent updates (simulated)
      updates: [
        {
          date:
            companyInvestment.updatedAt?.toISOString().split("T")[0] ||
            new Date().toISOString().split("T")[0],
          type: "Investment",
          title: `${companyInvestment.stage || "Investment"} Round`,
          description: `Investment of $${companyInvestment.amountInvested.toLocaleString()} in ${
            companyInvestment.companyName
          }`,
        },
      ],
    };

    return NextResponse.json({
      success: true,
      data: companyData,
    });
  } catch (error) {
    console.error("Error fetching company data:", error);
    return NextResponse.json(
      { error: "Failed to fetch company data" },
      { status: 500 }
    );
  }
}
