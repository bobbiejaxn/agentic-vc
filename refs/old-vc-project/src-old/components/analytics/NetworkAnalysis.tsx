"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Network, TrendingUp } from "lucide-react";
import { NetworkAnalysis as NetworkAnalysisType } from "@/lib/types/enhanced-investments";

interface NetworkAnalysisProps {
  networkData: NetworkAnalysisType;
  className?: string;
}

export function NetworkAnalysis({
  networkData,
  className,
}: NetworkAnalysisProps) {
  const getNetworkStrengthColor = (strength: number) => {
    if (strength > 0.7) return "text-green-600";
    if (strength > 0.4) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Network className="h-5 w-5" />
          Network Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">Co-Investors</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {networkData.coInvestors.slice(0, 5).map((investor, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {investor}
                </Badge>
              ))}
              {networkData.coInvestors.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{networkData.coInvestors.length - 5} more
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">Network Strength</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    networkData.networkStrength > 0.7
                      ? "bg-green-500"
                      : networkData.networkStrength > 0.4
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${networkData.networkStrength * 100}%` }}
                ></div>
              </div>
              <span
                className={`text-sm font-mono ${getNetworkStrengthColor(
                  networkData.networkStrength
                )}`}
              >
                {(networkData.networkStrength * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">
              Deal Flow Sources
            </div>
            <div className="flex flex-wrap gap-1">
              {networkData.dealFlow.slice(0, 3).map((source, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {source}
                </Badge>
              ))}
              {networkData.dealFlow.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{networkData.dealFlow.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">
              Key Relationships
            </div>
            <div className="flex flex-wrap gap-1">
              {networkData.relationships
                .slice(0, 4)
                .map((relationship, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {relationship}
                  </Badge>
                ))}
              {networkData.relationships.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{networkData.relationships.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
