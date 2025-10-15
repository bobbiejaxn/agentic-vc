"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import { DataValidationAlert } from "./DataValidationAlert";
import { useDevAuth } from "@/hooks/useDevAuth";
import { DocumentDetailModal } from "./DocumentDetailModal";

interface FundDetailModalProps {
  fundId: string;
  onClose: () => void;
}

interface DocumentData {
  id: string;
  type: string;
  status: string;
  portfolioId?: string;
  [key: string]: unknown;
}

interface CapitalCall {
  amount: number;
  description: string;
  date: string;
}

interface Distribution {
  amount: number;
  description: string;
  date: string;
}

interface PortfolioCompany {
  id?: string;
  name: string;
  stage: string;
  valuation?: number;
  moic?: string;
  irr?: string;
}

interface FundData {
  id: string;
  name: string;
  vintage?: number;
  fundSize?: number;
  fundNav?: number;
  fundCalled?: number;
  fundDistributions?: number;
  personalCommitment?: number;
  personalNav?: number;
  personalCalled?: number;
  personalDistributions?: number;
  ownershipPercentage?: number;
  capitalCalls?: CapitalCall[];
  distributions?: Distribution[];
  portfolioCompanies?: PortfolioCompany[];
  [key: string]: unknown;
}

// Reusable MetricCard component
interface MetricCardProps {
  title: string;
  value: string;
  className?: string;
}

