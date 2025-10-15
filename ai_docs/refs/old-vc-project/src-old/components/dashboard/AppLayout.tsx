import { ReactNode } from "react";
import Navigation from "./Navigation";
import { DashboardHeader } from "./DashboardHeader";
import type { User } from "@supabase/supabase-js";

interface AppLayoutProps {
  children: ReactNode;
  user?: User | null;
}

/**
 * Main application layout wrapper for all pages
 * Provides consistent navigation and header across the application
 * Follows Scandinavian minimalism: semantic text-driven, ultra-sparse colors, monospaced financial data
 */
export function AppLayout({ children, user }: AppLayoutProps): JSX.Element {
  return (
    <div className="flex min-h-screen bg-white dark:bg-background">
      {/* Sidebar Navigation */}
      <Navigation />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DashboardHeader user={user} />

        {/* Page Content - Semantic text-driven layout with generous whitespace */}
        <main className="flex-1 p-8 bg-white dark:bg-background">
          <div className="w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
