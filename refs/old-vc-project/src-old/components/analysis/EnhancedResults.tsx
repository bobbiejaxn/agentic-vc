"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Building2,
  BarChart3,
  ExternalLink,
  DollarSign,
  Target,
  Brain,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import type { EnhancedAnalysisResult } from "@/lib/types/analysis";
import { ConfidenceDisplay } from "./ConfidenceDisplay";
import { ValidationPanel } from "./ValidationPanel";

interface EnhancedResultsProps {
  result: EnhancedAnalysisResult;
  className?: string;
}

/**
 * Enhanced Results Display Component
 *
 * Displays comprehensive enhanced analysis results with
 * detailed financial metrics, portfolio analysis, and external data.
 */
export function EnhancedResults({
  result,
  className = "",
}: EnhancedResultsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return "text-green-600";
    if (score >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceBadge = (score: number) => {
    if (score >= 0.8) return "bg-green-500";
    if (score >= 0.6) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                Enhanced Analysis Results
              </CardTitle>
              <CardDescription>
                Comprehensive analysis with external data enrichment
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant="secondary"
                className={`${getConfidenceBadge(
                  result.confidence.overall
                )} text-white`}
              >
                {formatPercentage(result.confidence.overall)} Confidence
              </Badge>
              <Badge variant="outline">{result.processingTime}ms</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="external">External Data</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Confidence Scores */}
            <ConfidenceDisplay confidence={result.confidence} />

            {/* Data Quality */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Data Quality</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Completeness</span>
                  <span
                    className={getConfidenceColor(
                      result.tier1Data.dataQuality.completeness
                    )}
                  >
                    {formatPercentage(
                      result.tier1Data.dataQuality.completeness
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy</span>
                  <span
                    className={getConfidenceColor(
                      result.tier1Data.dataQuality.accuracy
                    )}
                  >
                    {formatPercentage(result.tier1Data.dataQuality.accuracy)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Consistency</span>
                  <span
                    className={getConfidenceColor(
                      result.tier1Data.dataQuality.consistency
                    )}
                  >
                    {formatPercentage(result.tier1Data.dataQuality.consistency)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Validation Results */}
          <ValidationPanel
            validation={result.tier1Data.dataQuality.validation}
            errors={result.errors}
          />
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* IRR Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>IRR Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Gross IRR</span>
                  <span className="font-medium">
                    {formatPercentage(
                      result.tier1Data.financialMetrics.irr.gross / 100
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Net IRR</span>
                  <span className="font-medium">
                    {formatPercentage(
                      result.tier1Data.financialMetrics.irr.net / 100
                    )}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {result.tier1Data.financialMetrics.irr.calculation}
                </div>
              </CardContent>
            </Card>

            {/* MOIC Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>MOIC Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Gross MOIC</span>
                  <span className="font-medium">
                    {result.tier1Data.financialMetrics.moic.gross.toFixed(2)}x
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Net MOIC</span>
                  <span className="font-medium">
                    {result.tier1Data.financialMetrics.moic.net.toFixed(2)}x
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Multiple on Invested Capital
                </div>
              </CardContent>
            </Card>

            {/* TVPI Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>TVPI Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Total TVPI</span>
                  <span className="font-medium">
                    {result.tier1Data.financialMetrics.tvpi.total.toFixed(2)}x
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>DPI</span>
                  <span className="font-medium">
                    {result.tier1Data.financialMetrics.tvpi.dpi.toFixed(2)}x
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>RVPI</span>
                  <span className="font-medium">
                    {result.tier1Data.financialMetrics.tvpi.rvpi.toFixed(2)}x
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs">Validated:</span>
                  {result.tier1Data.financialMetrics.tvpi.validation ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <AlertCircle className="h-3 w-3 text-red-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Companies */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>
                    Portfolio Companies (
                    {result.tier1Data.portfolioAnalysis.companies.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {result.tier1Data.portfolioAnalysis.companies.map(
                    (company, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 border rounded"
                      >
                        <div>
                          <div className="font-medium">{company.name}</div>
                          <div className="text-xs text-gray-500">
                            {company.stage} • {company.sector}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {company.multiple.toFixed(2)}x
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatPercentage(company.irr / 100)} IRR
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sectors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>
                    Sector Analysis (
                    {result.tier1Data.portfolioAnalysis.sectors.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {result.tier1Data.portfolioAnalysis.sectors.map(
                    (sector, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 border rounded"
                      >
                        <div>
                          <div className="font-medium">{sector.sector}</div>
                          <div className="text-xs text-gray-500">
                            {sector.count} companies
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {formatPercentage(sector.averageReturn / 100)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Avg Return
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* External Data Tab */}
        <TabsContent value="external" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* External Data Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <ExternalLink className="h-5 w-5" />
                  <span>External Data Enrichment</span>
                </CardTitle>
                <CardDescription>
                  Real-time market data and company intelligence from external
                  sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-foreground">
                      {
                        result.tier1Data.portfolioAnalysis.companies.filter(
                          (c) => c.externalData
                        ).length
                      }
                    </div>
                    <div className="text-xs text-gray-500">
                      Companies Enriched
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {
                        result.tier1Data.portfolioAnalysis.sectors.filter(
                          (s) => s.marketData
                        ).length
                      }
                    </div>
                    <div className="text-xs text-gray-500">
                      Sectors with Market Data
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {result.tier1Data.portfolioAnalysis.companies.reduce(
                        (acc, c) =>
                          acc + (c.externalData?.recentNews?.length || 0),
                        0
                      )}
                    </div>
                    <div className="text-xs text-gray-500">News Articles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {result.confidence.externalData
                        ? formatPercentage(result.confidence.externalData)
                        : "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">
                      External Data Quality
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* External Data Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company External Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Company Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {result.tier1Data.portfolioAnalysis.companies
                      .filter((c) => c.externalData)
                      .map((company, index) => (
                        <div key={index} className="border rounded p-3">
                          <div className="font-medium">{company.name}</div>
                          {company.externalData?.marketCap && (
                            <div className="text-sm text-gray-600">
                              Market Cap:{" "}
                              {formatCurrency(company.externalData.marketCap)}
                            </div>
                          )}
                          {company.externalData?.fundingRounds &&
                            company.externalData.fundingRounds.length > 0 && (
                              <div className="text-sm text-gray-600">
                                Recent Funding:{" "}
                                {formatCurrency(
                                  company.externalData.fundingRounds[0].amount
                                )}
                              </div>
                            )}
                          {company.externalData?.competitors &&
                            company.externalData.competitors.length > 0 && (
                              <div className="text-sm text-gray-600">
                                Competitors:{" "}
                                {company.externalData.competitors
                                  .slice(0, 2)
                                  .join(", ")}
                              </div>
                            )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sector Market Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Market Intelligence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {result.tier1Data.portfolioAnalysis.sectors
                      .filter((s) => s.marketData)
                      .map((sector, index) => (
                        <div key={index} className="border rounded p-3">
                          <div className="font-medium">{sector.sector}</div>
                          {sector.marketData?.marketSize && (
                            <div className="text-sm text-gray-600">
                              Market Size:{" "}
                              {formatCurrency(sector.marketData.marketSize)}
                            </div>
                          )}
                          {sector.marketData?.growthRate && (
                            <div className="text-sm text-gray-600">
                              Growth Rate:{" "}
                              {formatPercentage(
                                sector.marketData.growthRate / 100
                              )}
                            </div>
                          )}
                          {sector.marketData?.marketLeaders &&
                            sector.marketData.marketLeaders.length > 0 && (
                              <div className="text-sm text-gray-600">
                                Leaders:{" "}
                                {sector.marketData.marketLeaders
                                  .slice(0, 2)
                                  .join(", ")}
                              </div>
                            )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
