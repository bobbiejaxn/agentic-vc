import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface PersonalMetrics {
  // Personal Portfolio Metrics (Tier 1 - Mission Critical)
  personalCommitment: number | null;
  personalCalledCapital: number | null;
  personalNAV: number | null;
  personalDistributions: number | null;
  personalOwnership: number | null;
  personalMOIC: number | null;
  personalIRR: number | null;
  personalUnfunded: number | null;
  managementFeeRate: number | null;
  carriedInterestRate: number | null;
  hurdleRate: number | null;
  taxTreatment: string | null;
  investmentVehicle: string | null;
  investmentDate: string | null;
  initialInvestment: number | null;
  followOnInvestments: number | null;
  currentQuarterPerformance: number | null;
  ytdPerformance: number | null;
  sinceInceptionPerformance: number | null;
  benchmarkComparison: string | null;
  liquidityTimeline: string | null;
  exitPipelineValue: number | null;
  portfolioConcentration: string | null;

  // Fund Structure Data
  vintageYear: number | null;
  investmentPeriodEnd: string | null;
  fundCurrency: string | null;
  reportingPeriod: string | null;
  fundAge: number | null;
  deploymentRate: number | null;
  portfolioCompanyCount: number | null;
  fundSize: number | null;
  fundNAV: number | null;
  cumulativeDistributions: number | null;
  cumulativeCalledCapital: number | null;
  unfundedCommitment: number | null;

  // Performance Metrics
  grossIRR: number | null;
  netIRR: number | null;
  tvpi: number | null;
  dpi: number | null;
  rvpi: number | null;

  // Complex Data (JSONB)
  portfolioCompanies: any[] | null;
  capitalCalls: any[] | null;
  distributions: any[] | null;
  riskMetrics: any | null;
  coInvestors: any[] | null;
}

export interface PersonalMetricsUpdate {
  documentId: string;
  userId: string;
  metrics: Partial<PersonalMetrics>;
}

