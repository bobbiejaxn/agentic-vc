"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/supabase-js";

interface DashboardHeaderProps {
  user: User | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps): JSX.Element {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignOut = async (): Promise<void> => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="border-b border-gray-100 dark:border-border bg-white/80 dark:bg-background/80 backdrop-blur-sm">
      <div className="px-10 py-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-light text-gray-800 dark:text-foreground tracking-tight">
              VCIntelligence.ai
            </h1>
            <p className="text-xs text-gray-500 dark:text-muted-foreground mt-1 font-normal">
              Investment Management
            </p>
          </div>
          <div className="flex items-center gap-8">
            <span className="text-sm text-gray-600 dark:text-muted-foreground font-normal">
              {user?.user_metadata?.full_name || user?.email}
            </span>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="text-xs px-4 py-2 border-gray-200 dark:border-border text-gray-600 dark:text-muted-foreground hover:bg-gray-50/80 dark:hover:bg-card/80 hover:border-gray-300 dark:hover:border-border transition-all duration-200"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
