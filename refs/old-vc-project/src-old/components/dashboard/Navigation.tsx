"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const navigation = [
  {
    name: "Portfolio",
    href: "/dashboard",
    description:
      "Your complete investment portfolio across angel and LP investments",
  },
  {
    name: "Documents",
    href: "/dashboard/documents",
    description:
      "Upload and process fund reports, due diligence documents, and investment updates",
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    description: "Manage your account preferences and notification settings",
  },
];

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className }: NavigationProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "w-64 bg-white dark:bg-background border-r border-gray-100 dark:border-border flex flex-col",
        className
      )}
    >
      <div className="p-10">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-5 py-4 text-sm font-normal transition-all duration-200 border-l-2 rounded-r-md",
                  isActive
                    ? "border-l-gray-800 dark:border-l-foreground text-gray-900 dark:text-foreground bg-gray-50/50 dark:bg-card/50"
                    : "border-l-transparent text-gray-600 dark:text-muted-foreground hover:text-gray-800 dark:hover:text-foreground hover:border-l-gray-300 dark:hover:border-l-border hover:bg-gray-50/30 dark:hover:bg-card/30"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-muted-foreground">
              Theme
            </span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
