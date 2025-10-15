"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/dashboard/Navigation";
import { usePortfolios } from "@/hooks/usePortfolios";
import type { User } from "@supabase/supabase-js";

interface Investment {
  id: string;
  companyName: string;
  sector: string | null;
  stage: string | null;
  investmentDate: Date | null;
  amountInvested: number;
  currentValue: number | null;
  ownershipPercentage: number | null;
  irr: number | null;
  moic: number | null;
  status: "active" | "exited" | "written_off" | "pending";
  notes: string | null;
  portfolioName: string;
}

export default function InvestmentsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const portfolios = usePortfolios();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        router.push("/auth/signin");
        return;
      }

      // Load real investments data
      await loadInvestments();
    };

    getUser();
  }, [router, supabase.auth]);

  // Load investments when portfolios are available
  useEffect(() => {
    if (portfolios.portfolios.length > 0 && user) {
      loadInvestments();
    }
  }, [portfolios.portfolios, user]);

  const loadInvestments = async () => {
    if (portfolios.portfolios.length === 0) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch investments from all portfolios
      const investmentPromises = portfolios.portfolios.map(
        async (portfolio) => {
          try {
            const response = await fetch(
              `/api/portfolios/${portfolio.id}/investments`
            );
            const result = await response.json();

            if (result.success) {
              return result.data.map((investment: any) => ({
                ...investment,
                portfolioName: portfolio.name,
              }));
            }
            return [];
          } catch (error) {
            console.error(
              `Error fetching investments for portfolio ${portfolio.id}:`,
              error
            );
            return [];
          }
        }
      );

      const investmentResults = await Promise.all(investmentPromises);
      const allInvestments = investmentResults.flat();

      setInvestments(allInvestments);
    } catch (error) {
      console.error("Error loading investments:", error);
      setError("Failed to load investments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number | null) => {
    if (value === null) return "N/A";
    return `${value.toFixed(1)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "exited":
        return "bg-blue-100 text-blue-800";
      case "written_off":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStageColor = (stage: string | null) => {
    if (!stage) return "bg-gray-100 text-gray-800";
    switch (stage.toLowerCase()) {
      case "seed":
        return "bg-purple-100 text-purple-800";
      case "series a":
        return "bg-blue-100 text-blue-800";
      case "series b":
        return "bg-green-100 text-green-800";
      case "series c":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading || portfolios.loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading investments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Investments
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadInvestments} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold font-brand">
                VCIntelligence.ai
              </h1>
              <p className="text-gray-600 mt-2">Investment Management</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.user_metadata?.full_name || user.email}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r bg-gray-50 min-h-screen">
          <div className="p-6">
            <Navigation />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-6 py-12">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Actions */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-medium font-heading">
                  All Investments
                </h2>
                <p className="text-gray-600 mt-1">
                  Track and manage your individual investments across all
                  portfolios
                </p>
              </div>
              <div className="flex gap-4">
                <Button>Add New Investment</Button>
                <Button variant="outline">Import Data</Button>
                <Button variant="outline">Export Report</Button>
              </div>
            </div>

            {/* Investment Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Investments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-mono font-semibold">
                    {investments.length}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Across all portfolios
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Invested
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-mono font-semibold">
                    {formatCurrency(
                      investments.reduce(
                        (sum, inv) => sum + inv.amountInvested,
                        0
                      )
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Capital deployed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Current Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-mono font-semibold">
                    {formatCurrency(
                      investments.reduce(
                        (sum, inv) =>
                          sum + (inv.currentValue || inv.amountInvested),
                        0
                      )
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Portfolio value</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Active Investments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-mono font-semibold">
                    {
                      investments.filter((inv) => inv.status === "active")
                        .length
                    }
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Currently active</p>
                </CardContent>
              </Card>
            </div>

            {/* Investments Table */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">
                  Investment Portfolio
                </CardTitle>
                <CardDescription>
                  Detailed view of all your investments with performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Portfolio</TableHead>
                      <TableHead>Investment Date</TableHead>
                      <TableHead className="text-right">
                        Amount Invested
                      </TableHead>
                      <TableHead className="text-right">
                        Current Value
                      </TableHead>
                      <TableHead className="text-right">Ownership %</TableHead>
                      <TableHead className="text-right">IRR</TableHead>
                      <TableHead className="text-right">MOIC</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investments.map((investment) => (
                      <TableRow key={investment.id}>
                        <TableCell className="font-medium">
                          {investment.companyName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {investment.sector || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStageColor(investment.stage)}>
                            {investment.stage || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {investment.portfolioName}
                        </TableCell>
                        <TableCell className="text-sm">
                          {investment.investmentDate
                            ? investment.investmentDate.toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(investment.amountInvested)}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {investment.currentValue
                            ? formatCurrency(investment.currentValue)
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {investment.ownershipPercentage
                            ? `${investment.ownershipPercentage.toFixed(1)}%`
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-right font-mono text-green-600">
                          {formatPercentage(investment.irr)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-blue-600">
                          {investment.moic
                            ? `${investment.moic.toFixed(1)}x`
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(investment.status)}>
                            {investment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
