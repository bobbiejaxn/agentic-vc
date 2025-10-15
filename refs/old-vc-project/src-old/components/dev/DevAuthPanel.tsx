"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Switch } from "@/components/ui/switch"; // Switch component not available
import { Label } from "@/components/ui/label";
import { 
  User, 
  Settings, 
  Shield, 
  Zap,
  LogOut,
  LogIn
} from "lucide-react";
import { useDevAuth } from "@/hooks/useDevAuth";
import type { DevUser } from "@/lib/auth/dev-bypass";

export function DevAuthPanel() {
  const {
    user,
    isDevMode,
    devUser,
    signInAsDevUser,
    enableAutoDevLogin,
    disableAutoDevLogin,
    signOut,
    availableDevUsers,
  } = useDevAuth();

  const [autoLoginEnabled, setAutoLoginEnabled] = useState(
    typeof window !== "undefined" && localStorage.getItem("dev_auto_login") === "true"
  );

  if (!isDevMode) {
    return null; // Only show in development
  }

  const handleAutoLoginToggle = (enabled: boolean) => {
    setAutoLoginEnabled(enabled);
    if (enabled) {
      enableAutoDevLogin();
    } else {
      disableAutoDevLogin();
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "angel":
        return <Zap className="h-4 w-4" />;
      case "lp":
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "angel":
        return "bg-blue-100 text-blue-800";
      case "lp":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="fixed top-4 right-4 w-80 z-50 bg-white/95 backdrop-blur-sm border-2 border-orange-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Settings className="h-4 w-4 text-orange-600" />
          Development Auth Panel
          <Badge variant="outline" className="text-xs">DEV</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current User Status */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-600">Current User</Label>
          {user ? (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
              {getRoleIcon(devUser?.role || user.user_metadata?.role || "user")}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {devUser?.fullName || user.user_metadata?.full_name || user.email}
                </p>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getRoleColor(devUser?.role || user.user_metadata?.role || "user")}`}
                  >
                    {devUser?.role || user.user_metadata?.role || "user"}
                  </Badge>
                  {devUser && (
                    <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800">
                      DEV
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="h-8 w-8 p-0"
              >
                <LogOut className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="p-2 bg-gray-50 rounded-md text-sm text-gray-500">
              Not authenticated
            </div>
          )}
        </div>

        {/* Auto Login Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-login" className="text-xs font-medium text-gray-600">
            Auto-login as Test User
          </Label>
          <Button
            variant={autoLoginEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => handleAutoLoginToggle(!autoLoginEnabled)}
            className="h-6 px-2 text-xs"
          >
            {autoLoginEnabled ? "ON" : "OFF"}
          </Button>
        </div>

        {/* Dev User Buttons */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-600">Quick Login</Label>
          <div className="grid grid-cols-2 gap-2">
            {availableDevUsers.map((devUser) => (
              <Button
                key={devUser.id}
                variant="outline"
                size="sm"
                onClick={() => signInAsDevUser(devUser.id as any)}
                className="h-8 text-xs justify-start"
                disabled={user?.id === devUser.id}
              >
                {getRoleIcon(devUser.role)}
                <span className="ml-1 truncate">{devUser.role}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* URL Parameters Info */}
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-md">
          <p className="font-medium mb-1">URL Parameters:</p>
          <p>Add <code>?dev_user=test</code> to URL for quick dev login</p>
        </div>
      </CardContent>
    </Card>
  );
}
