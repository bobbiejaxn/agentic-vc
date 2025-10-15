import { NextRequest, NextResponse } from "next/server";
import { LlamaParseService } from "@/lib/ai/llama-parse";
import { StrategicFieldValidator } from "@/lib/ai/field-validation";
import { ExtractionTestingFramework } from "@/lib/ai/extraction-testing";

// Comprehensive test document with all Tier 1 strategic fields
const COMPREHENSIVE_FUND_REPORT = `
# Merantix AI Fund III - Q4 2024 Quarterly Report

## Executive Summary
Merantix AI Fund III demonstrates strong performance across all key metrics, with significant value creation in our AI and deep tech portfolio.

## Fund Overview
- **Fund Name**: Merantix AI Fund III
- **Fund Size**: €200,000,000
- **Vintage Year**: 2023
- **Fund Currency**: EUR
- **Reporting Period**: Q4 2024
- **Fund Age**: 1.25 years
- **Management Fee Rate**: 2.0%
- **Carried Interest Rate**: 20.0%
- **Hurdle Rate**: 8.0%
- **Investment Period End**: December 31, 2028
- **Deployment Rate**: 65%
- **Portfolio Company Count**: 12

## Performance Metrics
- **Gross IRR**: 28.5%
- **Net IRR**: 24.2%
- **TVPI (MOIC)**: 1.45x
- **DPI**: 0.35x
- **RVPI**: 1.10x
- **Fund NAV**: €125,400,000
- **Cumulative Distributions**: €45,800,000
- **Cumulative Called Capital**: €130,000,000
- **Unfunded Commitment**: €70,000,000

## Personal Portfolio Statement - John Smith
- **Personal Commitment**: €5,000,000
- **Personal Called Capital**: €3,250,000
- **Personal NAV**: €3,750,000
- **Personal Distributions**: €1,250,000
- **Personal Ownership %**: 2.5%
- **Personal MOIC**: 1.38x
- **Personal IRR**: 26.8%
- **Personal Unfunded**: €1,750,000

### Capital Call History
- Q1 2024: €1,500,000 (Initial investment)
- Q2 2024: €750,000 (Follow-on round)
- Q3 2024: €1,000,000 (Portfolio expansion)

### Distribution History
- Q2 2024: €500,000 (Company A partial exit - return of capital)
- Q4 2024: €750,000 (Company B dividend - capital gain)

- **Carry Allocation**: €150,000
- **Management Fee Paid**: €65,000
- **Tax Treatment**: 40% return of capital, 60% capital gain
- **Investment Vehicle**: Personal (Individual)
- **Investment Date**: January 15, 2023
- **Initial Investment**: €2,000,000
- **Follow-on Investments**: €1,250,000
- **Current Quarter Performance**: +12.5%
- **YTD Performance**: +28.3%
- **Since Inception Performance**: +38.0%
- **Benchmark Comparison**: CAC 40 + 15.2%
- **Liquidity Timeline**: 3-5 years expected
- **Exit Pipeline Value**: €2,100,000
- **Portfolio Concentration**: Top 3 positions = 45%

## Portfolio Company Details

### NeuralTech GmbH
- **Company Name**: NeuralTech GmbH
- **Investment Stage**: Series A
- **Industry Sector**: Artificial Intelligence
- **Geography**: Berlin, Germany
- **Founding Year**: 2022
- **Last Round Valuation**: €40,000,000
- **Last Round Date**: March 2024
- **Revenue Growth**: 180%
- **EBITDA**: €2,500,000
- **Cash Position**: €12,000,000
- **Burn Rate**: €200,000/month
- **Runway**: 60 months
- **Employee Count**: 65
- **Key Investors**: Merantix AI Fund III, LocalGlobe Ventures
- **Board Representation**: Observer rights
- **Valuation Method**: Recent round (DCF backup)
- **Market Size**: €150 billion TAM
- **Business Model**: SaaS subscription

### DeepMind Analytics AG
- **Company Name**: DeepMind Analytics AG
- **Investment Stage**: Seed
- **Industry Sector**: Machine Learning
- **Geography**: Munich, Germany
- **Founding Year**: 2023
- **Last Round Valuation**: €15,000,000
- **Last Round Date**: September 2024
- **Revenue Growth**: 250%
- **EBITDA**: €800,000
- **Cash Position**: €5,200,000
- **Burn Rate**: €120,000/month
- **Runway**: 43 months
- **Employee Count**: 28
- **Key Investors**: Merantix AI Fund III, Earlybird
- **Board Representation**: Board seat
- **Valuation Method**: Venture capital method
- **Market Size**: €75 billion TAM
- **Business Model**: Platform marketplace

### Quantum Computing Labs
- **Company Name**: Quantum Computing Labs
- **Investment Stage**: Series B
- **Industry Sector**: Deep Tech
- **Geography**: Zurich, Switzerland
- **Founding Year**: 2021
- **Last Round Valuation**: €60,000,000
- **Last Round Date**: June 2024
- **Revenue Growth**: 120%
- **EBITDA**: €3,800,000
- **Cash Position**: €18,000,000
- **Burn Rate**: €280,000/month
- **Runway**: 64 months
- **Employee Count**: 85
- **Key Investors**: Merantix AI Fund III, Index Ventures
- **Board Representation**: Board member
- **Valuation Method**: Multiples (revenue-based)
- **Market Size**: €200 billion TAM
- **Business Model**: Hardware + software licensing

## Risk Metrics
- **Portfolio Concentration**: 35% in top 3 companies
- **Sector Breakdown**: AI 45%, ML 30%, Deep Tech 25%
- **Stage Distribution**: Seed 20%, Series A 40%, Series B 40%
- **Geographic Focus**: Germany 60%, Switzerland 25%, Europe 15%

## Market Intelligence
- **Strategic Interest**: Company A has acquisition interest from Google
- **Competitive Position**: Market leader in AI analytics space
- **Key Risks**: Technology risk (35%), Market risk (25%), Team risk (40%)
- **Management Quality**: Strong technical team, experienced CEO
- **Exit Strategy**: IPO in 3-4 years
- **Exit Timeline**: 2027-2028 timeframe

## Compliance Information
- **GDPR Compliance**: All personal data processed with consent
- **Data Retention**: 7 years post-fund liquidation
- **Financial Regulation**: AIFMD compliant
- **Audit Trail**: Complete transaction history maintained
`;

