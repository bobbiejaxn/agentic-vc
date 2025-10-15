"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    title: "AI-Powered Fund Report Processing",
    description:
      "Automatically extract and process fund reports with 95%+ accuracy, eliminating manual data entry",
    icon: "🤖",
    badge: "95%+ Accuracy",
    badgeColor: "bg-green-100 text-green-800",
  },
  {
    title: "Multi-Vehicle Portfolio Tracking",
    description:
      "Manage angel investments, LP positions, and co-investments in a unified dashboard",
    icon: "📊",
    badge: "Unified View",
    badgeColor: "bg-blue-100 text-blue-800",
  },
  {
    title: "Co-Investor Network Intelligence",
    description:
      "Discover and connect with fellow investors, track deal flow, and identify co-investment opportunities",
    icon: "🤝",
    badge: "Network Effects",
    badgeColor: "bg-purple-100 text-purple-800",
  },
  {
    title: "Real-Time Performance Analytics",
    description:
      "Track IRR, MOIC, TVPI, and other key metrics across your entire portfolio with live updates",
    icon: "📈",
    badge: "Live Metrics",
    badgeColor: "bg-orange-100 text-orange-800",
  },
  {
    title: "Automated Document Processing",
    description:
      "Upload fund reports, cap tables, and financial statements for instant data extraction and analysis",
    icon: "📄",
    badge: "Instant Processing",
    badgeColor: "bg-indigo-100 text-indigo-800",
  },
  {
    title: "Risk & Concentration Analysis",
    description:
      "Identify portfolio concentration risks, sector exposure, and diversification opportunities",
    icon: "⚠️",
    badge: "Risk Insights",
    badgeColor: "bg-red-100 text-red-800",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-brand mb-4">
              Everything You Need for Portfolio Intelligence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stop spending hours on manual portfolio tracking. Our AI-powered
              platform gives you the insights you need in minutes, not days.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="text-4xl mb-3">{feature.icon}</div>
                    <Badge className={`text-xs ${feature.badgeColor}`}>
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-heading">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <p className="text-lg text-gray-600 mb-6">
              Ready to transform your portfolio management?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/auth/signup">
                <Button size="lg" className="text-lg px-8 py-4">
                  Start Free Trial
                </Button>
              </a>
              <a href="#pricing">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4"
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
