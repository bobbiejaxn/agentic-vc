import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

// Use Supabase client instead of Drizzle for now
const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

export interface PortfolioSummary {
  id: string;
  userId: string;
  name: string;
  description?: string;
  totalValue?: number;
  totalInvested?: number;
  irr?: number;
  moic?: number;
  activeInvestments?: number;
  createdAt: Date;
  updatedAt: Date;
}

export class PortfolioService {
  /**
   * Ensure default portfolio exists for user
   */
  static async ensureDefaultPortfolio(
    userId: string
  ): Promise<PortfolioSummary> {
    // Check if user has any portfolios
    const { data: existingPortfolios, error: fetchError } = await supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", userId)
      .limit(1);

    if (existingPortfolios && existingPortfolios.length > 0 && !fetchError) {
      const portfolio = existingPortfolios[0];
      return {
        id: portfolio.id,
        userId: portfolio.user_id,
        name: portfolio.name,
        description: portfolio.description,
        totalValue: portfolio.total_value,
        totalInvested: portfolio.total_invested,
        irr: portfolio.irr,
        moic: portfolio.moic,
        activeInvestments: portfolio.active_investments,
        createdAt: new Date(portfolio.created_at),
        updatedAt: new Date(portfolio.updated_at),
      };
    }

    // Create default portfolio
    const portfolioId = randomUUID();
    const { data: newPortfolio, error: createError } = await supabase
      .from("portfolios")
      .insert({
        id: portfolioId,
        user_id: userId,
        name: "Default Portfolio",
        description: "Default portfolio for document uploads",
        total_value: 0,
        total_invested: 0,
        irr: 0,
        moic: 0,
        active_investments: 0,
      })
      .select()
      .single();

    if (createError) {
      throw new Error(
        `Failed to create default portfolio: ${createError.message}`
      );
    }

    return {
      id: newPortfolio.id,
      userId: newPortfolio.user_id,
      name: newPortfolio.name,
      description: newPortfolio.description,
      totalValue: newPortfolio.total_value,
      totalInvested: newPortfolio.total_invested,
      irr: newPortfolio.irr,
      moic: newPortfolio.moic,
      activeInvestments: newPortfolio.active_investments,
      createdAt: new Date(newPortfolio.created_at),
      updatedAt: new Date(newPortfolio.updated_at),
    };
  }

  /**
   * Get user portfolios
   */
  static async getUserPortfolios(userId: string): Promise<PortfolioSummary[]> {
    const { data, error } = await supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch user portfolios: ${error.message}`);
    }

    return data.map((portfolio) => ({
      id: portfolio.id,
      userId: portfolio.user_id,
      name: portfolio.name,
      description: portfolio.description,
      totalValue: portfolio.total_value,
      totalInvested: portfolio.total_invested,
      irr: portfolio.irr,
      moic: portfolio.moic,
      activeInvestments: portfolio.active_investments,
      createdAt: new Date(portfolio.created_at),
      updatedAt: new Date(portfolio.updated_at),
    }));
  }

  /**
   * Get portfolio by ID
   */
  static async getPortfolioById(
    portfolioId: string
  ): Promise<PortfolioSummary | null> {
    const { data, error } = await supabase
      .from("portfolios")
      .select("*")
      .eq("id", portfolioId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Portfolio not found
      }
      throw new Error(`Failed to fetch portfolio: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      description: data.description,
      totalValue: data.total_value,
      totalInvested: data.total_invested,
      irr: data.irr,
      moic: data.moic,
      activeInvestments: data.active_investments,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  /**
   * Create new portfolio
   */
  static async createPortfolio(
    userId: string,
    portfolioData: {
      name: string;
      description?: string;
      totalValue?: number;
      totalInvested?: number;
      irr?: number;
      moic?: number;
      activeInvestments?: number;
    }
  ): Promise<PortfolioSummary> {
    const portfolioId = randomUUID();
    const { data, error } = await supabase
      .from("portfolios")
      .insert({
        id: portfolioId,
        user_id: userId,
        name: portfolioData.name,
        description: portfolioData.description,
        total_value: portfolioData.totalValue || 0,
        total_invested: portfolioData.totalInvested || 0,
        irr: portfolioData.irr || 0,
        moic: portfolioData.moic || 0,
        active_investments: portfolioData.activeInvestments || 0,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create portfolio: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      description: data.description,
      totalValue: data.total_value,
      totalInvested: data.total_invested,
      irr: data.irr,
      moic: data.moic,
      activeInvestments: data.active_investments,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}