function MetricCard({ title, value, className = "" }: MetricCardProps) {
  return (
    <Card className={`scandinavian-card ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wide">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm financial-data font-light text-foreground">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Modal for displaying detailed fund information
 * Follows Scandinavian minimalism: semantic text-driven, ultra-sparse colors, monospaced financial data
 */
export function FundDetailModal({ fundId, onClose }: FundDetailModalProps) {
  const [fundData, setFundData] = useState<FundData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFundReport, setIsFundReport] = useState<boolean | null>(null);
  const { devUser } = useDevAuth();

  useEffect(() => {
    const fetchFundData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Prepare dev auth headers
        const devAuthHeaders: Record<string, string> = devUser
          ? {
              "x-dev-user-id": devUser.id,
            }
          : {};

        // Find the portfolio ID from the fund ID (assuming fund ID is document ID)
        const response = await fetch(`/api/documents`, {
          headers: devAuthHeaders,
        });
        const documentsResult = await response.json();

        console.log("🔍 Documents API response:", documentsResult);
        console.log("🔍 Looking for fundId:", fundId);
        console.log(
          "🔍 Available documents:",
          documentsResult.data?.map((doc: DocumentData) => ({
            id: doc.id,
            type: doc.type,
            status: doc.status,
          }))
        );

        if (documentsResult.success) {
          const document = documentsResult.data.find(
            (doc: DocumentData) => doc.id === fundId
          );

          console.log("🔍 Found document:", document);

          if (document) {
            if (document.type === "fund_report") {
              setIsFundReport(true);
              // Get portfolio ID from the document
              const portfolioId = document.portfolioId;

              // Fetch fund data
              const fundResponse = await fetch(
                `/api/portfolios/${portfolioId}/funds/${fundId}`,
                {
                  headers: devAuthHeaders,
                }
              );
              const fundResult = await fundResponse.json();

              if (fundResult.success) {
                setFundData(fundResult.data);
              } else {
                setError("Failed to load fund data");
              }
            } else {
              // Not a fund report, use generic document modal
              setIsFundReport(false);
            }
          } else {
            setError("Document not found");
          }
        } else {
          console.error("❌ Documents API failed:", documentsResult);
          setError(
            `Failed to load documents: ${
              documentsResult.error || "Unknown error"
            }`
          );
        }
      } catch (error) {
        console.error("Error fetching fund data:", error);
        setError("Failed to load fund data");
      } finally {
        setLoading(false);
      }
    };

    fetchFundData();
  }, [fundId, devUser]);

  // Memoized calculations for performance
  const totalCapitalCalled = useMemo(() => {
    return (
      fundData?.capitalCalls?.reduce(
        (sum: number, call: CapitalCall) => sum + (call.amount || 0),
        0
      ) || 0
    );
  }, [fundData?.capitalCalls]);

  const totalDistributed = useMemo(() => {
    return (
      fundData?.distributions?.reduce(
        (sum: number, dist: Distribution) => sum + (dist.amount || 0),
        0
      ) || 0
    );
  }, [fundData?.distributions]);

  // If it's not a fund report, use the generic document modal
  if (isFundReport === false) {
    return <DocumentDetailModal documentId={fundId} onClose={onClose} />;
  }

  if (loading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loading Fund Details...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !fundData) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Error Loading Fund</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">
              {error || "Fund data not available"}
            </p>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-foreground tracking-tight">
            {fundData.name}
          </DialogTitle>
          <p className="text-base font-normal text-muted-foreground">
            Vintage {fundData.vintage} •{" "}
            {(fundData.fundSize || 0).toLocaleString()} Fund Size
          </p>
        </DialogHeader>

        <div className="space-y-6 scandinavian-spacing">
          {/* Fund-Level Performance Overview */}
          <div className="space-y-4 scandinavian-gap">
            <h3 className="text-lg font-semibold text-foreground tracking-tight">
              Fund-Level Performance
            </h3>

            {/* Fund-Level Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 scandinavian-gap">
              <MetricCard
                title="Fund Size"
                value={`€${(fundData.fundSize || 0).toLocaleString()}`}
              />
              <MetricCard
                title="Fund NAV"
                value={`€${(fundData.fundNav || 0).toLocaleString()}`}
              />
              <MetricCard
                title="Total Called"
                value={`€${(fundData.fundCalled || 0).toLocaleString()}`}
              />
              <MetricCard
                title="Total Distributed"
                value={`€${(fundData.fundDistributions || 0).toLocaleString()}`}
              />
            </div>
          </div>

          {/* Personal Investor Performance Overview */}
          <div className="space-y-4 scandinavian-gap">
            <h3 className="text-lg font-semibold text-foreground tracking-tight">
              Your Investment Performance
            </h3>

            {/* Personal Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 scandinavian-gap">
              <MetricCard
                title="Your Commitment"
                value={`€${(
                  fundData.personalCommitment || 0
                ).toLocaleString()}`}
              />
              <MetricCard
                title="Your NAV"
                value={`€${(fundData.personalNav || 0).toLocaleString()}`}
              />
              <MetricCard
                title="Capital Called"
                value={`€${(fundData.personalCalled || 0).toLocaleString()}`}
              />
              <MetricCard
                title="Distributions"
                value={`€${(
                  fundData.personalDistributions || 0
                ).toLocaleString()}`}
              />
            </div>
          </div>

          {/* Data Validation Alert - Always show for editing capabilities */}
          <DataValidationAlert
            validation={{
              isValid: (fundData.validation as any)?.isValid ?? true,
              errors: (fundData.validation as any)?.errors ?? [],
              warnings: (fundData.validation as any)?.warnings ?? [],
              suggestions: (fundData.validation as any)?.suggestions ?? [],
            }}
            fundId={fundId}
            portfolioId="5a8e0cb9-523a-4884-96b9-54b42b7b8447"
            userId={devUser?.id || "7b9ffd5c-9719-414e-bc05-75a13736bf1c"}
            onDataFix={(field, value) => {
              // Handle manual data fixes - refresh the fund data
              console.log(`Manual override for ${field}: ${value}`);
              // Refresh the fund data to show updated values
              window.location.reload();
            }}
          />

          {/* Performance Metrics Comparison */}
          <div className="space-y-4 scandinavian-gap">
            <h3 className="text-lg font-semibold text-foreground tracking-tight">
              Performance Metrics Comparison
            </h3>

            {/* Performance Metrics Chart - Fund vs Personal Comparison */}
            <Card className="scandinavian-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wide">
                  Fund vs Personal Performance Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-6">
                  {/* IRR Comparison */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-normal text-muted-foreground">
                        IRR
                      </span>
                      <div className="flex space-x-4">
                        <span className="text-xs text-muted-foreground">
                          Fund:{" "}
                          {Number(fundData.grossIrr) ||
                            Number(fundData.irr) ||
                            0}
                          %
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Personal: {Number(fundData.personalIrr) || 0}%
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              ((Number(fundData.grossIrr) ||
                                Number(fundData.irr) ||
                                0) /
                                30) *
                                100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-secondary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              ((Number(fundData.personalIrr) || 0) / 30) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* MOIC Comparison */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-normal text-muted-foreground">
                        MOIC
                      </span>
                      <div className="flex space-x-4">
                        <span className="text-xs text-muted-foreground">
                          Fund:{" "}
                          {Number(fundData.grossMoic) ||
                            Number(fundData.moic) ||
                            0}
                          x
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Personal: {Number(fundData.personalMoic) || 0}x
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              ((Number(fundData.grossMoic) ||
                                Number(fundData.moic) ||
                                0) /
                                3) *
                                100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-secondary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              ((Number(fundData.personalMoic) || 0) / 3) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* TVPI Comparison */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-normal text-muted-foreground">
                        TVPI
                      </span>
                      <div className="flex space-x-4">
                        <span className="text-xs text-muted-foreground">
                          Fund: {Number(fundData.tvpi) || 0}x
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Personal: {Number(fundData.personalMoic) || 0}x
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              ((Number(fundData.tvpi) || 0) / 3) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-secondary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              ((Number(fundData.personalMoic) || 0) / 3) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* DPI Comparison */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-normal text-muted-foreground">
                        DPI
                      </span>
                      <div className="flex space-x-4">
                        <span className="text-xs text-muted-foreground">
                          Fund: {Number(fundData.dpi) || 0}x
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Personal:{" "}
                          {(fundData.personalDistributions || 0) > 0
                            ? (
                                (fundData.personalDistributions || 0) /
                                (fundData.personalCalled || 1)
                              ).toFixed(2)
                            : 0}
                          x
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              ((Number(fundData.dpi) || 0) / 3) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-secondary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              (((fundData.personalDistributions || 0) > 0
                                ? (fundData.personalDistributions || 0) /
                                  (fundData.personalCalled || 1)
                                : 0) /
                                3) *
                                100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Personal Investment Details */}
          <div className="space-y-4 scandinavian-gap">
            <h3 className="text-lg font-semibold text-foreground tracking-tight">
              Your Investment
            </h3>

            {/* Capital Flow Timeline Chart */}
            <Card className="scandinavian-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wide">
                  Capital Flow Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Capital Flow Summary Table */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-foreground">
                      Capital Flow Summary
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 text-muted-foreground font-normal">
                              Metric
                            </th>
                            <th className="text-right py-2 text-muted-foreground font-normal">
                              Fund Total
                            </th>
                            <th className="text-right py-2 text-muted-foreground font-normal">
                              Your Share
                            </th>
                            <th className="text-right py-2 text-muted-foreground font-normal">
                              Ownership
                            </th>
                          </tr>
                        </thead>
                        <tbody className="space-y-1">
                          <tr className="border-b border-border/50">
                            <td className="py-2 text-foreground">
                              Total Called
                            </td>
                            <td className="text-right py-2 financial-data font-light text-foreground">
                              €{(fundData.fundCalled || 0).toLocaleString()}
                            </td>
                            <td className="text-right py-2 financial-data font-light text-foreground">
                              €{(fundData.personalCalled || 0).toLocaleString()}
                            </td>
                            <td className="text-right py-2 text-muted-foreground">
                              {(fundData.ownershipPercentage || 1).toFixed(1)}%
                            </td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="py-2 text-foreground">
                              Total Distributed
                            </td>
                            <td className="text-right py-2 financial-data font-light text-foreground">
                              €
                              {(
                                fundData.fundDistributions || 0
                              ).toLocaleString()}
                            </td>
                            <td className="text-right py-2 financial-data font-light text-foreground">
                              €
                              {(
                                fundData.personalDistributions || 0
                              ).toLocaleString()}
                            </td>
                            <td className="text-right py-2 text-muted-foreground">
                              {(fundData.ownershipPercentage || 1).toFixed(1)}%
                            </td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="py-2 text-foreground">
                              Current NAV
                            </td>
                            <td className="text-right py-2 financial-data font-light text-foreground">
                              €{(fundData.fundNav || 0).toLocaleString()}
                            </td>
                            <td className="text-right py-2 financial-data font-light text-foreground">
                              €{(fundData.personalNav || 0).toLocaleString()}
                            </td>
                            <td className="text-right py-2 text-muted-foreground">
                              {(fundData.ownershipPercentage || 1).toFixed(1)}%
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 text-foreground">
                              Unfunded Commitment
                            </td>
                            <td className="text-right py-2 financial-data font-light text-foreground">
                              €
                              {(
                                (fundData.fundSize || 0) -
                                (fundData.fundCalled || 0)
                              ).toLocaleString()}
                            </td>
                            <td className="text-right py-2 financial-data font-light text-foreground">
                              €
                              {(
                                (fundData.personalCommitment || 0) -
                                (fundData.personalCalled || 0)
                              ).toLocaleString()}
                            </td>
                            <td className="text-right py-2 text-muted-foreground">
                              {(fundData.ownershipPercentage || 1).toFixed(1)}%
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Capital Calls Timeline */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-foreground">
                      Capital Calls Timeline
                    </h4>
                    {fundData.capitalCalls &&
                    fundData.capitalCalls.length > 0 ? (
                      <div className="space-y-2">
                        {fundData.capitalCalls.map(
                          (call: CapitalCall, index: number) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3"
                            >
                              <div className="w-3 h-3 bg-primary rounded-full"></div>
                              <div className="flex-1">
                                <div className="text-sm font-normal text-foreground">
                                  {call.description}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {call.date}
                                </div>
                              </div>
                              <div className="text-sm financial-data font-light text-foreground">
                                €{(call.amount || 0).toLocaleString()}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic">
                        No individual capital call details available. Total
                        called: €
                        {(fundData.personalCalled || 0).toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Distributions Timeline */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-foreground">
                      Distributions Timeline
                    </h4>
                    {fundData.distributions &&
                    fundData.distributions.length > 0 ? (
                      <div className="space-y-2">
                        {fundData.distributions.map(
                          (distribution: Distribution, index: number) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3"
                            >
                              <div className="w-3 h-3 bg-secondary rounded-full"></div>
                              <div className="flex-1">
                                <div className="text-sm font-normal text-foreground">
                                  {distribution.description}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {distribution.date}
                                </div>
                              </div>
                              <div className="text-sm financial-data font-light text-green-600">
                                €{(distribution.amount || 0).toLocaleString()}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic">
                        No distributions to date. Total distributed: €
                        {(fundData.personalDistributions || 0).toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-normal text-muted-foreground">
                        Total Called
                      </span>
                      <span className="text-sm financial-data font-light text-foreground">
                        €{(totalCapitalCalled || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm font-normal text-muted-foreground">
                        Total Distributed
                      </span>
                      <span className="text-sm financial-data font-light text-green-600">
                        €{(totalDistributed || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 scandinavian-gap">
              <MetricCard
                title="Your NAV"
                value={`€${(fundData.personalNav || 0).toLocaleString()}`}
              />
              <MetricCard
                title="Capital Called"
                value={`€${(fundData.personalCalled || 0).toLocaleString()}`}
              />
              <MetricCard
                title="Distributions"
                value={`€${(
                  fundData.personalDistributions || 0
                ).toLocaleString()}`}
              />
            </div>
          </div>

          {/* Portfolio Companies */}
          <div className="space-y-4 scandinavian-gap">
            <h3 className="text-lg font-semibold text-foreground tracking-tight">
              Portfolio Companies
            </h3>

            <div className="space-y-3 scandinavian-gap">
              {(fundData.portfolioCompanies || []).map(
                (company: PortfolioCompany, index: number) => (
                  <Card
                    key={company.id || company.name || `company-${index}`}
                    className="scandinavian-card hover:shadow-sm transition-shadow"
                  >
                    <CardContent className="p-4 scandinavian-padding">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="font-normal text-foreground">
                            {company.name}
                          </h4>
                          <p className="text-sm font-normal text-muted-foreground">
                            {company.stage}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="text-sm financial-data font-light text-foreground">
                            Valuation: €
                            {company.valuation
                              ? company.valuation.toLocaleString()
                              : "N/A"}
                          </div>
                          <div className="text-sm financial-data font-light text-muted-foreground">
                            MOIC: {company.moic || "N/A"}x • IRR:{" "}
                            {company.irr || "N/A"}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border scandinavian-padding">
          <Button
            onClick={onClose}
            variant="outline"
            className="scandinavian-button"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