export async function POST(request: NextRequest) {
  try {
    const { testType } = await request.json();

    if (testType === "comprehensive") {
      // Create test case
      const testCase = {
        id: "comprehensive-strategic-test",
        name: "Comprehensive Strategic Fields Test",
        description: "Test extraction of all 80 Tier 1 strategic fields",
        documentType: "fund_report" as const,
        inputMarkdown: COMPREHENSIVE_FUND_REPORT,
        expectedResults: {
          // Fund Performance Metrics (20 fields)
          companyName: "Merantix AI Fund III",
          fundNAV: 125400000,
          cumulativeDistributions: 45800000,
          cumulativeCalledCapital: 130000000,
          unfundedCommitment: 70000000,
          fundSize: 200000000,
          investmentPeriodEnd: "December 31, 2028",
          managementFeeRate: 2.0,
          carriedInterestRate: 20.0,
          hurdleRate: 8.0,
          fundCurrency: "EUR",
          reportingPeriod: "Q4 2024",
          fundAge: 1.25,
          deploymentRate: 65,
          portfolioCompanyCount: 12,
          irr: 28.5,
          moic: 1.45,
          tvpi: 1.45,
          dpi: 0.35,
          rvpi: 1.1,

          // Personal Portfolio Metrics (25 fields)
          personalCommitment: 5000000,
          personalCalledCapital: 3250000,
          personalNAV: 3750000,
          personalDistributions: 1250000,
          personalOwnershipPercentage: 2.5,
          personalMOIC: 1.38,
          personalIRR: 26.8,
          personalUnfunded: 1750000,
          capitalCallHistory: [
            {
              amount: 1500000,
              period: "Q1 2024",
              purpose: "Initial investment",
            },
            { amount: 750000, period: "Q2 2024", purpose: "Follow-on round" },
            {
              amount: 1000000,
              period: "Q3 2024",
              purpose: "Portfolio expansion",
            },
          ],
          distributionHistory: [
            { amount: 500000, period: "Q2 2024", type: "return of capital" },
            { amount: 750000, period: "Q4 2024", type: "capital gain" },
          ],
          carryAllocation: 150000,
          managementFeePaid: 65000,
          taxTreatment: "40% return of capital, 60% capital gain",
          investmentVehicle: "Personal",
          investmentDate: "January 15, 2023",
          initialInvestment: 2000000,
          followOnInvestments: 1250000,
          currentQuarterPerformance: 12.5,
          ytdPerformance: 28.3,
          sinceInceptionPerformance: 38.0,
          benchmarkComparison: "CAC 40 + 15.2%",
          liquidityTimeline: "3-5 years expected",
          exitPipelineValue: 2100000,
          portfolioConcentration: 45,

          // Portfolio Company Essentials (35 fields)
          industrySector: "Artificial Intelligence",
          investmentStage: "Series A",
          geography: "Berlin, Germany",
          foundingYear: 2022,
          lastRoundValuation: 40000000,
          lastRoundDate: "March 2024",
          revenueGrowth: 180,
          ebitda: 2500000,
          cashPosition: 12000000,
          burnRate: 200000,
          runway: 60,
          employeeCount: 65,
          keyInvestors: ["Merantix AI Fund III", "LocalGlobe Ventures"],
          boardRepresentation: "Observer rights",
          valuationMethod: "Recent round (DCF backup)",
          marketSize: 150000000000,
          businessModel: "SaaS subscription",
        },
        tags: ["comprehensive", "strategic", "all-tier-1"],
        priority: "high" as const,
        europeanComplianceRequired: true,
      };

      // Initialize testing framework
      const testingFramework = new ExtractionTestingFramework();

      // Execute the test
      const result = await testingFramework.executeTestCase(testCase);

      return NextResponse.json({
        success: true,
        result,
        testCase,
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid test type" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Extraction test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
