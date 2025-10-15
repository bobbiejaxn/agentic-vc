"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

const pricingTiers = [
  {
    name: "Starter",
    price: "€199",
    period: "/month",
    description: "Perfect for individual angels and small portfolios",
    badge: "Most Popular",
    badgeColor: "bg-green-100 text-green-800",
    features: [
      "Up to 25 investments",
      "Basic automated report processing",
      "Portfolio performance tracking",
      "Email support",
      "Standard integrations",
      "Basic analytics dashboard",
    ],
    limitations: [
      "No co-investor network access",
      "Limited custom reporting",
      "No API access",
    ],
    cta: "Start Free Trial",
    ctaVariant: "outline" as const,
  },
  {
    name: "Professional",
    price: "€499",
    period: "/month",
    description: "Ideal for active angels and LPs with larger portfolios",
    badge: "Recommended",
    badgeColor: "bg-blue-100 text-blue-800",
    features: [
      "Unlimited investments",
      "Advanced analytics & insights",
      "Co-investor network intelligence",
      "Custom reporting & dashboards",
      "Priority support",
      "Advanced integrations",
      "Deal flow tracking",
      "Risk analysis tools",
    ],
    limitations: ["No white-label options", "Limited custom branding"],
    cta: "Start Free Trial",
    ctaVariant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "€999",
    period: "/month",
    description: "For fund managers and institutional investors",
    badge: "Full Platform",
    badgeColor: "bg-purple-100 text-purple-800",
    features: [
      "Everything in Professional",
      "White-label platform",
      "Custom integrations",
      "Dedicated account manager",
      "Advanced security & compliance",
      "Custom data models",
      "Multi-user access controls",
      "API access & webhooks",
      "Custom training & onboarding",
    ],
    limitations: [],
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-brand mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your portfolio size and investment
              activity. All plans include our core AI-powered document
              processing.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative border-2 transition-all duration-300 hover:shadow-xl ${
                  tier.popular
                    ? "border-blue-500 shadow-lg scale-105"
                    : "border-gray-200"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className={`${tier.badgeColor} px-4 py-1`}>
                      {tier.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-heading mb-2">
                    {tier.name}
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-gray-600">{tier.period}</span>
                  </div>
                  <p className="text-gray-600">{tier.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-start gap-3"
                      >
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {tier.limitations.length > 0 && (
                    <div className="space-y-3 pt-4 border-t">
                      {tier.limitations.map((limitation, limitationIndex) => (
                        <div
                          key={limitationIndex}
                          className="flex items-start gap-3"
                        >
                          <X className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-500">
                            {limitation}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="pt-6">
                    <Button
                      variant={tier.ctaVariant}
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        if (tier.name === "Enterprise") {
                          // Handle contact sales
                          window.location.href =
                            "mailto:sales@vcintelligence.ai";
                        } else {
                          // Handle signup
                          window.location.href = "/auth/signup";
                        }
                      }}
                    >
                      {tier.cta}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom Text */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <p className="text-sm text-gray-500">
              Need a custom plan?{" "}
              <a
                href="mailto:sales@vcintelligence.ai"
                className="text-blue-600 hover:underline"
              >
                Contact our sales team
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
