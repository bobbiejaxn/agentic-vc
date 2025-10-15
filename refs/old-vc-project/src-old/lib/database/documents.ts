import { createClient } from "@supabase/supabase-js";
import {
  DocumentSummary,
  DocumentCreationData,
  DocumentUpdateData,
  DocumentStatus,
  ExtractedData,
} from "../types/documents";

// Use Supabase client instead of Drizzle for now
const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

export class DocumentService {
  /**
   * Create a new document record
   */
  static async createDocument(
    userId: string,
    documentData: DocumentCreationData
  ): Promise<DocumentSummary> {
    const { data, error } = await supabase
      .from("documents")
      .insert({
        user_id: userId,
        name: documentData.name,
        type: documentData.type,
        portfolio_id: documentData.portfolioId,
        file_path: documentData.filePath,
        file_size: documentData.fileSize,
        mime_type: documentData.mimeType,
        ownership_percentage: documentData.ownershipPercentage,
        status: "uploaded",
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create document: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      portfolioId: data.portfolio_id,
      name: data.name,
      type: data.type,
      status: data.status,
      filePath: data.file_path,
      fileSize: data.file_size,
      mimeType: data.mime_type,
      extractedData: data.extracted_data,
      processingError: data.processing_error,
      uploadedAt: new Date(data.uploaded_at),
      processedAt: data.processed_at ? new Date(data.processed_at) : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  /**
   * Update document status
   */
  static async updateDocumentStatus(
    documentId: string,
    status: DocumentStatus,
    extractedData?: ExtractedData,
    processingError?: string
  ): Promise<void> {
    console.log(`🔄 Updating document ${documentId} to status: ${status}`);
    console.log(`📊 Extracted data available:`, !!extractedData);
    console.log(
      `📊 Extracted data keys:`,
      extractedData ? Object.keys(extractedData) : "none"
    );

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === "completed") {
      updateData.processed_at = new Date().toISOString();
      if (extractedData) {
        console.log(`💾 Storing extracted data for document ${documentId}`);
        updateData.extracted_data = extractedData;

        // Map extracted data to individual database fields
        if (extractedData.personalCommitment !== null) {
          updateData.personal_commitment = extractedData.personalCommitment;
        }
        if (extractedData.personalCalledCapital !== null) {
          updateData.personal_called_capital =
            extractedData.personalCalledCapital;
        }
        if (extractedData.personalNAV !== null) {
          updateData.personalnav = extractedData.personalNAV;
        }
        if (extractedData.personalDistributions !== null) {
          updateData.personal_distributions =
            extractedData.personalDistributions;
        }
        if (extractedData.personalOwnership !== null) {
          updateData.personal_ownership = extractedData.personalOwnership;
        }
        // Calculate personal metrics from personal investor data
        if (
          extractedData.personalCalledCapital &&
          extractedData.personalCalledCapital > 0
        ) {
          // Personal MOIC = (Personal NAV + Personal Distributions) / Personal Called Capital
          const personalMOIC =
            ((extractedData.personalNAV || 0) +
              (extractedData.personalDistributions || 0)) /
            extractedData.personalCalledCapital;
          updateData.personalmoic = Math.round(personalMOIC * 100) / 100; // Round to 2 decimal places

          // Personal TVPI = Personal NAV / Personal Called Capital
          const personalTVPI =
            (extractedData.personalNAV || 0) /
            extractedData.personalCalledCapital;
          updateData.personal_tvpi = Math.round(personalTVPI * 100) / 100;

          // Personal IRR calculation (simplified - would need more complex calculation for accurate IRR)
          // For now, use the fund IRR as a proxy since personal IRR is complex to calculate
          if (extractedData.irr) {
            updateData.personal_irr = extractedData.irr;
          }
        }

        // Map fund-level metrics to individual database fields
        if (extractedData.fundSize !== null) {
          updateData.fund_size = extractedData.fundSize;
        }
        if (extractedData.fundNAV !== null) {
          updateData.fundnav = extractedData.fundNAV;
        }
        if (extractedData.cumulativeCalledCapital !== null) {
          updateData.cumulativecalledcapital =
            extractedData.cumulativeCalledCapital;
        }
        if (extractedData.uncalledCapital !== null) {
          updateData.uncalledcapital = extractedData.uncalledCapital;
        }
        if (extractedData.irr !== null) {
          updateData.irr = extractedData.irr;
        }
        if (extractedData.moic !== null) {
          updateData.moic = extractedData.moic;
        }
        if (extractedData.tvpi !== null) {
          updateData.tvpi = extractedData.tvpi;
        }
        if (extractedData.dpi !== null) {
          updateData.dpi = extractedData.dpi;
        }
        if (extractedData.rvpi !== null) {
          updateData.rvpi = extractedData.rvpi;
        }

        // Store direct values if they exist
        if (extractedData.personalMOIC !== null) {
          updateData.personalmoic = extractedData.personalMOIC;
        }
        if (extractedData.personalIRR !== null) {
          updateData.personal_irr = extractedData.personalIRR;
        }
        if (extractedData.personalUnfunded !== null) {
          updateData.personal_unfunded = extractedData.personalUnfunded;
        }
        if (extractedData.managementFeeRate !== null) {
          updateData.management_fee_rate = extractedData.managementFeeRate;
        }
        if (extractedData.carriedInterestRate !== null) {
          updateData.carried_interest_rate = extractedData.carriedInterestRate;
        }
        if (extractedData.hurdleRate !== null) {
          updateData.hurdle_rate = extractedData.hurdleRate;
        }
        if (extractedData.taxTreatment !== null) {
          updateData.tax_treatment = extractedData.taxTreatment;
        }
        if (extractedData.investmentVehicle !== null) {
          updateData.investment_vehicle = extractedData.investmentVehicle;
        }
        if (extractedData.investmentDate !== null) {
          updateData.investment_date = extractedData.investmentDate;
        }
        if (extractedData.initialInvestment !== null) {
          updateData.initial_investment = extractedData.initialInvestment;
        }
        if (extractedData.followOnInvestments !== null) {
          updateData.follow_on_investments = extractedData.followOnInvestments;
        }
        if (extractedData.currentQuarterPerformance !== null) {
          updateData.current_quarter_performance =
            extractedData.currentQuarterPerformance;
        }
        if (extractedData.ytdPerformance !== null) {
          updateData.ytd_performance = extractedData.ytdPerformance;
        }
        if (extractedData.sinceInceptionPerformance !== null) {
          updateData.since_inception_performance =
            extractedData.sinceInceptionPerformance;
        }
        if (extractedData.benchmarkComparison !== null) {
          updateData.benchmark_comparison = extractedData.benchmarkComparison;
        }
        if (extractedData.liquidityTimeline !== null) {
          updateData.liquidity_timeline = extractedData.liquidityTimeline;
        }
        if (extractedData.exitPipelineValue !== null) {
          updateData.exit_pipeline_value = extractedData.exitPipelineValue;
        }
        if (extractedData.portfolioConcentration !== null) {
          updateData.portfolio_concentration =
            extractedData.portfolioConcentration;
        }
        if (extractedData.vintageYear !== null) {
          updateData.vintage_year = extractedData.vintageYear;
        }
        if (extractedData.investmentPeriodEnd !== null) {
          updateData.investment_period_end = extractedData.investmentPeriodEnd;
        }
        if (extractedData.fundCurrency !== null) {
          updateData.fund_currency = extractedData.fundCurrency;
        }
        if (extractedData.reportingPeriod !== null) {
          updateData.reporting_period = extractedData.reportingPeriod;
        }
        if (extractedData.fundAge !== null) {
          updateData.fund_age = extractedData.fundAge;
        }
        if (extractedData.deploymentRate !== null) {
          updateData.deployment_rate = extractedData.deploymentRate;
        }
        if (extractedData.portfolioCompanyCount !== null) {
          updateData.portfolio_company_count =
            extractedData.portfolioCompanyCount;
        }
        if (extractedData.fundSize !== null) {
          updateData.fund_size = extractedData.fundSize;
        }
        if (extractedData.fundNAV !== null) {
          updateData.fundnav = extractedData.fundNAV;
        }
        if (extractedData.cumulativeDistributions !== null) {
          updateData.cumulative_distributions =
            extractedData.cumulativeDistributions;
        }
        if (extractedData.cumulativeCalledCapital !== null) {
          updateData.cumulativecalledcapital =
            extractedData.cumulativeCalledCapital;
        }
        if (extractedData.unfundedCommitment !== null) {
          updateData.unfunded_commitment = extractedData.unfundedCommitment;
        }
        if (extractedData.grossIRR !== null) {
          updateData.gross_irr = extractedData.grossIRR;
        }
        if (extractedData.netIRR !== null) {
          updateData.net_irr = extractedData.netIRR;
        }
        if (extractedData.tvpi !== null) {
          updateData.tvpi = extractedData.tvpi;
        }
        if (extractedData.dpi !== null) {
          updateData.dpi = extractedData.dpi;
        }
        if (extractedData.rvpi !== null) {
          updateData.rvpi = extractedData.rvpi;
        }
        // Fund-level metrics (requires database columns to be added)
        if (extractedData.irr !== null) {
          updateData.irr = extractedData.irr;
        }
        if (extractedData.moic !== null) {
          updateData.moic = extractedData.moic;
        }
        if (extractedData.portfolioCompanies !== null) {
          updateData.portfolio_companies = extractedData.portfolioCompanies;
        }
        if (extractedData.capitalCalls !== null) {
          updateData.capital_calls = extractedData.capitalCalls;
        }
        if (extractedData.distributions !== null) {
          updateData.distributions = extractedData.distributions;
        }
        if (extractedData.riskMetrics !== null) {
          updateData.risk_metrics = extractedData.riskMetrics;
        }
        if (extractedData.coInvestors !== null) {
          updateData.co_investors = extractedData.coInvestors;
        }
      }
    }

    if (status === "error" && processingError) {
      updateData.processing_error = processingError;
    }

    console.log(`🔄 Executing database update for document ${documentId}`);
    console.log(`📊 Update data keys:`, Object.keys(updateData));
    console.log(
      `📊 Update data size:`,
      JSON.stringify(updateData).length,
      "bytes"
    );

    const { error } = await supabase
      .from("documents")
      .update(updateData)
      .eq("id", documentId);

    if (error) {
      console.error(
        `❌ Database update failed for document ${documentId}:`,
        error
      );
      throw new Error(`Failed to update document status: ${error.message}`);
    }

    console.log(`✅ Database update successful for document ${documentId}`);
  }

  /**
   * Get user documents
   */
  static async getUserDocuments(userId: string): Promise<DocumentSummary[]> {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .order("uploaded_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch user documents: ${error.message}`);
    }

    return data.map((doc) => ({
      id: doc.id,
      userId: doc.user_id,
      portfolioId: doc.portfolio_id,
      name: doc.name,
      type: doc.type,
      status: doc.status,
      filePath: doc.file_path,
      fileSize: doc.file_size,
      mimeType: doc.mime_type,
      extractedData: doc.extracted_data,
      processingError: doc.processing_error,
      uploadedAt: new Date(doc.uploaded_at),
      processedAt: doc.processed_at ? new Date(doc.processed_at) : undefined,
      createdAt: new Date(doc.created_at),
      updatedAt: new Date(doc.updated_at),

      // Individual database fields for direct access
      fundSize: doc.fund_size,
      fundNav: doc.fund_nav,
      irr: doc.irr,
      moic: doc.moic,
      tvpi: doc.tvpi,
      dpi: doc.dpi,
      rvpi: doc.rvpi,
      grossIrr: doc.gross_irr,
      netIrr: doc.net_irr,
      personalCommitment: doc.personal_commitment,
      personalCalledCapital: doc.personal_called_capital,
      personalNav: doc.personal_nav,
      personalDistributions: doc.personal_distributions,
      personalOwnership: doc.personal_ownership,
      personalMoic: doc.personal_moic,
      personalIrr: doc.personal_irr,
      portfolioCompanies: doc.portfolio_companies,
      ownershipPercentage: doc.ownership_percentage,
    }));
  }

  /**
   * Get document by ID
   */
  static async getDocumentById(
    documentId: string
  ): Promise<DocumentSummary | null> {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Document not found
      }
      throw new Error(`Failed to fetch document: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      portfolioId: data.portfolio_id,
      name: data.name,
      type: data.type,
      status: data.status,
      filePath: data.file_path,
      fileSize: data.file_size,
      mimeType: data.mime_type,
      extractedData: data.extracted_data,
      processingError: data.processing_error,
      uploadedAt: new Date(data.uploaded_at),
      processedAt: data.processed_at ? new Date(data.processed_at) : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  /**
   * Delete document
   */
  static async deleteDocument(
    documentId: string,
    userId: string
  ): Promise<void> {
    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentId)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  }

  /**
   * Get documents by portfolio
   */
  static async getPortfolioDocuments(
    portfolioId: string
  ): Promise<DocumentSummary[]> {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("portfolio_id", portfolioId)
      .order("uploaded_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch portfolio documents: ${error.message}`);
    }

    return data.map((doc) => ({
      id: doc.id,
      userId: doc.user_id,
      portfolioId: doc.portfolio_id,
      name: doc.name,
      type: doc.type,
      status: doc.status,
      filePath: doc.file_path,
      fileSize: doc.file_size,
      mimeType: doc.mime_type,
      extractedData: doc.extracted_data,
      processingError: doc.processing_error,
      uploadedAt: new Date(doc.uploaded_at),
      processedAt: doc.processed_at ? new Date(doc.processed_at) : undefined,
      createdAt: new Date(doc.created_at),
      updatedAt: new Date(doc.updated_at),
    }));
  }
}
