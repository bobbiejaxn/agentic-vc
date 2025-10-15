"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAnalytics } from "@/hooks/useAnalytics";
import { usePortfolios } from "@/hooks/usePortfolios";
import { useDocuments } from "@/hooks/useDocuments";

export function DataIntegrationTest() {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  // Use the data hooks
  const analytics = useAnalytics();
  const portfolios = usePortfolios();
  const documents = useDocuments();

  const runIntegrationTest = async () => {
    setLoading(true);
    const results: Record<string, any> = {};

    try {
      // Test Analytics API
      try {
        const analyticsResponse = await fetch("/api/analytics?type=summary");
        const analyticsData = await analyticsResponse.json();
        results.analytics = {
          status: analyticsResponse.ok ? "success" : "error",
          data: analyticsData,
        };
      } catch (error) {
        results.analytics = {
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }

      // Test Portfolios API
      try {
        const portfoliosResponse = await fetch("/api/portfolios");
        const portfoliosData = await portfoliosResponse.json();
        results.portfolios = {
          status: portfoliosResponse.ok ? "success" : "error",
          data: portfoliosData,
        };
      } catch (error) {
        results.portfolios = {
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }

      // Test Documents API
      try {
        const documentsResponse = await fetch("/api/documents");
        const documentsData = await documentsResponse.json();
        results.documents = {
          status: documentsResponse.ok ? "success" : "error",
          data: documentsData,
        };
      } catch (error) {
        results.documents = {
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }

      // Test VC Intelligence API
      try {
        const vcResponse = await fetch("/api/vc-intelligence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "health_check" }),
        });
        const vcData = await vcResponse.json();
        results.vcIntelligence = {
          status: vcResponse.ok ? "success" : "error",
          data: vcData,
        };
      } catch (error) {
        results.vcIntelligence = {
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }

      setTestResults(results);
    } catch (error) {
      console.error("Integration test failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Integration Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={runIntegrationTest} disabled={loading}>
            {loading ? "Running Tests..." : "Run Integration Test"}
          </Button>
        </CardContent>
      </Card>

      {/* Hook Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Analytics Hook</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Loading:</span>
                <Badge
                  className={
                    analytics.loading
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }
                >
                  {analytics.loading ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Error:</span>
                <Badge
                  className={
                    analytics.error
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }
                >
                  {analytics.error ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Data:</span>
                <Badge
                  className={
                    analytics.portfolioSummary
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {analytics.portfolioSummary ? "Available" : "None"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Portfolios Hook</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Loading:</span>
                <Badge
                  className={
                    portfolios.loading
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }
                >
                  {portfolios.loading ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Error:</span>
                <Badge
                  className={
                    portfolios.error
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }
                >
                  {portfolios.error ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Count:</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {portfolios.portfolios.length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Documents Hook</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Loading:</span>
                <Badge
                  className={
                    documents.loading
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }
                >
                  {documents.loading ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Error:</span>
                <Badge
                  className={
                    documents.error
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }
                >
                  {documents.error ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Count:</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {documents.documents.length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      {Object.keys(testResults).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>API Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(testResults).map(([key, result]) => (
                <div key={key} className="border  p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium capitalize">{key}</h3>
                    <Badge
                      className={
                        result.status === "success"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {result.status}
                    </Badge>
                  </div>
                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
