import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  totalValue: number;
  totalInvested: number;
  irr: number;
  moic: number;
  activeInvestments: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface PortfolioData {
  portfolios: Portfolio[];
  loading: boolean;
  error: string | null;
}

export function usePortfolios() {
  const [data, setData] = useState<PortfolioData>({
    portfolios: [],
    loading: true,
    error: null,
  });

  const supabase = createClientComponentClient();

  const fetchPortfolios = async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      // Get user for authentication
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const response = await fetch("/api/portfolios", {
        headers: {
          "x-dev-user-id": user.id,
        },
      });
      const result = await response.json();

      if (result.success && result.data) {
        setData({
          portfolios: result.data,
          loading: false,
          error: null,
        });
      } else {
        throw new Error(result.error || "Failed to fetch portfolios");
      }
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      setData((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch portfolios",
      }));
    }
  };

  const createPortfolio = async (
    portfolioData: Omit<Portfolio, "id" | "createdAt" | "updatedAt" | "userId">
  ) => {
    try {
      const response = await fetch("/api/portfolios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(portfolioData),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh portfolios after creation
        await fetchPortfolios();
        return result.data;
      } else {
        throw new Error(result.error || "Failed to create portfolio");
      }
    } catch (error) {
      console.error("Error creating portfolio:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  return {
    ...data,
    refetch: fetchPortfolios,
    createPortfolio,
  };
}
