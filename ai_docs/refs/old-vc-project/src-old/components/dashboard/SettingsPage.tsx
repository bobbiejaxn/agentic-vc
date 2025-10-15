"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AppLayout } from "./AppLayout";

/**
 * User settings and configuration page
 * Follows Scandinavian minimalism: semantic text-driven, ultra-sparse colors, monospaced financial data
 */
export function SettingsPage() {
  const [settings, setSettings] = useState({
    email: "mario@example.com",
    name: "Mario",
    notifications: {
      capitalCalls: true,
      distributions: true,
      portfolioUpdates: false,
      marketIntelligence: true,
    },
    preferences: {
      currency: "EUR",
      timezone: "Europe/Berlin",
      language: "en",
    },
  });

  const handleSave = () => {
    // TODO: Implement actual settings save
    console.log("Saving settings:", settings);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-600">
            Manage your account preferences and notification settings
          </p>
        </div>

        {/* Quick Actions */}
        <Card className="scandinavian-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-normal text-gray-500 uppercase tracking-wide">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-12 text-sm border-gray-200 dark:border-border text-gray-700 dark:text-muted-foreground hover:bg-gray-50 dark:hover:bg-card"
              >
                Export Portfolio
              </Button>
              <Button
                variant="outline"
                className="h-12 text-sm border-gray-200 dark:border-border text-gray-700 dark:text-muted-foreground hover:bg-gray-50 dark:hover:bg-card"
              >
                Download Reports
              </Button>
              <Button
                variant="outline"
                className="h-12 text-sm border-gray-200 dark:border-border text-gray-700 dark:text-muted-foreground hover:bg-gray-50 dark:hover:bg-card"
              >
                Sync Data
              </Button>
              <Button
                variant="outline"
                className="h-12 text-sm border-gray-200 dark:border-border text-gray-700 dark:text-muted-foreground hover:bg-gray-50 dark:hover:bg-card"
              >
                Backup Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) =>
                    setSettings({ ...settings, name: e.target.value })
                  }
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-900">
                    Capital Calls
                  </Label>
                  <p className="text-xs text-gray-500">
                    Get notified when capital calls are made
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.capitalCalls}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        capitalCalls: checked,
                      },
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-900">
                    Distributions
                  </Label>
                  <p className="text-xs text-gray-500">
                    Get notified when distributions are received
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.distributions}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        distributions: checked,
                      },
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-900">
                    Portfolio Updates
                  </Label>
                  <p className="text-xs text-gray-500">
                    Get notified about portfolio performance updates
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.portfolioUpdates}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        portfolioUpdates: checked,
                      },
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-900">
                    Market Intelligence
                  </Label>
                  <p className="text-xs text-gray-500">
                    Get notified about market intelligence updates
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.marketIntelligence}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        marketIntelligence: checked,
                      },
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">
              Application Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Input
                  id="currency"
                  value={settings.preferences.currency}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      preferences: {
                        ...settings.preferences,
                        currency: e.target.value,
                      },
                    })
                  }
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  value={settings.preferences.timezone}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      preferences: {
                        ...settings.preferences,
                        timezone: e.target.value,
                      },
                    })
                  }
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  value={settings.preferences.language}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      preferences: {
                        ...settings.preferences,
                        language: e.target.value,
                      },
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">
              API Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <Input
                  id="openai-key"
                  type="password"
                  placeholder="sk-..."
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Used for AI-powered document processing and analysis
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supabase-url">Supabase URL</Label>
                <Input
                  id="supabase-url"
                  placeholder="https://your-project.supabase.co"
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Database connection for portfolio data storage
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supabase-key">Supabase API Key</Label>
                <Input
                  id="supabase-key"
                  type="password"
                  placeholder="eyJ..."
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Authentication key for database access
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="px-6">
            Save Settings
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
