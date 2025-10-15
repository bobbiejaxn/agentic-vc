"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSectionMinimal() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline - Pure Typography */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-brand mb-8 leading-tight text-gray-900">
            Transform 20+ Hours Monthly Portfolio Tracking into 5-Minute Daily
            Check-ins
          </h1>

          {/* Subtitle - Semantic Text */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            AI-powered document processing with 95%+ accuracy for Business
            Angels and LPs managing complex investment portfolios
          </p>

          {/* CTA Buttons - Minimal Styling */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/auth/signup">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-gray-300 text-gray-900 hover:bg-gray-50"
              >
                Start Free Trial
              </Button>
            </Link>
            <Link href="#demo">
              <Button
                variant="ghost"
                size="lg"
                className="text-lg px-8 py-4 text-gray-600 hover:text-gray-900"
              >
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Trust Indicators - Text Only, Monospaced Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-mono text-gray-900 mb-2">95%+</div>
              <div className="text-sm text-gray-600 font-light">
                Document Processing Accuracy
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-mono text-gray-900 mb-2">20+</div>
              <div className="text-sm text-gray-600 font-light">
                Hours Saved Monthly
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-mono text-gray-900 mb-2">500+</div>
              <div className="text-sm text-gray-600 font-light">
                VC Professionals
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
