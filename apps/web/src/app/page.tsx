"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";
import { UserMenu } from "@/components/auth/user-menu";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const users = useQuery(api.users.getUserByEmail, {
    email: "test@example.com",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            VC Portfolio OS
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            AI-Powered VC Portfolio Intelligence Platform
          </p>
        </header>

        {/* Authentication Section */}
        <div className="max-w-md mx-auto mb-8">
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : isAuthenticated ? (
            <UserMenu />
          ) : (
            <LoginForm />
          )}
        </div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Portfolio Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Track your fund performance and portfolio metrics in real-time
              </p>
              <Button className="mt-4" variant="outline">
                View Portfolio
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📄 Document Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Upload fund reports for AI-powered data extraction
              </p>
              <Button className="mt-4" variant="outline" asChild>
                <a href="/upload">Upload Documents</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🤖 AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Get intelligent insights from your portfolio data
              </p>
              <Button className="mt-4" variant="outline">
                Start Analysis
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Connection Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Convex Backend: Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Database: Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>
                  AI Services:{" "}
                  {users !== undefined ? "Connected" : "Connecting..."}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="font-semibold mb-2">🔍 Mistral OCR</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Advanced document processing
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="font-semibold mb-2">🧠 Google ADK</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Multi-agent AI extraction
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="font-semibold mb-2">⚡ Real-time</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Live portfolio updates
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="font-semibold mb-2">🔒 Secure</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Enterprise-grade security
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
