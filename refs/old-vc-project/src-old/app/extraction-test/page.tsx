"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TestResult {
  testCaseId: string;
  testCaseName: string;
  executionTime: number;
  extractedData: Record<string, unknown>;
  validationReport: any;
  accuracyScore: number;
  passed: boolean;
  errors: string[];
  warnings: string[];
  fieldAccuracy: Record<string, any>;
  performanceMetrics: any;
}

interface TestCategory {
  name: string;
  fields: string[];
  matched: number;
  total: number;
  accuracy: number;
}

export default function ExtractionTestPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const runComprehensiveTest = async () => {
    setIsRunning(true);
    setError(null);
    setProgress(0);

    try {
      setProgress(10);
      const response = await fetch("/api/extraction-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testType: "comprehensive",
        }),
      });

      setProgress(50);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProgress(90);
      setResults(data.result);
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsRunning(false);
    }
  };

  const categories: TestCategory[] = results
    ? [
        {
          name: "Fund Performance",
          fields: [
            "fundNAV",
            "cumulativeDistributions",
            "fundSize",
            "managementFeeRate",
            "carriedInterestRate",
            "hurdleRate",
            "fundCurrency",
            "reportingPeriod",
            "fundAge",
            "deploymentRate",
            "portfolioCompanyCount",
            "irr",
            "moic",
            "tvpi",
            "dpi",
            "rvpi",
          ],
          matched: Object.values(results.fieldAccuracy).filter(
            (f) =>
              f.match &&
              [
                "fundNAV",
                "cumulativeDistributions",
                "fundSize",
                "managementFeeRate",
                "carriedInterestRate",
                "hurdleRate",
                "fundCurrency",
                "reportingPeriod",
                "fundAge",
                "deploymentRate",
                "portfolioCompanyCount",
                "irr",
                "moic",
                "tvpi",
                "dpi",
                "rvpi",
              ].includes(f.fieldName)
          ).length,
          total: 16,
          accuracy: 0,
        },
        {
          name: "Personal Portfolio",
          fields: [
            "personalCommitment",
            "personalCalledCapital",
            "personalNAV",
            "personalDistributions",
            "personalOwnershipPercentage",
            "personalMOIC",
            "personalIRR",
            "personalUnfunded",
            "taxTreatment",
            "investmentVehicle",
            "investmentDate",
            "initialInvestment",
            "followOnInvestments",
            "currentQuarterPerformance",
            "ytdPerformance",
            "sinceInceptionPerformance",
            "benchmarkComparison",
            "liquidityTimeline",
            "exitPipelineValue",
            "portfolioConcentration",
          ],
          matched: Object.values(results.fieldAccuracy).filter(
            (f) =>
              f.match &&
              [
                "personalCommitment",
                "personalCalledCapital",
                "personalNAV",
                "personalDistributions",
                "personalOwnershipPercentage",
                "personalMOIC",
                "personalIRR",
                "personalUnfunded",
                "taxTreatment",
                "investmentVehicle",
                "investmentDate",
                "initialInvestment",
                "followOnInvestments",
                "currentQuarterPerformance",
                "ytdPerformance",
                "sinceInceptionPerformance",
                "benchmarkComparison",
                "liquidityTimeline",
                "exitPipelineValue",
                "portfolioConcentration",
              ].includes(f.fieldName)
          ).length,
          total: 20,
          accuracy: 0,
        },
        {
          name: "Portfolio Company",
          fields: [
            "industrySector",
            "investmentStage",
            "geography",
            "foundingYear",
            "lastRoundValuation",
            "lastRoundDate",
            "revenueGrowth",
            "ebitda",
            "cashPosition",
            "burnRate",
            "runway",
            "employeeCount",
            "keyInvestors",
            "boardRepresentation",
            "valuationMethod",
            "marketSize",
            "businessModel",
          ],
          matched: Object.values(results.fieldAccuracy).filter(
            (f) =>
              f.match &&
              [
                "industrySector",
                "investmentStage",
                "geography",
                "foundingYear",
                "lastRoundValuation",
                "lastRoundDate",
                "revenueGrowth",
                "ebitda",
                "cashPosition",
                "burnRate",
                "runway",
                "employeeCount",
                "keyInvestors",
                "boardRepresentation",
                "valuationMethod",
                "marketSize",
                "businessModel",
              ].includes(f.fieldName)
          ).length,
          total: 17,
          accuracy: 0,
        },
      ]
    : [];

  // Calculate accuracy for each category
  categories.forEach((cat) => {
    cat.accuracy = cat.total > 0 ? (cat.matched / cat.total) * 100 : 0;
  });

  const totalFields = categories.reduce((sum, cat) => sum + cat.total, 0);
  const totalMatched = categories.reduce((sum, cat) => sum + cat.matched, 0);
  const overallAccuracy =
    totalFields > 0 ? (totalMatched / totalFields) * 100 : 0;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Comprehensive Extraction Test
        </h1>
        <p className="text-gray-600">
          Test our extraction system against all 80 Tier 1 strategic fields to
          measure accuracy and identify enhancement opportunities.
        </p>
      </div>

      <div className="mb-6">
        <Button
          onClick={runComprehensiveTest}
          disabled={isRunning}
          className="w-full py-3 text-lg"
        >
          {isRunning ? "Running Test..." : "Run Comprehensive Test"}
        </Button>

        {isRunning && (
          <div className="mt-4">
            <Progress value={progress} className="w-full" />
            <p className="text-center mt-2 text-sm text-gray-600">
              Processing extraction test... {progress}%
            </p>
          </div>
        )}
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Test Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {results && (
        <div className="space-y-6">
          {/* Overall Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Test Results</span>
                <Badge variant={results.passed ? "default" : "destructive"}>
                  {results.passed ? "PASSED" : "FAILED"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Accuracy Score</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {results.accuracyScore.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quality Score</p>
                  <p className="text-2xl font-bold text-green-600">
                    {results.validationReport.overallQualityScore.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Execution Time</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {results.executionTime}ms
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Compliance</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {results.validationReport.europeanComplianceScore.toFixed(
                      1
                    )}
                    %
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Field Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div key={category.name} className="border  p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{category.name}</h3>
                      <Badge
                        variant={
                          category.accuracy >= 95
                            ? "default"
                            : category.accuracy >= 85
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {category.accuracy.toFixed(1)}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {category.matched}/{category.total} fields
                    </p>
                    <Progress value={category.accuracy} className="mt-2" />
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Overall Accuracy</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {overallAccuracy.toFixed(2)}%
                  </span>
                </div>
                <Progress value={overallAccuracy} className="mt-2" />
                <p className="text-sm text-gray-600 mt-2">
                  {totalMatched}/{totalFields} total fields matched
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overallAccuracy >= 95 && (
                  <div className="p-4 bg-green-50 border border-green-200 ">
                    <h3 className="font-semibold text-green-800 mb-2">
                      🎉 EXCELLENT!
                    </h3>
                    <p className="text-green-700">
                      Your extraction system achieves the 95%+ accuracy target
                      for all strategic fields!
                    </p>
                    <p className="text-green-700 mt-2">
                      ✅ Ready to proceed with European compliance integration
                      and data aggregation framework.
                    </p>
                  </div>
                )}

                {overallAccuracy >= 85 && overallAccuracy < 95 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 ">
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      👍 GOOD!
                    </h3>
                    <p className="text-yellow-700">
                      System is close to 95% target - minor enhancements needed
                      for production readiness.
                    </p>
                  </div>
                )}

                {overallAccuracy < 85 && (
                  <div className="p-4 bg-red-50 border border-red-200 ">
                    <h3 className="font-semibold text-red-800 mb-2">
                      ⚠️ ENHANCEMENT NEEDED
                    </h3>
                    <p className="text-red-700">
                      System is below 85% accuracy and requires significant
                      improvement.
                    </p>
                  </div>
                )}

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 ">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    📊 Performance Insights
                  </h3>
                  <ul className="text-blue-700 space-y-1">
                    <li>
                      • Average Confidence:{" "}
                      {(
                        results.validationReport.averageConfidence * 100
                      ).toFixed(1)}
                      %
                    </li>
                    <li>
                      • Valid Fields: {results.validationReport.validFields}/
                      {results.validationReport.totalFields}
                    </li>
                    <li>
                      • Invalid Fields: {results.validationReport.invalidFields}
                      /{results.validationReport.totalFields}
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.errors.length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded">
                    <h4 className="font-semibold text-red-800 mb-1">
                      Critical Issues:
                    </h4>
                    <ul className="text-red-700 text-sm">
                      {results.errors.slice(0, 3).map((error, i) => (
                        <li key={i}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.warnings.length > 0 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <h4 className="font-semibold text-yellow-800 mb-1">
                      Warnings:
                    </h4>
                    <ul className="text-yellow-700 text-sm">
                      {results.warnings.slice(0, 3).map((warning, i) => (
                        <li key={i}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {overallAccuracy >= 95 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded">
                    <h4 className="font-semibold text-green-800 mb-1">
                      Next Steps:
                    </h4>
                    <ul className="text-green-700 text-sm">
                      <li>• Proceed with European compliance integration</li>
                      <li>• Implement data aggregation framework</li>
                      <li>• Performance optimization and scaling</li>
                    </ul>
                  </div>
                )}

                {overallAccuracy < 95 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <h4 className="font-semibold text-blue-800 mb-1">
                      Enhancement Priority:
                    </h4>
                    <ul className="text-blue-700 text-sm">
                      <li>• Enhance LLM prompts for strategic fields</li>
                      <li>• Improve field-specific extraction logic</li>
                      <li>• Add fallback extraction methods</li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
