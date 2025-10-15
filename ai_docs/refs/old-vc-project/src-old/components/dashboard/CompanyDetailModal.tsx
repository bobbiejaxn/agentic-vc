"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDevAuth } from "@/hooks/useDevAuth";

interface CompanyDetailModalProps {
  companyId: string;
  onClose: () => void;
}

/**
 * Modal for displaying detailed portfolio company information
 * Follows Scandinavian minimalism: semantic text-driven, ultra-sparse colors, monospaced financial data
 */
export function CompanyDetailModal({
  companyId,
  onClose,
}: CompanyDetailModalProps) {
  const [companyData, setCompanyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { devUser } = useDevAuth();

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Prepare dev auth headers
        const devAuthHeaders = devUser
          ? {
              "x-dev-user-id": devUser.id,
            }
          : {};

        // Find the portfolio ID from the company ID (assuming company ID is investment ID)
        const response = await fetch(`/api/investments`, {
          headers: devAuthHeaders,
        });
        const investmentsResult = await response.json();

        if (investmentsResult.success) {
          const companyInvestment = investmentsResult.data.find(
            (inv: any) => inv.id === companyId
          );

          if (companyInvestment) {
            // Get portfolio ID from the investment
            const portfolioId = companyInvestment.portfolioId;

            // Fetch company data
            const companyResponse = await fetch(
              `/api/portfolios/${portfolioId}/companies/${companyId}`,
              {
                headers: devAuthHeaders,
              }
            );
            const companyResult = await companyResponse.json();

            if (companyResult.success) {
              setCompanyData(companyResult.data);
            } else {
              setError("Failed to load company data");
            }
          } else {
            setError("Company not found");
          }
        } else {
          setError("Failed to load investments");
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
        setError("Failed to load company data");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId, devUser]);

  if (loading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loading Company Details...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !companyData) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Error Loading Company</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">
              {error || "Company data not available"}
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            {companyData.name}
          </DialogTitle>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>{companyData.stage}</span>
            <span>•</span>
            <span>{companyData.sector}</span>
            <span>•</span>
            <span>Founded {companyData.founded}</span>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Overview */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Company Overview
            </h3>
            <p className="text-gray-600">{companyData.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-500">Location</div>
                <div className="font-medium text-gray-900">
                  {companyData.location}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Employees</div>
                <div className="font-mono font-medium text-gray-900">
                  {companyData.employees}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Revenue Growth</div>
                <div className="font-mono font-medium text-green-600">
                  +{companyData.revenueGrowth}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Market Position</div>
                <div className="font-medium text-gray-900">
                  {companyData.performance.competitivePosition}
                </div>
              </div>
            </div>
          </div>

          {/* Investment Performance */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Investment Performance
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Your Investment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-mono font-semibold text-gray-900">
                    €{companyData.invested.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Current Valuation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-mono font-semibold text-gray-900">
                    €{companyData.valuation.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    MOIC
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-mono font-semibold text-green-600">
                    {companyData.moic}x
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    IRR
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-mono font-semibold text-green-600">
                    {companyData.irr}%
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Financial Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Financial Metrics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Annual Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-mono font-semibold text-gray-900">
                    €{companyData.revenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600 font-mono">
                    +{companyData.revenueGrowth}% YoY
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Last Funding
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-mono font-semibold text-gray-900">
                    €{companyData.lastFunding.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {companyData.lastFunding.round} •{" "}
                    {companyData.lastFunding.date}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Your Ownership
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-mono font-semibold text-gray-900">
                    {companyData.ownership}%
                  </div>
                  <div className="text-sm text-gray-600">
                    Investment Date: {companyData.investmentDate}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Performance Trends */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Performance Trends
            </h3>

            <div className="space-y-3">
              {companyData.metrics.map((metric, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <div className="text-sm font-medium text-gray-900">
                    {metric.date}
                  </div>
                  <div className="flex space-x-6 text-sm font-mono">
                    <span>Revenue: €{metric.revenue.toLocaleString()}</span>
                    <span>Customers: {metric.customers}</span>
                    <span>Employees: {metric.employees}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Updates */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Updates
            </h3>

            <div className="space-y-3">
              {companyData.updates.map((update, index) => (
                <Card key={index} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {update.type}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {update.date}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900">
                          {update.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {update.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
