"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function WelcomePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [supabase.auth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-foreground mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-muted-foreground">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (user) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-border bg-white dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-900 dark:text-foreground">
                VC Intelligence
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-gray-600 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground hover:bg-gray-50 dark:hover:bg-card"
                onClick={() => router.push("/auth/signin")}
              >
                Sign In
              </Button>
              <Button
                className="bg-gray-900 dark:bg-foreground hover:bg-gray-800 dark:hover:bg-foreground/90 text-white dark:text-background"
                onClick={() => router.push("/auth/signup")}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-gray-100 dark:bg-card text-gray-700 dark:text-muted-foreground border-gray-200 dark:border-border">
              AI-Powered VC Intelligence Platform
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-foreground mb-6">
              Transform Your VC Portfolio
            </h1>

            <p className="text-xl text-gray-600 dark:text-muted-foreground mb-8 max-w-3xl mx-auto">
              The world's first AI-powered platform for Limited Partners to
              analyze, track, and optimize their venture capital investments
              with unprecedented intelligence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-gray-900 dark:bg-foreground hover:bg-gray-800 dark:hover:bg-foreground/90 text-white dark:text-background px-8 py-4 text-lg"
                onClick={() => router.push("/auth/signup")}
              >
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 dark:border-border text-gray-700 dark:text-muted-foreground hover:bg-gray-50 dark:hover:bg-card px-8 py-4 text-lg"
                onClick={() => router.push("/auth/signin")}
              >
                Sign In
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-foreground mb-2 font-mono">
                  95%+
                </div>
                <div className="text-gray-600 dark:text-muted-foreground">
                  Extraction Accuracy
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-foreground mb-2 font-mono">
                  €2.1B+
                </div>
                <div className="text-gray-600 dark:text-muted-foreground">
                  Assets Analyzed
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-foreground mb-2 font-mono">
                  500+
                </div>
                <div className="text-gray-600 dark:text-muted-foreground">
                  Fund Reports Processed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50 dark:bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-foreground mb-4">
              Powered by Advanced AI
            </h2>
            <p className="text-xl text-gray-600 dark:text-muted-foreground max-w-3xl mx-auto">
              Our proprietary AI technology extracts and analyzes complex
              financial data from any fund report with unprecedented accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="bg-white dark:bg-background border-gray-200 dark:border-border">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-foreground">
                  Smart Document Processing
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-muted-foreground">
                  Automatically extract personal LP metrics from any fund report
                  format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600 dark:text-muted-foreground">
                  <li>Personal commitment tracking</li>
                  <li>NAV and distribution analysis</li>
                  <li>Performance metrics extraction</li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-white dark:bg-background border-gray-200 dark:border-border">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-foreground">
                  Portfolio Intelligence
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-muted-foreground">
                  Comprehensive analysis of your VC portfolio performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600 dark:text-muted-foreground">
                  <li>Real-time performance tracking</li>
                  <li>Risk assessment and analysis</li>
                  <li>Benchmark comparisons</li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-white dark:bg-background border-gray-200 dark:border-border">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-foreground">
                  AI-Powered Insights
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-muted-foreground">
                  Get intelligent recommendations and market intelligence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600 dark:text-muted-foreground">
                  <li>Investment recommendations</li>
                  <li>Market trend analysis</li>
                  <li>Predictive analytics</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-foreground mb-6">
            Ready to Transform Your VC Portfolio?
          </h2>
          <p className="text-xl text-gray-600 dark:text-muted-foreground mb-8">
            Join leading Limited Partners who trust VC Intelligence for their
            investment analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gray-900 dark:bg-foreground hover:bg-gray-800 dark:hover:bg-foreground/90 text-white dark:text-background px-8 py-4 text-lg"
              onClick={() => router.push("/auth/signup")}
            >
              Start Your Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-300 dark:border-border text-gray-700 dark:text-muted-foreground hover:bg-gray-50 dark:hover:bg-card px-8 py-4 text-lg"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-border bg-white dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-xl font-semibold text-gray-900 dark:text-foreground">
                VC Intelligence
              </span>
            </div>
            <div className="text-gray-600 dark:text-muted-foreground text-sm">
              © 2024 VC Intelligence. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