export class PersonalMetricsService {
  /**
   * Get personal metrics for a specific document
   */
  static async getPersonalMetrics(
    documentId: string,
    userId: string
  ): Promise<PersonalMetrics | null> {
    try {
      const { data, error } = await supabase
        .from("documents")
        .select(
          `
          personal_commitment,
          personal_called_capital,
          personal_nav,
          personal_distributions,
          personal_ownership,
          personal_moic,
          personal_irr,
          personal_unfunded,
          management_fee_rate,
          carried_interest_rate,
          hurdle_rate,
          tax_treatment,
          investment_vehicle,
          investment_date,
          initial_investment,
          follow_on_investments,
          current_quarter_performance,
          ytd_performance,
          since_inception_performance,
          benchmark_comparison,
          liquidity_timeline,
          exit_pipeline_value,
          portfolio_concentration,
          vintage_year,
          investment_period_end,
          fund_currency,
          reporting_period,
          fund_age,
          deployment_rate,
          portfolio_company_count,
          fund_size,
          fund_nav,
          cumulative_distributions,
          cumulative_called_capital,
          unfunded_commitment,
          gross_irr,
          net_irr,
          tvpi,
          dpi,
          rvpi,
          portfolio_companies,
          capital_calls,
          distributions,
          risk_metrics,
          co_investors
        `
        )
        .eq("id", documentId)
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching personal metrics:", error);
        return null;
      }

      if (!data) return null;

      // Transform database fields to frontend format
      return {
        personalCommitment: data.personal_commitment,
        personalCalledCapital: data.personal_called_capital,
        personalNAV: data.personal_nav,
        personalDistributions: data.personal_distributions,
        personalOwnership: data.personal_ownership,
        personalMOIC: data.personal_moic,
        personalIRR: data.personal_irr,
        personalUnfunded: data.personal_unfunded,
        managementFeeRate: data.management_fee_rate,
        carriedInterestRate: data.carried_interest_rate,
        hurdleRate: data.hurdle_rate,
        taxTreatment: data.tax_treatment,
        investmentVehicle: data.investment_vehicle,
        investmentDate: data.investment_date,
        initialInvestment: data.initial_investment,
        followOnInvestments: data.follow_on_investments,
        currentQuarterPerformance: data.current_quarter_performance,
        ytdPerformance: data.ytd_performance,
        sinceInceptionPerformance: data.since_inception_performance,
        benchmarkComparison: data.benchmark_comparison,
        liquidityTimeline: data.liquidity_timeline,
        exitPipelineValue: data.exit_pipeline_value,
        portfolioConcentration: data.portfolio_concentration,
        vintageYear: data.vintage_year,
        investmentPeriodEnd: data.investment_period_end,
        fundCurrency: data.fund_currency,
        reportingPeriod: data.reporting_period,
        fundAge: data.fund_age,
        deploymentRate: data.deployment_rate,
        portfolioCompanyCount: data.portfolio_company_count,
        fundSize: data.fund_size,
        fundNAV: data.fund_nav,
        cumulativeDistributions: data.cumulative_distributions,
        cumulativeCalledCapital: data.cumulative_called_capital,
        unfundedCommitment: data.unfunded_commitment,
        grossIRR: data.gross_irr,
        netIRR: data.net_irr,
        tvpi: data.tvpi,
        dpi: data.dpi,
        rvpi: data.rvpi,
        portfolioCompanies: data.portfolio_companies,
        capitalCalls: data.capital_calls,
        distributions: data.distributions,
        riskMetrics: data.risk_metrics,
        coInvestors: data.co_investors,
      };
    } catch (error) {
      console.error("Error in getPersonalMetrics:", error);
      return null;
    }
  }

  /**
   * Update personal metrics for a document
   */
  static async updatePersonalMetrics(
    documentId: string,
    userId: string,
    metrics: Partial<PersonalMetrics>
  ): Promise<boolean> {
    try {
      // Transform frontend format to database format
      const updateData: any = {};

      if (metrics.personalCommitment !== undefined) {
        updateData.personal_commitment = metrics.personalCommitment;
      }
      if (metrics.personalCalledCapital !== undefined) {
        updateData.personal_called_capital = metrics.personalCalledCapital;
      }
      if (metrics.personalNAV !== undefined) {
        updateData.personal_nav = metrics.personalNAV;
      }
      if (metrics.personalDistributions !== undefined) {
        updateData.personal_distributions = metrics.personalDistributions;
      }
      if (metrics.personalOwnership !== undefined) {
        updateData.personal_ownership = metrics.personalOwnership;
      }
      if (metrics.personalMOIC !== undefined) {
        updateData.personal_moic = metrics.personalMOIC;
      }
      if (metrics.personalIRR !== undefined) {
        updateData.personal_irr = metrics.personalIRR;
      }
      if (metrics.personalUnfunded !== undefined) {
        updateData.personal_unfunded = metrics.personalUnfunded;
      }
      if (metrics.managementFeeRate !== undefined) {
        updateData.management_fee_rate = metrics.managementFeeRate;
      }
      if (metrics.carriedInterestRate !== undefined) {
        updateData.carried_interest_rate = metrics.carriedInterestRate;
      }
      if (metrics.hurdleRate !== undefined) {
        updateData.hurdle_rate = metrics.hurdleRate;
      }
      if (metrics.taxTreatment !== undefined) {
        updateData.tax_treatment = metrics.taxTreatment;
      }
      if (metrics.investmentVehicle !== undefined) {
        updateData.investment_vehicle = metrics.investmentVehicle;
      }
      if (metrics.investmentDate !== undefined) {
        updateData.investment_date = metrics.investmentDate;
      }
      if (metrics.initialInvestment !== undefined) {
        updateData.initial_investment = metrics.initialInvestment;
      }
      if (metrics.followOnInvestments !== undefined) {
        updateData.follow_on_investments = metrics.followOnInvestments;
      }
      if (metrics.currentQuarterPerformance !== undefined) {
        updateData.current_quarter_performance =
          metrics.currentQuarterPerformance;
      }
      if (metrics.ytdPerformance !== undefined) {
        updateData.ytd_performance = metrics.ytdPerformance;
      }
      if (metrics.sinceInceptionPerformance !== undefined) {
        updateData.since_inception_performance =
          metrics.sinceInceptionPerformance;
      }
      if (metrics.benchmarkComparison !== undefined) {
        updateData.benchmark_comparison = metrics.benchmarkComparison;
      }
      if (metrics.liquidityTimeline !== undefined) {
        updateData.liquidity_timeline = metrics.liquidityTimeline;
      }
      if (metrics.exitPipelineValue !== undefined) {
        updateData.exit_pipeline_value = metrics.exitPipelineValue;
      }
      if (metrics.portfolioConcentration !== undefined) {
        updateData.portfolio_concentration = metrics.portfolioConcentration;
      }
      if (metrics.vintageYear !== undefined) {
        updateData.vintage_year = metrics.vintageYear;
      }
      if (metrics.investmentPeriodEnd !== undefined) {
        updateData.investment_period_end = metrics.investmentPeriodEnd;
      }
      if (metrics.fundCurrency !== undefined) {
        updateData.fund_currency = metrics.fundCurrency;
      }
      if (metrics.reportingPeriod !== undefined) {
        updateData.reporting_period = metrics.reportingPeriod;
      }
      if (metrics.fundAge !== undefined) {
        updateData.fund_age = metrics.fundAge;
      }
      if (metrics.deploymentRate !== undefined) {
        updateData.deployment_rate = metrics.deploymentRate;
      }
      if (metrics.portfolioCompanyCount !== undefined) {
        updateData.portfolio_company_count = metrics.portfolioCompanyCount;
      }
      if (metrics.fundSize !== undefined) {
        updateData.fund_size = metrics.fundSize;
      }
      if (metrics.fundNAV !== undefined) {
        updateData.fund_nav = metrics.fundNAV;
      }
      if (metrics.cumulativeDistributions !== undefined) {
        updateData.cumulative_distributions = metrics.cumulativeDistributions;
      }
      if (metrics.cumulativeCalledCapital !== undefined) {
        updateData.cumulative_called_capital = metrics.cumulativeCalledCapital;
      }
      if (metrics.unfundedCommitment !== undefined) {
        updateData.unfunded_commitment = metrics.unfundedCommitment;
      }
      if (metrics.grossIRR !== undefined) {
        updateData.gross_irr = metrics.grossIRR;
      }
      if (metrics.netIRR !== undefined) {
        updateData.net_irr = metrics.netIRR;
      }
      if (metrics.tvpi !== undefined) {
        updateData.tvpi = metrics.tvpi;
      }
      if (metrics.dpi !== undefined) {
        updateData.dpi = metrics.dpi;
      }
      if (metrics.rvpi !== undefined) {
        updateData.rvpi = metrics.rvpi;
      }
      if (metrics.portfolioCompanies !== undefined) {
        updateData.portfolio_companies = metrics.portfolioCompanies;
      }
      if (metrics.capitalCalls !== undefined) {
        updateData.capital_calls = metrics.capitalCalls;
      }
      if (metrics.distributions !== undefined) {
        updateData.distributions = metrics.distributions;
      }
      if (metrics.riskMetrics !== undefined) {
        updateData.risk_metrics = metrics.riskMetrics;
      }
      if (metrics.coInvestors !== undefined) {
        updateData.co_investors = metrics.coInvestors;
      }

      const { error } = await supabase
        .from("documents")
        .update(updateData)
        .eq("id", documentId)
        .eq("user_id", userId);

      if (error) {
        console.error("Error updating personal metrics:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in updatePersonalMetrics:", error);
      return false;
    }
  }

  /**
   * Get all documents with personal metrics for a user
   */
  static async getUserPersonalMetrics(
    userId: string
  ): Promise<PersonalMetrics[]> {
    try {
      const { data, error } = await supabase
        .from("documents")
        .select(
          `
          id,
          file_name,
          type,
          personal_commitment,
          personal_called_capital,
          personal_nav,
          personal_distributions,
          personal_ownership,
          personal_moic,
          personal_irr,
          personal_unfunded,
          management_fee_rate,
          carried_interest_rate,
          hurdle_rate,
          tax_treatment,
          investment_vehicle,
          investment_date,
          initial_investment,
          follow_on_investments,
          current_quarter_performance,
          ytd_performance,
          since_inception_performance,
          benchmark_comparison,
          liquidity_timeline,
          exit_pipeline_value,
          portfolio_concentration,
          vintage_year,
          investment_period_end,
          fund_currency,
          reporting_period,
          fund_age,
          deployment_rate,
          portfolio_company_count,
          fund_size,
          fund_nav,
          cumulative_distributions,
          cumulative_called_capital,
          unfunded_commitment,
          gross_irr,
          net_irr,
          tvpi,
          dpi,
          rvpi,
          portfolio_companies,
          capital_calls,
          distributions,
          risk_metrics,
          co_investors,
          created_at,
          updated_at
        `
        )
        .eq("user_id", userId)
        .not("personal_commitment", "is", null)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching user personal metrics:", error);
        return [];
      }

      return (
        data?.map((doc) => ({
          personalCommitment: doc.personal_commitment,
          personalCalledCapital: doc.personal_called_capital,
          personalNAV: doc.personal_nav,
          personalDistributions: doc.personal_distributions,
          personalOwnership: doc.personal_ownership,
          personalMOIC: doc.personal_moic,
          personalIRR: doc.personal_irr,
          personalUnfunded: doc.personal_unfunded,
          managementFeeRate: doc.management_fee_rate,
          carriedInterestRate: doc.carried_interest_rate,
          hurdleRate: doc.hurdle_rate,
          taxTreatment: doc.tax_treatment,
          investmentVehicle: doc.investment_vehicle,
          investmentDate: doc.investment_date,
          initialInvestment: doc.initial_investment,
          followOnInvestments: doc.follow_on_investments,
          currentQuarterPerformance: doc.current_quarter_performance,
          ytdPerformance: doc.ytd_performance,
          sinceInceptionPerformance: doc.since_inception_performance,
          benchmarkComparison: doc.benchmark_comparison,
          liquidityTimeline: doc.liquidity_timeline,
          exitPipelineValue: doc.exit_pipeline_value,
          portfolioConcentration: doc.portfolio_concentration,
          vintageYear: doc.vintage_year,
          investmentPeriodEnd: doc.investment_period_end,
          fundCurrency: doc.fund_currency,
          reportingPeriod: doc.reporting_period,
          fundAge: doc.fund_age,
          deploymentRate: doc.deployment_rate,
          portfolioCompanyCount: doc.portfolio_company_count,
          fundSize: doc.fund_size,
          fundNAV: doc.fund_nav,
          cumulativeDistributions: doc.cumulative_distributions,
          cumulativeCalledCapital: doc.cumulative_called_capital,
          unfundedCommitment: doc.unfunded_commitment,
          grossIRR: doc.gross_irr,
          netIRR: doc.net_irr,
          tvpi: doc.tvpi,
          dpi: doc.dpi,
          rvpi: doc.rvpi,
          portfolioCompanies: doc.portfolio_companies,
          capitalCalls: doc.capital_calls,
          distributions: doc.distributions,
          riskMetrics: doc.risk_metrics,
          coInvestors: doc.co_investors,
        })) || []
      );
    } catch (error) {
      console.error("Error in getUserPersonalMetrics:", error);
      return [];
    }
  }
}
