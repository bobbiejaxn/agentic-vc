"use client";

import { Button } from "@/components/ui/button";

const features = [
  {
    title: "AI-Powered Fund Report Processing",
    description:
      "Automatically extract and process fund reports with 95%+ accuracy, eliminating manual data entry",
  },
  {
    title: "Multi-Vehicle Portfolio Tracking",
    description:
      "Manage angel investments, LP positions, and co-investments in a unified dashboard",
  },
  {
    title: "Co-Investor Network Intelligence",
    description:
      "Discover and connect with fellow investors, track deal flow, and identify co-investment opportunities",
  },
  {
    title: "Real-Time Performance Analytics",
    description:
      "Track IRR, MOIC, TVPI, and other key metrics across your entire portfolio with live updates",
  },
  {
    title: "Automated Document Processing",
    description:
      "Upload fund reports, cap tables, and financial statements for instant data extraction and analysis",
  },
  {
    title: "Risk & Concentration Analysis",
    description:
      "Identify portfolio concentration risks, sector exposure, and diversification opportunities",
  },
];

export default function FeaturesSectionMinimal() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header - Pure Typography */}
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-heading text-gray-900 mb-6">
              Everything You Need for Portfolio Intelligence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Stop spending hours on manual portfolio tracking. Our AI-powered
              platform gives you the insights you need in minutes, not days.
            </p>
          </div>

          {/* Features Grid - Text Only */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl font-heading text-gray-900 mb-4 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom CTA - Minimal */}
          <div className="text-center mt-20">
            <p className="text-lg text-gray-600 mb-8 font-light">
              Ready to transform your portfolio management?
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
              <a href="#pricing">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-lg px-8 py-4 text-gray-600 hover:text-gray-900"
                >
                  View Pricing
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
