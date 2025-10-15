"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const problems = [
  {
    title: "20+ Hours Monthly on Manual Tracking",
    description:
      "Spending countless hours manually entering data from fund reports, cap tables, and financial statements across multiple spreadsheets and systems.",
    icon: "⏰",
    impact: "High Time Cost",
    impactColor: "bg-red-100 text-red-800",
    stats: "20+ hours/month",
  },
  {
    title: "Fragmented Portfolio Visibility",
    description:
      "Difficulty comparing personal returns vs. fund-level performance metrics across different investment vehicles and time periods.",
    icon: "📊",
    impact: "Poor Decision Making",
    impactColor: "bg-orange-100 text-orange-800",
    stats: "Multiple systems",
  },
  {
    title: "Limited Risk & Concentration Insights",
    description:
      "Lack of visibility into portfolio concentration, sector exposure, and diversification opportunities across your entire investment portfolio.",
    icon: "⚠️",
    impact: "Hidden Risks",
    impactColor: "bg-yellow-100 text-yellow-800",
    stats: "Blind spots",
  },
  {
    title: "Missed Co-Investment Opportunities",
    description:
      "Difficulty discovering and connecting with fellow investors, tracking deal flow, and identifying potential co-investment opportunities.",
    icon: "🤝",
    impact: "Lost Opportunities",
    impactColor: "bg-purple-100 text-purple-800",
    stats: "Network gaps",
  },
  {
    title: "Inconsistent Performance Reporting",
    description:
      "Struggling to generate consistent, accurate performance reports for LPs, co-investors, and personal portfolio tracking.",
    icon: "📈",
    impact: "Reporting Delays",
    impactColor: "bg-blue-100 text-blue-800",
    stats: "Days to weeks",
  },
  {
    title: "Data Quality & Accuracy Issues",
    description:
      "Manual data entry leads to errors, inconsistencies, and outdated information that affects investment decision-making.",
    icon: "❌",
    impact: "Data Errors",
    impactColor: "bg-red-100 text-red-800",
    stats: "Human error",
  },
];

export default function ProblemSection() {
  return (
    <section className="py-20 bg-red-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-brand mb-4">
              The Hidden Costs of Manual Portfolio Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              VC professionals waste countless hours on manual processes that
              could be automated, leading to missed opportunities and poor
              decision-making.
            </p>
          </div>

          {/* Problems Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {problems.map((problem, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{problem.icon}</div>
                    <Badge className={`text-xs ${problem.impactColor}`}>
                      {problem.impact}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-heading leading-tight">
                    {problem.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {problem.description}
                  </p>
                  <div className="text-sm font-semibold text-gray-800">
                    Impact: {problem.stats}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold font-brand mb-4">
                Stop Wasting Time on Manual Processes
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Join 500+ VC professionals who have transformed their portfolio
                management with AI-powered automation and real-time insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/auth/signup">
                  <Button size="lg" className="text-lg px-8 py-4">
                    Start Free Trial
                  </Button>
                </a>
                <a href="#features">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-4"
                  >
                    See How It Works
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
