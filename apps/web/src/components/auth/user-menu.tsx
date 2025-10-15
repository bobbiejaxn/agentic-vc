"use client";

import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function UserMenu() {
  const { user, signOut, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Welcome back!</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {user.email}
            </p>
          </div>
          <Button
            onClick={() => signOut()}
            variant="outline"
            className="w-full"
          >
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
