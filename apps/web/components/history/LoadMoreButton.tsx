"use client";

import { Button } from "@/components/ui/button";

interface LoadMoreButtonProps {
  isLoading: boolean;
  onLoadMore: () => Promise<void>;
}

export function LoadMoreButton({ isLoading, onLoadMore }: LoadMoreButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onLoadMore}
      disabled={isLoading}
      className="px-6"
    >
      {isLoading ? (
        <>
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Loading...
        </>
      ) : (
        "Load More"
      )}
    </Button>
  );
}
