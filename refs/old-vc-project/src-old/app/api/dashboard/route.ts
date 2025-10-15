import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { PortfolioAnalyticsService } from "@/lib/analytics/portfolio-analytics";
import { DevAuthBypass, getDevUser } from "@/lib/auth/dev-bypass";
import { createClient } from "@supabase/supabase-js";

export interface DashboardData {
  portfolioPerformance: {
    thisQuarter: number;
    vsVCIndustry: number;
    bestPerformer: {
      name: string;
      gain: number;
    };
  };
  portfolioValue: {
    current: number;
    yoyGrowth: number;
    timeline: Array<{
      month: string;
      value: number;
    }>;
  };
  sectorAllocation: Array<{
    sector: string;
    percentage: number;
    value: number;
    color: string;
  }>;
  upcomingCapitalCalls: Array<{
    fundName: string;
    dueDate: string;
    amount: number;
  }>;
  enhancedAnalysisResults?: Array<{
    documentId: string;
    analysisType: string;
    status: string;
    confidenceScore: number;
    processingTime: number;
    createdAt: string;
    financialMetrics?: Record<string, unknown>;
    portfolioAnalysis?: Record<string, unknown>;
  }>;
}

/**
 * Get Enhanced Analysis Results for Dashboard
 */
async function getEnhancedAnalysisResults(userId: string) {
  try {
    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase configuration");
      return [];
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: results, error } = await supabase
      .from("analysis_results")
      .select(
        `
        document_id,
        analysis_type,
        status,
        confidence_scores,
        processing_time_ms,
        created_at,
        detailed_financial_metrics,
        comprehensive_portfolio_analysis
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Failed to fetch enhanced analysis results:", error);
      return [];
    }

    return (results || []).map((result: Record<string, unknown>) => ({
      documentId: String(result.document_id || ""),
      analysisType: String(result.analysis_type || ""),
      status: String(result.status || ""),
      confidenceScore: Number(
        (result.confidence_scores as Record<string, unknown>)?.overall || 0
      ),
      processingTime: Number(result.processing_time_ms || 0),
      createdAt: new Date(result.created_at as string).toISOString(),
      financialMetrics: result.detailed_financial_metrics as
        | Record<string, unknown>
        | undefined,
      portfolioAnalysis: result.comprehensive_portfolio_analysis as
        | Record<string, unknown>
        | undefined,
    }));
  } catch (error) {
    console.error("Failed to fetch enhanced analysis results:", error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    let user: any = null;
    let supabase: any = null;

    // Try development bypass first
    const devUser = getDevUser(request);
    if (devUser) {
      user = DevAuthBypass.createMockSupabaseUser(devUser);
      // Create a mock supabase client for dev mode
      supabase = {
        from: () => ({
          select: () => ({
            eq: () => ({
              eq: () => ({
                not: () => ({
                  data: [],
                  error: null,
                }),
              }),
            }),
          }),
        }),
      };
    } else {
      // Fall back to Supabase authentication
      const cookieStore = await cookies();
      supabase = createServerComponentClient({
        cookies: () => cookieStore,
      });
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();
      user = supabaseUser;
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get portfolio analytics
    const analytics = await PortfolioAnalyticsService.getPortfolioAnalytics(
      user.id
    );
    const sectorAnalysis = await PortfolioAnalyticsService.getSectorAnalysis(
      user.id
    );
    const topInvestments =
      await PortfolioAnalyticsService.getTopPerformingInvestments(user.id, 5);

    // Get enhanced analysis results
    const enhancedAnalysisResults = await getEnhancedAnalysisResults(user.id);

    // Debug logging to see what data we're getting
    console.log("Dashboard API Debug:");
    console.log("Analytics:", JSON.stringify(analytics, null, 2));
    console.log("Sector Analysis:", JSON.stringify(sectorAnalysis, null, 2));
    console.log("Top Investments:", JSON.stringify(topInvestments, null, 2));

    // Calculate portfolio performance metrics
    const portfolioPerformance = calculatePortfolioPerformance(
      analytics,
      topInvestments
    );

    // Calculate portfolio value and timeline
    const portfolioValue = calculatePortfolioValue(analytics);

    // Calculate sector allocation
    const sectorAllocation = calculateSectorAllocation(
      sectorAnalysis,
      analytics.totalValue
    );

    // Get upcoming capital calls from documents
    const upcomingCapitalCalls = await getUpcomingCapitalCalls(
      user.id,
      supabase
    );

    const dashboardData: DashboardData = {
      portfolioPerformance,
      portfolioValue,
      sectorAllocation,
      upcomingCapitalCalls,
      enhancedAnalysisResults,
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

function calculatePortfolioPerformance(
  analytics: any,
  topInvestments: any[]
): DashboardData["portfolioPerformance"] {
  // Calculate quarterly performance (simplified - in real implementation,
  // you'd calculate this from historical data)
  const quarterlyReturn = analytics.avgIRR * 0.25; // Quarterly from annual IRR

  // Calculate vs VC Industry Benchmark (more appropriate for VC portfolios)
  // VC industry average IRR is typically 15-20% annually
  const vcIndustryReturn = 0.18; // 18% annual VC industry average
  const vcIndustryQuarterly = vcIndustryReturn * 0.25;
  const outperformance = quarterlyReturn - vcIndustryQuarterly;

  // Get best performer
  const bestPerformer = topInvestments.length > 0 ? topInvestments[0] : null;

  const result = {
    thisQuarter: Math.round(quarterlyReturn * 100 * 10) / 10, // Round to 1 decimal
    vsVCIndustry: Math.round(outperformance * 100 * 10) / 10,
    bestPerformer: {
      name: bestPerformer?.companyName || "N/A",
      gain: Math.round((bestPerformer?.moic || 0) * 100),
    },
  };

  // Debug logging
  console.log("Portfolio Performance Calculation:");
  console.log("Analytics avgIRR:", analytics.avgIRR);
  console.log("Quarterly Return:", quarterlyReturn);
  console.log("Outperformance:", outperformance);
  console.log("Best Performer:", bestPerformer);
  console.log("Result:", result);

  return result;
}

function calculatePortfolioValue(
  analytics: any
): DashboardData["portfolioValue"] {
  const currentValue = analytics.totalValue || 0;

  // Calculate YoY growth (simplified - in real implementation,
  // you'd calculate from historical data)
  const yoyGrowth = analytics.avgIRR || 0;

  // Generate timeline data (simplified - in real implementation,
  // you'd get this from historical portfolio values)
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const timeline = months.map((month, index) => ({
    month,
    value: currentValue * (1 - (11 - index) * 0.02), // Simulate growth over time
  }));

  return {
    current: currentValue,
    yoyGrowth: Math.round(yoyGrowth * 100 * 10) / 10,
    timeline,
  };
}

function calculateSectorAllocation(
  sectorAnalysis: any[],
  totalValue: number
): DashboardData["sectorAllocation"] {
  const colors = ["#6B7280", "#374151", "#9CA3AF", "#4B5563"];

  return sectorAnalysis.map((sector, index) => ({
    sector: sector.sector,
    percentage: Math.round((sector.totalValue / totalValue) * 100),
    value: sector.totalValue,
    color: colors[index % colors.length],
  }));
}

async function getUpcomingCapitalCalls(
  userId: string,
  supabase: any
): Promise<DashboardData["upcomingCapitalCalls"]> {
  try {
    // Get capital calls from documents
    const { data: documents, error } = await supabase
      .from("documents")
      .select("extracted_data")
      .eq("user_id", userId)
      .eq("status", "completed")
      .not("extracted_data", "is", null);

    if (error || !documents) {
      return [];
    }

    const capitalCalls: DashboardData["upcomingCapitalCalls"] = [];

    documents.forEach((doc: any) => {
      const data = doc.extracted_data;
      if (data?.capitalCalls && Array.isArray(data.capitalCalls)) {
        data.capitalCalls.forEach((call: any) => {
          if (call.dueDate && call.amount) {
            capitalCalls.push({
              fundName: data.companyName || "Unknown Fund",
              dueDate: call.dueDate,
              amount: call.amount,
            });
          }
        });
      }
    });

    // Sort by due date and return upcoming calls
    return capitalCalls
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )
      .slice(0, 5); // Return next 5 capital calls
  } catch (error) {
    console.error("Error fetching capital calls:", error);
    return [];
  }
}
