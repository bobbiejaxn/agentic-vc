"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FundDetailModal } from "./FundDetailModal";
import { CompanyDetailModal } from "./CompanyDetailModal";
import { DocumentDetailModal } from "./DocumentDetailModal";
import { AppLayout } from "./AppLayout";
import { useAnalytics } from "@/hooks/useAnalytics";
import { usePortfolios } from "@/hooks/usePortfolios";
import { useDocuments } from "@/hooks/useDocuments";
import {
  DevAuthProvider,
  useDevAuthHeaders,
} from "@/components/dev/DevAuthProvider";
import { EnhancedAnalysisButton } from "@/components/analysis/EnhancedAnalysisButton";
import { PortfolioPerformanceChart } from "@/components/charts/PortfolioPerformanceChart";
import {
  TrendingUp,
  Brain,
  CheckCircle,
  AlertCircle,
  Trash2,
  Loader2,
} from "lucide-react";

interface DashboardData {
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
}

/**
 * Main portfolio hub page consolidating portfolio, analytics, and intelligence features
 * Follows Scandinavian minimalism: semantic text-driven, ultra-sparse colors, monospaced financial data
 */
function PortfolioPageContent() {
  const [selectedFundId, setSelectedFundId] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );
  const [investments, setInvestments] = useState<Record<string, unknown>[]>([]);
  const devAuthHeaders = useDevAuthHeaders();
  const [loading, setLoading] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [enhancedAnalysisResults, setEnhancedAnalysisResults] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [showEnhancedResults, setShowEnhancedResults] = useState(false);
  const [deletingFundId, setDeletingFundId] = useState<string | null>(null);

  // Use real data hooks
  const analytics = useAnalytics();
  const portfolios = usePortfolios();
  const documents = useDocuments();
  const [funds, setFunds] = useState<Record<string, unknown>[]>([]);

  // Delete fund function
  const handleDeleteFund = async (fundId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this fund? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeletingFundId(fundId);

      const response = await fetch(`/api/documents/${fundId}`, {
        method: "DELETE",
        headers: devAuthHeaders,
      });

      const result = await response.json();

      if (result.success) {
        // Remove the fund from the local state
        setFunds((prevFunds) => prevFunds.filter((fund) => fund.id !== fundId));
        console.log("Fund deleted successfully");
      } else {
        console.error("Failed to delete fund:", result.error);
        alert("Failed to delete fund. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting fund:", error);
      alert("Failed to delete fund. Please try again.");
    } finally {
      setDeletingFundId(null);
    }
  };

  // Fetch funds data from API
  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const response = await fetch(
          "/api/portfolios/5a8e0cb9-523a-4884-96b9-54b42b7b8447/funds",
          {
            headers: {
              "Content-Type": "application/json",
              ...devAuthHeaders,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFunds(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching funds:", error);
      }
    };

    fetchFunds();
  }, [devAuthHeaders]);

  // Fetch real dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardLoading(true);
        setDashboardError(null);
        const response = await fetch("/api/dashboard", {
          headers: devAuthHeaders,
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            console.log("Dashboard data received:", result.data);
            console.log(
              "Timeline data:",
              result.data?.portfolioValue?.timeline
            );
            setDashboardData(result.data);
          } else {
            setDashboardError("Failed to fetch dashboard data");
          }
        } else {
          if (response.status === 401) {
            setDashboardError("Please log in to view dashboard data");
          } else {
            setDashboardError(`API error: ${response.status}`);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setDashboardError("Network error fetching dashboard data");
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboardData();
  }, [devAuthHeaders]);

  // Set loading timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log("Loading timeout reached, forcing load completion");
      setLoadingTimeout(true);
      setLoading(false);
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, []);

  // Fetch investments data when portfolios are loaded
  useEffect(() => {
    const fetchInvestments = async () => {
      if (portfolios.portfolios.length > 0) {
        try {
          const investmentPromises = portfolios.portfolios.map((portfolio) =>
            fetch(`/api/portfolios/${portfolio.id}/investments`, {
              headers: devAuthHeaders,
            })
              .then((res) => res.json())
              .then((data) => (data.success ? data.data : []))
          );

          const investmentResults = await Promise.all(investmentPromises);
          const allInvestments = investmentResults.flat();
          setInvestments(allInvestments);
        } catch (error) {
          console.error("Error fetching investments:", error);
        }
      }
      setLoading(false);
    };

    fetchInvestments();
  }, [portfolios.portfolios, devAuthHeaders]);

  // Calculate portfolio data from funds data
  const totalPersonalCommitment = funds.reduce(
    (sum, fund) => sum + (fund.personalCommitment || 0),
    0
  );
  const totalPersonalCalled = funds.reduce(
    (sum, fund) => sum + (fund.personalCalled || 0),
    0
  );
  const totalPersonalNav = funds.reduce(
    (sum, fund) => sum + (fund.personalNav || 0),
    0
  );
  const totalPersonalDistributions = funds.reduce(
    (sum, fund) => sum + (fund.personalDistributions || 0),
    0
  );

  // Calculate portfolio metrics
  const totalInvested = totalPersonalCalled;
  const totalValue = totalPersonalNav + totalPersonalDistributions;
  const unrealizedGains = totalPersonalNav - totalPersonalCalled;
  const totalReturn = totalPersonalDistributions + totalPersonalNav;
  const moic = totalInvested > 0 ? totalReturn / totalInvested : 0;

  // Calculate weighted average IRR (simplified)
  const avgIrr =
    funds.length > 0
      ? funds.reduce((sum, fund) => sum + (fund.grossIrr || 0), 0) /
        funds.length
      : 0;

  const portfolioData = {
    totalValue: dashboardData?.portfolioValue.current || totalValue,
    totalInvested: totalInvested,
    unrealizedGains: unrealizedGains,
    irr: avgIrr,
    moic: moic,
  };

  // Funds are now fetched from API with proper personal metrics

  // Extract companies from investments
  const companies = investments.map((investment) => ({
    id: investment.id,
    name: investment.companyName,
    stage: investment.stage || "Unknown",
    invested: investment.amountInvested,
    valuation: investment.currentValue || investment.amountInvested,
    moic: investment.moic || 1.0,
  }));

  // Simplified loading state - only show loading for a short time
  const isLoading = loading && !loadingTimeout;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                Portfolio Overview
              </h1>
              <p className="text-gray-600 mt-2">
                Loading your investment portfolio...
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="scandinavian-card">
                  <CardHeader className="pb-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8 scandinavian-spacing">
        {/* Portfolio Overview - Semantic text-driven with monospaced financial data */}
        <div className="space-y-6 scandinavian-gap">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-foreground tracking-tight">
              Portfolio Overview
            </h1>
            <p className="text-base text-gray-600 dark:text-muted-foreground mt-2">
              Your complete investment portfolio across angel and LP investments
            </p>
          </div>

          {/* Dashboard Error Display */}
          {dashboardError && (
            <div className="bg-red-50 border border-red-200  p-4">
              <h3 className="text-red-800 font-semibold">
                Dashboard Data Error
              </h3>
              <p className="text-red-600 mt-1">{dashboardError}</p>
              <p className="text-red-600 text-sm mt-2">
                The dashboard is showing fallback data. Please log in and upload
                some documents to see real portfolio data.
              </p>
            </div>
          )}

          {/* Key Metrics - Monospaced font for financial data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 scandinavian-gap">
            <Card className="scandinavian-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-normal text-gray-500 uppercase tracking-wide">
                  Total Portfolio Value
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl financial-data font-light text-gray-900 dark:text-foreground">
                  €{portfolioData.totalValue.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="scandinavian-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-normal text-gray-500 uppercase tracking-wide">
                  Total Invested
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl financial-data font-light text-gray-900 dark:text-foreground">
                  €{portfolioData.totalInvested.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="scandinavian-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-normal text-gray-500 uppercase tracking-wide">
                  Unrealized Gains
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl financial-data font-light text-gray-900 dark:text-foreground">
                  €{portfolioData.unrealizedGains.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Performance */}
          <Card className="scandinavian-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-normal text-gray-500 uppercase tracking-wide">
                Portfolio Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl financial-data font-light text-gray-900 dark:text-foreground">
                    {dashboardLoading
                      ? "Loading..."
                      : dashboardData
                        ? `+${dashboardData.portfolioPerformance.thisQuarter}%`
                        : "N/A"}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                    This Quarter
                    <div className="group relative">
                      <svg
                        className="w-3 h-3 text-gray-400 cursor-help"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs  opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-80">
                        <div className="font-semibold mb-1">
                          Quarterly Performance
                        </div>
                        <div className="text-gray-300">
                          Your portfolio&apos;s return for the current quarter,
                          calculated from your portfolio&apos;s Internal Rate of
                          Return (IRR). This shows how your investments are
                          performing in the short term.
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl financial-data font-light text-gray-900 dark:text-foreground">
                    {dashboardLoading
                      ? "Loading..."
                      : dashboardData
                        ? `+${dashboardData.portfolioPerformance.vsVCIndustry}%`
                        : "N/A"}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                    vs. VC Industry
                    <div className="group relative">
                      <svg
                        className="w-3 h-3 text-gray-400 cursor-help"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs  opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-80">
                        <div className="font-semibold mb-1">
                          VC Industry Benchmark
                        </div>
                        <div className="text-gray-300">
                          Compares your portfolio performance against the
                          venture capital industry average (typically 15-20%
                          annual IRR). This provides a more relevant benchmark
                          than public market indices like the S&P 500.
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl financial-data font-light text-gray-900 dark:text-foreground">
                    {dashboardLoading
                      ? "Loading..."
                      : dashboardData
                        ? `+${dashboardData.portfolioPerformance.bestPerformer.gain}%`
                        : "N/A"}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                    {dashboardLoading
                      ? "Loading..."
                      : dashboardData
                        ? dashboardData.portfolioPerformance.bestPerformer.name
                        : "Best Performer"}
                    <div className="group relative">
                      <svg
                        className="w-3 h-3 text-gray-400 cursor-help"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs  opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-80">
                        <div className="font-semibold mb-1">
                          Best Performing Investment
                        </div>
                        <div className="text-gray-300">
                          The company in your portfolio with the highest return
                          (MOIC - Multiple on Invested Capital). This shows your
                          top-performing investment and its percentage gain.
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 scandinavian-gap">
            <Card className="scandinavian-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-normal text-gray-500 uppercase tracking-wide">
                  Internal Rate of Return
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl financial-data font-light text-gray-900 dark:text-foreground">
                  {portfolioData.irr.toFixed(1)}%
                </div>
              </CardContent>
            </Card>

            <Card className="scandinavian-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-normal text-gray-500 uppercase tracking-wide">
                  Multiple on Invested Capital
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl financial-data font-light text-gray-900 dark:text-foreground">
                  {portfolioData.moic.toFixed(2)}x
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Portfolio Performance Chart - Rebuilt */}
        <Card className="scandinavian-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-normal text-gray-500 uppercase tracking-wide">
              Portfolio Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <PortfolioPerformanceChart
                data={dashboardData?.portfolioValue?.timeline || []}
                loading={dashboardLoading}
              />

              {/* Portfolio Value Summary */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Portfolio Value</span>
                <span className="financial-data font-medium text-gray-900 dark:text-foreground">
                  {dashboardLoading
                    ? "Loading..."
                    : dashboardData
                      ? `€${(
                          dashboardData.portfolioValue.current / 1000000
                        ).toFixed(2)}M (+${
                          dashboardData.portfolioValue.yoyGrowth
                        }% YoY)`
                      : `€${(portfolioData.totalValue / 1000000).toFixed(2)}M`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sector Allocation */}
        <Card className="scandinavian-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-normal text-gray-500 uppercase tracking-wide">
              Sector Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Simple pie chart representation */}
              <div className="flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl financial-data font-light text-gray-900 dark:text-foreground">
                      {dashboardLoading
                        ? "Loading..."
                        : dashboardData
                          ? `€${(
                              dashboardData.portfolioValue.current / 1000000
                            ).toFixed(2)}M`
                          : "No data"}
                    </div>
                    <div className="text-xs text-gray-500">Total Value</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {dashboardLoading ? (
                  <div className="col-span-2 text-center text-gray-500">
                    Loading sectors...
                  </div>
                ) : dashboardData &&
                  dashboardData.sectorAllocation.length > 0 ? (
                  dashboardData.sectorAllocation.map((sector, index) => (
                    <div
                      key={sector.sector}
                      className="flex items-center space-x-2"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: sector.color }}
                      ></div>
                      <span className="text-sm text-gray-600">
                        {sector.sector}: {sector.percentage}%
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center text-gray-500">
                    No sector data available
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Capital Calls */}
        <Card className="scandinavian-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-normal text-gray-500 uppercase tracking-wide">
              Upcoming Capital Calls
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {dashboardLoading ? (
                <div className="text-center text-gray-500">
                  Loading capital calls...
                </div>
              ) : dashboardData &&
                dashboardData.upcomingCapitalCalls.length > 0 ? (
                <>
                  {dashboardData.upcomingCapitalCalls.map((call, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {call.fundName}
                        </div>
                        <div className="text-xs text-gray-500">
                          Due {new Date(call.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-lg financial-data font-light text-gray-900 dark:text-foreground">
                        €{call.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium text-gray-900">
                        Total Due
                      </div>
                      <div className="text-xl financial-data font-light text-gray-900 dark:text-foreground">
                        €
                        {dashboardData.upcomingCapitalCalls
                          .reduce((sum, call) => sum + call.amount, 0)
                          .toLocaleString()}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500">
                  No upcoming capital calls
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Analysis Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-foreground">
              Enhanced Analysis
            </h2>
            <p className="text-gray-600 text-sm">
              Comprehensive analysis with external data enrichment and advanced
              metrics
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <EnhancedAnalysisButton
                documentId="744b2141-905c-4626-84c8-0faa904b1d0a"
                userId="550e8400-e29b-41d4-a716-446655440003"
                onAnalysisComplete={(result) => {
                  console.log("Enhanced analysis completed:", result);
                  setEnhancedAnalysisResults(result);
                  setShowEnhancedResults(true);
                }}
                onAnalysisError={(error) => {
                  console.error("Enhanced analysis error:", error);
                  setEnhancedAnalysisResults(null);
                  setShowEnhancedResults(false);
                }}
                className="w-full"
              />
              {enhancedAnalysisResults && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Analysis completed - Results available below</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Analysis Results */}
        {showEnhancedResults && enhancedAnalysisResults && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-foreground">
                Enhanced Analysis Results
              </h2>
              <p className="text-gray-600 text-sm">
                Comprehensive analysis with external data enrichment
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Financial Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Financial Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">IRR:</span>
                      <span className="font-mono text-sm">
                        {enhancedAnalysisResults.financialMetrics?.irr?.toFixed(
                          2
                        ) || "N/A"}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">MOIC:</span>
                      <span className="font-mono text-sm">
                        {enhancedAnalysisResults.financialMetrics?.moic?.toFixed(
                          2
                        ) || "N/A"}
                        x
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">TVPI:</span>
                      <span className="font-mono text-sm">
                        {enhancedAnalysisResults.financialMetrics?.tvpi?.toFixed(
                          2
                        ) || "N/A"}
                        x
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Portfolio Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Portfolio Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Total Companies:
                      </span>
                      <span className="font-mono text-sm">
                        {enhancedAnalysisResults.portfolioAnalysis
                          ?.totalCompanies || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Sectors:</span>
                      <span className="font-mono text-sm">
                        {enhancedAnalysisResults.portfolioAnalysis?.sectors
                          ?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Investment Stages:
                      </span>
                      <span className="font-mono text-sm">
                        {enhancedAnalysisResults.portfolioAnalysis?.stages
                          ?.length || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Confidence Scores */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Confidence Scores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Overall:</span>
                      <span className="font-mono text-sm">
                        {Math.round(
                          (enhancedAnalysisResults.confidence?.overall || 0) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Financial:</span>
                      <span className="font-mono text-sm">
                        {Math.round(
                          (enhancedAnalysisResults.confidence?.financial || 0) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Portfolio:</span>
                      <span className="font-mono text-sm">
                        {Math.round(
                          (enhancedAnalysisResults.confidence?.portfolio || 0) *
                            100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Quality */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Data Quality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Quality Score:
                      </span>
                      <span className="font-mono text-sm">
                        {Math.round(
                          (enhancedAnalysisResults.dataQuality?.overall || 0) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Validation Issues:
                      </span>
                      <span className="font-mono text-sm">
                        {enhancedAnalysisResults.validation?.errors?.length ||
                          0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Warnings:</span>
                      <span className="font-mono text-sm">
                        {enhancedAnalysisResults.validation?.warnings?.length ||
                          0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Close Results Button */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowEnhancedResults(false)}
                className="scandinavian-button"
              >
                Close Results
              </Button>
            </div>
          </div>
        )}

        {/* LP Fund Commitments */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-foreground">
              LP Fund Commitments
            </h2>
            <p className="text-gray-600 text-sm">
              Your limited partner investments across venture capital funds
            </p>
          </div>

          {/* Fund Performance Comparison Chart */}
          <Card className="scandinavian-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-normal text-gray-500 uppercase tracking-wide">
                Fund Performance Comparison
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Simple bar chart representation */}
                <div className="space-y-3">
                  {funds.map((fund, index) => (
                    <div key={fund.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-foreground">
                          {fund.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          Vintage {fund.vintage}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">NAV</div>
                          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gray-400 rounded-full"
                              style={{
                                width: `${(fund.personalNav / 400000) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <div className="text-xs financial-data text-gray-600 mt-1">
                            €{(fund.personalNav || 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">
                            Called
                          </div>
                          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gray-500 rounded-full"
                              style={{
                                width: `${
                                  (fund.personalCalled / 400000) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <div className="text-xs financial-data text-gray-600 mt-1">
                            €{(fund.personalCalled || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {funds.map((fund) => (
              <Card
                key={fund.id}
                className="border-gray-200 hover:border-gray-300 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-medium text-gray-900 dark:text-foreground">
                        {fund.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Vintage {fund.vintage}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm financial-data text-gray-900 dark:text-foreground">
                        NAV: €{(fund.personalNav || 0).toLocaleString()}
                      </div>
                      <div className="text-sm financial-data text-gray-600">
                        Called: €{(fund.personalCalled || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFundId(fund.id)}
                        className="scandinavian-button"
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteFund(fund.id)}
                        disabled={deletingFundId === fund.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        aria-label={`Delete ${fund.name}`}
                      >
                        {deletingFundId === fund.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Angel Investments */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-foreground">
              Angel Investments
            </h2>
            <p className="text-gray-600 text-sm">
              Your direct investments in portfolio companies
            </p>
          </div>

          <div className="space-y-3">
            {companies.map((company) => (
              <Card
                key={company.id}
                className="border-gray-200 hover:border-gray-300 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-medium text-gray-900 dark:text-foreground">
                        {company.name}
                      </h3>
                      <p className="text-sm text-gray-600">{company.stage}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm financial-data text-gray-900 dark:text-foreground">
                        Valuation: €{(company.valuation || 0).toLocaleString()}
                      </div>
                      <div className="text-sm financial-data text-gray-600">
                        MOIC: {company.moic}x
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCompanyId(company.id)}
                      className="ml-4 scandinavian-button"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Detail Modals */}
        {selectedFundId && (
          <FundDetailModal
            fundId={selectedFundId}
            onClose={() => setSelectedFundId(null)}
          />
        )}

        {selectedCompanyId && (
          <CompanyDetailModal
            companyId={selectedCompanyId}
            onClose={() => setSelectedCompanyId(null)}
          />
        )}
      </div>
    </AppLayout>
  );
}

/**
 * Wrapper component that provides development authentication
 */
export function PortfolioPage() {
  return (
    <DevAuthProvider>
      <PortfolioPageContent />
    </DevAuthProvider>
  );
}
