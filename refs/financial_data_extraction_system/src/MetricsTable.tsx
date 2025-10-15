import { Doc } from "../convex/_generated/dataModel";

export function MetricsTable({ metrics }: { metrics: Doc<"metrics"> }) {
  const metricsData = [
    // Original 6 metrics
    {
      label: "Gross IRR",
      value: metrics.grossIRR,
      description: "Fund gross internal rate of return",
      category: "Performance",
    },
    {
      label: "Net IRR",
      value: metrics.netIRR,
      description: "Net IRR after fees",
      category: "Performance",
    },
    {
      label: "TVPI",
      value: metrics.tvpi,
      description: "Total value to paid-in capital multiple",
      category: "Performance",
    },
    {
      label: "DPI",
      value: metrics.dpi,
      description: "Distributions to paid-in capital",
      category: "Performance",
    },
    {
      label: "RVPI",
      value: metrics.rvpi,
      description: "Residual value to paid-in capital",
      category: "Performance",
    },
    {
      label: "Fund NAV",
      value: metrics.fundNAV,
      description: "Net asset value",
      category: "Performance",
    },
    // New Tier 1 metrics
    {
      label: "Cumulative Distributions",
      value: metrics.cumulativeDistributions,
      description: "Total cash returned",
      category: "Capital",
    },
    {
      label: "Cumulative Called Capital",
      value: metrics.cumulativeCalledCapital,
      description: "Total capital called",
      category: "Capital",
    },
    {
      label: "Unfunded Commitment",
      value: metrics.unfundedCommitment,
      description: "Remaining callable capital",
      category: "Capital",
    },
    {
      label: "Fund Size",
      value: metrics.fundSize,
      description: "Total committed capital",
      category: "Fund Info",
    },
    {
      label: "Vintage Year",
      value: metrics.vintageYear,
      description: "Fund formation year",
      category: "Fund Info",
    },
    {
      label: "Investment Period End",
      value: metrics.investmentPeriodEnd,
      description: "When investment period expires",
      category: "Fund Info",
    },
    {
      label: "Management Fee Rate",
      value: metrics.managementFeeRate,
      description: "Annual management fee percentage",
      category: "Fees",
    },
    {
      label: "Carried Interest Rate",
      value: metrics.carriedInterestRate,
      description: "GP carry percentage",
      category: "Fees",
    },
    {
      label: "Hurdle Rate",
      value: metrics.hurdleRate,
      description: "Preferred return threshold",
      category: "Fees",
    },
    {
      label: "Fund Currency",
      value: metrics.fundCurrency,
      description: "Base currency",
      category: "Fund Info",
    },
    {
      label: "Reporting Period",
      value: metrics.reportingPeriod,
      description: "Current quarter/period",
      category: "Fund Info",
    },
    {
      label: "Fund Age",
      value: metrics.fundAge,
      description: "Years since first closing",
      category: "Fund Info",
    },
    {
      label: "Deployment Rate",
      value: metrics.deploymentRate,
      description: "Capital deployed vs committed",
      category: "Performance",
    },
    {
      label: "Portfolio Company Count",
      value: metrics.portfolioCompanyCount,
      description: "Number of investments",
      category: "Portfolio",
    },
  ];

  // Group metrics by category
  const categories = [
    "Performance",
    "Capital",
    "Fund Info",
    "Fees",
    "Portfolio",
  ];
  const groupedMetrics = categories.map((category) => ({
    category,
    metrics: metricsData.filter((m) => m.category === category),
  }));

  return (
    <div className="bg-white  shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          Extracted Financial Metrics
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          20 Tier 1 mission-critical data points
        </p>
      </div>
      <div className="overflow-x-auto">
        {groupedMetrics.map(({ category, metrics: categoryMetrics }) => (
          <div key={category}>
            <div className="px-6 py-2 bg-gray-100 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                {category}
              </h3>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categoryMetrics.map((metric, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {metric.label}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-semibold">
                        {metric.value || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {metric.description}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
