"use client";

import { Button } from "@/components/ui/button";

const problems = [
  {
    title: "20+ Hours Monthly on Manual Tracking",
    description:
      "Spending countless hours manually entering data from fund reports, cap tables, and financial statements across multiple spreadsheets and systems.",
    impact: "20+ hours/month",
  },
  {
    title: "Fragmented Portfolio Visibility",
    description:
      "Difficulty comparing personal returns vs. fund-level performance metrics across different investment vehicles and time periods.",
    impact: "Multiple systems",
  },
  {
    title: "Limited Risk & Concentration Insights",
    description:
      "Lack of visibility into portfolio concentration, sector exposure, and diversification opportunities across your entire investment portfolio.",
    impact: "Blind spots",
  },
  {
    title: "Missed Co-Investment Opportunities",
    description:
      "Difficulty discovering and connecting with fellow investors, tracking deal flow, and identifying potential co-investment opportunities.",
    impact: "Network gaps",
  },
  {
    title: "Inconsistent Performance Reporting",
    description:
      "Struggling to generate consistent, accurate performance reports for LPs, co-investors, and personal portfolio tracking.",
    impact: "Days to weeks",
  },
  {
    title: "Data Quality & Accuracy Issues",
    description:
      "Manual data entry leads to errors, inconsistencies, and outdated information that affects investment decision-making.",
    impact: "Human error",
  },
];

export default function ProblemSectionMinimal() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header - Pure Typography */}
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-heading text-gray-900 mb-6">
              The Hidden Costs of Manual Portfolio Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              VC professionals waste countless hours on manual processes that
              could be automated, leading to missed opportunities and poor
              decision-making.
            </p>
          </div>

          {/* Problems Grid - Text Only */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {problems.map((problem, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl font-heading text-gray-900 mb-4 leading-tight">
                  {problem.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4 font-light">
                  {problem.description}
                </p>
                <div className="text-sm font-mono text-gray-800">
                  Impact: {problem.impact}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA - Minimal */}
          <div className="text-center mt-20">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-heading text-gray-900 mb-6">
                Stop Wasting Time on Manual Processes
              </h3>
              <p className="text-lg text-gray-600 mb-8 font-light leading-relaxed">
                Join 500+ VC professionals who have transformed their portfolio
                management with AI-powered automation and real-time insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a href="/auth/signup">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-4 border-gray-300 text-gray-900 hover:bg-gray-50"
                  >
                    Start Free Trial
                  </Button>
                </a>
                <a href="#features">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-lg px-8 py-4 text-gray-600 hover:text-gray-900"
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
