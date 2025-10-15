import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { DocumentService } from "@/lib/database/documents";
import { DevAuthBypass } from "@/lib/auth/dev-bypass";
import { DataValidationService } from "@/lib/data-validation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; fundId: string }> }
) {
  try {
    let userId: string | null = null;

    // Check for development bypass
    const devUserId = request.headers.get("x-dev-user-id");
    if (devUserId && DevAuthBypass.isDevUser(devUserId)) {
      userId = devUserId;
    } else {
      // Normal authentication flow
      const cookieStore = await cookies();
      const supabase = createServerComponentClient({
        cookies: () => cookieStore,
      });
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      userId = user.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: portfolioId, fundId } = await params;

    // Get fund document data
    const documents = await DocumentService.getUserDocuments(userId);
    const fundDocument = documents.find(
      (doc) =>
        doc.id === fundId &&
        doc.type === "fund_report" &&
        doc.status === "completed"
    );

    if (!fundDocument) {
      return NextResponse.json({ error: "Fund not found" }, { status: 404 });
    }

    // Extract fund data from document with dual-level mapping
    const extractedData = fundDocument.extractedData;
    const fundData = {
      id: fundDocument.id,
      name: fundDocument.name,
      vintage: extractedData?.vintageYear || new Date().getFullYear(),

      // FUND-LEVEL METRICS (from Section 03 - Fund Performance Status)
      fundSize: extractedData?.fundSize || 0,
      fundNav:
        extractedData?.fundNav ||
        extractedData?.fundNAV ||
        extractedData?.totalNAV ||
        0,
      fundDistributions:
        extractedData?.fundDistributions ||
        extractedData?.totalDistributions ||
        extractedData?.cumulativeDistributions ||
        0,
      fundCalled:
        extractedData?.fundCalled ||
        extractedData?.totalCalled ||
        extractedData?.cumulativeCalledCapital ||
        0,
      fundUnfunded:
        extractedData?.fundUnfunded || extractedData?.unfundedCommitment || 0,
      grossIrr: extractedData?.grossIrr || extractedData?.irr || 0,
      netIrr: extractedData?.netIrr || 0,
      grossMoic: extractedData?.grossMoic || extractedData?.moic || 0,
      tvpi: extractedData?.tvpi || 0,
      dpi: extractedData?.dpi || 0,
      rvpi: extractedData?.rvpi || 0,
      managementFeeRate: extractedData?.managementFeeRate || 0,
      carriedInterestRate: extractedData?.carriedInterestRate || 0,
      hurdleRate: extractedData?.hurdleRate || 0,
      deploymentRate: extractedData?.deploymentRate || 0,
      portfolioCompanyCount: extractedData?.portfolioCompanyCount || 0,

      // PERSONAL INVESTOR METRICS (calculated from ownership percentage)
      // CRITICAL FIX: Handle missing ownership percentage with data validation
      personalCommitment:
        extractedData?.ownershipPercentage || fundDocument.personal_ownership
          ? (extractedData?.fundSize || 0) *
            ((extractedData?.ownershipPercentage ||
              fundDocument.personal_ownership ||
              1) /
              100)
          : extractedData?.personalCommitment ||
            (extractedData?.fundSize || 0) * 0.01, // Default 1% if no ownership data
      personalCalled:
        extractedData?.ownershipPercentage || fundDocument.personal_ownership
          ? (extractedData?.cumulativeCalledCapital || 0) *
            ((extractedData?.ownershipPercentage ||
              fundDocument.personal_ownership ||
              1) /
              100)
          : extractedData?.personalCalledCapital ||
            (extractedData?.cumulativeCalledCapital || 0) * 0.01, // Default 1% if no ownership data
      personalNav:
        extractedData?.ownershipPercentage || fundDocument.personal_ownership
          ? (extractedData?.fundNav || extractedData?.fundNAV || 0) *
            ((extractedData?.ownershipPercentage ||
              fundDocument.personal_ownership ||
              1) /
              100)
          : extractedData?.personalNAV ||
            (extractedData?.fundNav || extractedData?.fundNAV || 0) * 0.01, // Default 1% if no ownership data
      personalDistributions:
        extractedData?.ownershipPercentage || fundDocument.personal_ownership
          ? (extractedData?.cumulativeDistributions || 0) *
            ((extractedData?.ownershipPercentage ||
              fundDocument.personal_ownership ||
              1) /
              100)
          : extractedData?.personalDistributions ||
            (extractedData?.cumulativeDistributions || 0) * 0.01, // Default 1% if no ownership data
      personalOwnership:
        extractedData?.ownershipPercentage ||
        fundDocument.personal_ownership ||
        extractedData?.personalOwnership ||
        0,
      personalUnfunded:
        extractedData?.ownershipPercentage || fundDocument.personal_ownership
          ? (extractedData?.unfundedCommitment || 0) *
            ((extractedData?.ownershipPercentage ||
              fundDocument.personal_ownership ||
              1) /
              100)
          : extractedData?.personalUnfunded || 0,
      personalMoic: extractedData?.grossMoic || extractedData?.moic || 0, // Same as fund MOIC
      personalIrr: extractedData?.grossIrr || extractedData?.irr || 0, // Same as fund IRR

      // LEGACY FIELDS (for backward compatibility) - use calculated values
      committed:
        extractedData?.ownershipPercentage || fundDocument.personal_ownership
          ? (extractedData?.fundSize || 0) *
            ((extractedData?.ownershipPercentage ||
              fundDocument.personal_ownership ||
              1) /
              100)
          : extractedData?.personalCommitment || 0,
      called:
        extractedData?.ownershipPercentage || fundDocument.personal_ownership
          ? (extractedData?.cumulativeCalledCapital || 0) *
            ((extractedData?.ownershipPercentage ||
              fundDocument.personal_ownership ||
              1) /
              100)
          : extractedData?.personalCalledCapital || 0,
      nav:
        extractedData?.ownershipPercentage || fundDocument.personal_ownership
          ? (extractedData?.fundNav || extractedData?.fundNAV || 0) *
            ((extractedData?.ownershipPercentage ||
              fundDocument.personal_ownership ||
              1) /
              100)
          : extractedData?.personalNAV || 0,
      irr: extractedData?.grossIrr || extractedData?.irr || 0,
      moic: extractedData?.grossMoic || extractedData?.moic || 0,
      ownership:
        extractedData?.ownershipPercentage ||
        fundDocument.personal_ownership ||
        extractedData?.personalOwnership ||
        0,

      // PORTFOLIO DATA - Calculate MOIC and IRR for each company
      portfolioCompanies: (extractedData?.portfolioCompanies || []).map(
        (company: any) => {
          const investmentAmount =
            company.totalInvestedEUR || company.investmentAmount || 0;
          const valuation = company.fairValueEUR || company.valuation || 0;
          const investmentDate = company.investmentDate
            ? new Date(company.investmentDate)
            : null;

          // Calculate MOIC = Valuation / Investment Amount
          const moic =
            investmentAmount > 0
              ? Math.round((valuation / investmentAmount) * 100) / 100
              : 0;

          // Calculate IRR (simplified - would need more complex calculation for accurate IRR)
          let irr = 0;
          if (investmentDate && investmentAmount > 0 && valuation > 0) {
            const years =
              (Date.now() - investmentDate.getTime()) /
              (365.25 * 24 * 60 * 60 * 1000);
            if (years > 0) {
              // Simplified IRR calculation: (Valuation/Investment)^(1/years) - 1
              irr = Math.round(
                (Math.pow(valuation / investmentAmount, 1 / years) - 1) * 100
              );
            }
          }

          return {
            ...company,
            companyName: company.name || company.companyName,
            investmentAmount: investmentAmount,
            currentValue: valuation,
            moic: company.grossMultiple || moic,
            irr: company.irr || irr,
          };
        }
      ),
      capitalCalls: extractedData?.capitalCalls || [],
      distributions: extractedData?.distributions || [],
      riskMetrics: extractedData?.riskMetrics || {},
      coInvestors: extractedData?.coInvestors || [],
    };

    // Apply data validation and fixes
    const validationResult =
      DataValidationService.validateFundMetrics(fundData);
    const fixedFundData = DataValidationService.applyDataFixes(fundData);

    return NextResponse.json({
      success: true,
      data: fixedFundData,
      validation: {
        isValid: validationResult.isValid,
        errors: validationResult.errors,
        warnings: validationResult.warnings,
        suggestions: validationResult.suggestions,
      },
    });
  } catch (error) {
    console.error("Error fetching fund data:", error);
    return NextResponse.json(
      { error: "Failed to fetch fund data" },
      { status: 500 }
    );
  }
}
