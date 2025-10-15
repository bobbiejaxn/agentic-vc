"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface ChartData {
  month: string;
  value: number;
}

interface PortfolioPerformanceChartProps {
  data: ChartData[];
  loading?: boolean;
}

export function PortfolioPerformanceChart({
  data,
  loading,
}: PortfolioPerformanceChartProps) {
  if (loading) {
    return (
      <div className="h-40 bg-white border border-gray-200  p-6 flex items-center justify-center">
        <div className="flex flex-col items-center text-gray-400">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-2" />
          <span className="text-sm">Loading chart data...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-40 bg-white border border-gray-200  p-6 flex items-center justify-center">
        <div className="flex flex-col items-center text-gray-400">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <TrendingUp className="w-6 h-6 text-gray-400" />
          </div>
          <span className="text-sm font-medium">
            No portfolio data available
          </span>
          <span className="text-xs text-gray-400 mt-1">
            Upload fund reports to see performance trends
          </span>
        </div>
      </div>
    );
  }

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `€${(value / 1000).toFixed(0)}K`;
    }
    return `€${value.toFixed(0)}`;
  };

  return (
    <div className="h-40 bg-white border border-gray-200  p-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6B7280" }}
            tickMargin={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6B7280" }}
            tickFormatter={formatValue}
            tickMargin={8}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white border border-gray-200  shadow-lg p-3">
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-sm text-gray-600">
                      Value: {formatValue(payload[0].value as number)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="value"
            fill="#9CA3AF"
            radius={[2, 2, 0, 0]}
            className="hover:fill-gray-600 transition-colors duration-200"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
