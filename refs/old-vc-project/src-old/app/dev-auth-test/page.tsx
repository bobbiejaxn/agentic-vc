"use client";

import { useDevAuth } from "@/hooks/useDevAuth";
import { DevAuthPanel } from "@/components/dev/DevAuthPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, User, Settings } from "lucide-react";

export default function DevAuthTestPage() {
  const {
    user,
    loading,
    isDevMode,
    devUser,
    signInAsDevUser,
    enableAutoDevLogin,
    disableAutoDevLogin,
    signOut,
    availableDevUsers,
  } = useDevAuth();

  if (!isDevMode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">
              Development Mode Required
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600">
              This page is only available in development mode.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-5 w-5 text-red-600" />;
      case "angel":
        return <Zap className="h-5 w-5 text-blue-600" />;
      case "lp":
        return <User className="h-5 w-5 text-green-600" />;
      default:
        return <User className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DevAuthPanel />

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Development Authentication Test
            </h1>
            <p className="text-xl text-gray-600">
              Test the development authentication bypass system
            </p>
          </div>

          {/* Current Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Current Authentication Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading...</p>
                </div>
              ) : user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 ">
                    {getRoleIcon(
                      devUser?.role || user.user_metadata?.role || "user"
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {devUser?.fullName ||
                          user.user_metadata?.full_name ||
                          user.email}
                      </h3>
                      <p className="text-gray-600">{user.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">
                          {devUser?.role || user.user_metadata?.role || "user"}
                        </Badge>
                        {devUser && (
                          <Badge
                            variant="outline"
                            className="bg-orange-100 text-orange-800"
                          >
                            Development User
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" onClick={signOut}>
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Not authenticated</p>
                  <p className="text-sm text-gray-500">
                    Use the panel in the top-right corner to sign in as a
                    development user.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Dev Users */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Available Development Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableDevUsers.map((devUser) => (
                  <div
                    key={devUser.id}
                    className="flex items-center gap-4 p-4 border  hover:bg-gray-50 transition-colors"
                  >
                    {getRoleIcon(devUser.role)}
                    <div className="flex-1">
                      <h4 className="font-medium">{devUser.fullName}</h4>
                      <p className="text-sm text-gray-600">{devUser.email}</p>
                      <Badge variant="outline" className="mt-1">
                        {devUser.role}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => signInAsDevUser(devUser.id as any)}
                      disabled={user?.id === devUser.id}
                    >
                      {user?.id === devUser.id ? "Current" : "Sign In"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border ">
                  <div>
                    <h4 className="font-medium">Auto-login as Test User</h4>
                    <p className="text-sm text-gray-600">
                      Automatically sign in as the test user when visiting the
                      app
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={enableAutoDevLogin}
                    >
                      Enable
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={disableAutoDevLogin}
                    >
                      Disable
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 ">
                  <h4 className="font-medium text-blue-900 mb-2">
                    URL Parameters
                  </h4>
                  <p className="text-sm text-blue-800 mb-2">
                    You can also sign in using URL parameters:
                  </p>
                  <div className="space-y-1 text-sm font-mono text-blue-700">
                    <p>?dev_user=admin - Sign in as admin</p>
                    <p>?dev_user=angel - Sign in as angel investor</p>
                    <p>?dev_user=lp - Sign in as LP</p>
                    <p>?dev_user=test - Sign in as test user</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
