"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { RiskMetrics as RiskMetricsType } from "@/lib/types/enhanced-investments";

interface RiskMetricsProps {
  riskMetrics: RiskMetricsType;
  className?: string;
}

export function RiskMetrics({ riskMetrics, className }: RiskMetricsProps) {
  const getRiskColor = (beta: number) => {
    if (beta < 0.8) return "text-green-600";
    if (beta < 1.2) return "text-yellow-600";
    return "text-red-600";
  };

  const getVolatilityColor = (volatility: number) => {
    if (volatility < 15) return "text-green-600";
    if (volatility < 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getSharpeColor = (sharpeRatio: number) => {
    if (sharpeRatio > 1.5) return "text-green-600";
    if (sharpeRatio > 0.5) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Risk Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-gray-900">
              {riskMetrics.beta.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Beta</div>
            <Badge variant="outline" className={getRiskColor(riskMetrics.beta)}>
              {riskMetrics.beta < 1
                ? "Low Risk"
                : riskMetrics.beta > 1.5
                ? "High Risk"
                : "Moderate Risk"}
            </Badge>
          </div>

          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-gray-900">
              {riskMetrics.volatility.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Volatility</div>
            <Badge
              variant="outline"
              className={getVolatilityColor(riskMetrics.volatility)}
            >
              {riskMetrics.volatility < 20
                ? "Stable"
                : riskMetrics.volatility > 40
                ? "Volatile"
                : "Moderate"}
            </Badge>
          </div>

          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-gray-900">
              {riskMetrics.sharpeRatio.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Sharpe Ratio</div>
            <Badge
              variant="outline"
              className={getSharpeColor(riskMetrics.sharpeRatio)}
            >
              {riskMetrics.sharpeRatio > 1
                ? "Good"
                : riskMetrics.sharpeRatio > 0
                ? "Fair"
                : "Poor"}
            </Badge>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Risk-Adjusted Return:</span>
              <span className="font-mono">
                {riskMetrics.sharpeRatio > 0 ? "+" : ""}
                {riskMetrics.sharpeRatio.toFixed(2)}
              </span>
            </div>
            {riskMetrics.maxDrawdown && (
              <div className="flex justify-between">
                <span>Max Drawdown:</span>
                <span className="font-mono text-red-600">
                  {riskMetrics.maxDrawdown.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
