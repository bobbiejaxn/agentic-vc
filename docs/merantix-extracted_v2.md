# Test Data README — Fund-Level Metrics Extraction Fixture

This document provides a structured, realistic test fixture for validating extraction, parsing, and transformation logic on the [Merantix Capital Q1 2025 Report (OCR version)](<Merantix Capital Q1 2025 Report_byMistral.md>). The OCR version is derived from the original [Merantix Capital Q1 2025 Report PDF](<Q1_25 Merantix Fund II Investor Reporting + Financial Statements Preliminary and unaudited.pdf>).

---

## 1. Purpose

This file is designed to:

- Serve as a **test fixture** for automated and manual validation of extraction pipelines.
- Represent both **portfolio-level** and **fund-level** metrics essential for LP reporting and portfolio management.
- Provide a realistic, semantically rich example for LLM-based and vector-based extraction systems.

---

## 2. Usage Guidelines

### For Developers

- Use this file as input for automated tests to verify that your code can read, parse, and interpret extracted data using only LLM/context-aware and vector-based approaches.
- Example test cases:
  - Can your system extract company names, investment amounts, and dates using semantic or vector search?
  - Are fund-level metrics (NAV, IRR, TVPI, DPI, etc.) correctly identified?
  - Are all expected fields present and correctly typed, as determined by LLM or embedding-based validation?
  - Does your code gracefully handle missing or null values, using context-aware logic?

### For LLMs and Data Validation

- Use this file to prompt or fine-tune language models for understanding the structure and semantics of investment data.
- Validate that LLM outputs match the expected format using only context-aware, embedding-based, or RAG techniques.

---

## 3. Extraction & Validation Requirements

**Strictly adhere to the following:**

- Use only LLM/context-aware chunking https://www.anthropic.com/news/contextual-retrieval, embedding, vector store, vector/semantic search, or Retrieval-Augmented Generation (RAG).
- **No language-specific parsing, regular expressions, or brittle pattern matching.**
- All prompts/queries for extraction, search, or validation must be centrally defined and managed—never hardcoded in multiple places.
- Prompts/queries must be specific but generalizable to similar reports, not tailored to this specific document.
- Code files should not exceed 400–500 lines for maintainability.
- Include concise comments to help LLMs understand code intent.
- LLMs must not perform calculations directly; all data should be normalized first, with calculations performed only after normalization.
- Calculations must be performed server-side, not on the frontend. The frontend should focus on querying the correct data.

# db data model: [schema-db](../schema-db.md)

use the existing db, if not db establisehd yet then follow it.

- Core Entities:

Fund - The master fund entity with identifying information
FundPerformance - Point-in-time performance metrics
CapitalActivity - Capital calls and distributions tracking
QuarterlyPerformance - Historical quarterly performance data
PortfolioCompany - Individual company information
Investment - Junction table linking funds to portfolio companies with investment detailsual funding events for portfolio companies
CompanyMetrics - Company-specific performance metrics

Key Relationships:

A Fund can have multiple portfolio companies (through investments)
Each Fund tracks multiple performance snapshots over time
Portfolio companies can have multiple funding rounds
The Investment entity serves as the junction between Fund and PortfolioCompany, capturing investment-specific details

---

## 4. What to Test

- **Field Presence:** All expected fields (e.g., name, sector, stage, investmentAmountUSD, etc.) are present, as determined by semantic or vector-based search.
- **Data Types:** Fields have correct types (numbers, strings, nulls), validated using LLM or embedding-based reasoning.
- **Value Accuracy:** Values match the original report (as much as possible, given OCR limitations), as determined by semantic similarity.
- **Edge Cases:** Missing, null, or unexpected values are handled gracefully using context-aware or LLM-based logic.
- **Fund-Level Metrics:** Fund-level performance and LP-relevant metrics are correctly extracted.

---

## 5. Additional Notes

- This file is for **testing and validation only**. Do not use for production or reporting.
- If the source report structure changes, update this file to keep tests relevant.
- **Reminder:** Only LLM/context-aware chunking, embedding, vector/semantic search, and RAG approaches are allowed. No regex or brittle parsing.
- **Critical Insight:**
- Always validate the complete user journey—from raw input through processing to extraction. Testing only isolated components or pre-processed data may miss integration issues that surface in real-world production. End-to-end validation is essential to catch critical errors.

# Fund-Level Metrics

## Fund Overview

```json
{
  "fundId": "merantix_fund_ii_2019",
  "fundName": "Merantix Fund II GmbH & Co. KG",
  "fundShortName": "Merantix Fund II",
  "managerName": "Merantix Capital Management GmbH",
  "legalForm": "GmbH & Co. KG",
  "domicile": "Germany",
  "fundCurrency": "EUR",
  "vintageYear": 2019,
  "fundNumber": "II",
  "fundSeries": "Merantix Fund",
  "reportingDate": "2025-03-31",
  "lastUpdated": "2025-03-31",
  "dataSource": "Merantix Fund II Q1 2025 Report"
}
```

## Fund Performance Summary

```json
{
  "reportingDate": "2025-03-31",
  "nav": 22371100,
  "navAdjusted": 22523000,
  "navCurrency": "EUR",
  "totalCommitments": 30524500,
  "totalCapitalCalls": 28082200,
  "totalDistributions": 0,
  "cumulativeDistributions": 0,
  "uncalledCapital": 517300,
  "cashAtBank": 22000,
  "otherAssetsLiabilities": 129900,
  "irrGross": 5.4,
  "irrNet": null,
  "grossInvestmentMultiple": 1.3,
  "tvpi": 0.8,
  "dpi": 0.0,
  "rvpi": 0.8,
  "picc": 0.92,
  "totalInvestedInPortfolio": 21597300,
  "totalAllocatedToPortfolio": 20125300,
  "unrealizedValue": 22371100,
  "realizedValue": 0,
  "totalValue": 22371100,
  "fundDeploymentRatio": 92.0,
  "remainingCommitmentPercentage": 1.7
}
```

## Capital Activity Summary

```json
{
  "capitalCallsSummary": {
    "totalCalls": 28082200,
    "percentageOfCommitment": 92.0,
    "pendingCalls": 0,
    "uncalledAmount": 517300,
    "uncalledPercentage": 1.7,
    "remainingAvailableDrawdown": 517300
  },
  "distributionsSummary": {
    "totalDistributions": 0,
    "cumulativeDistributions": 0,
    "distributionFrequency": "None to date",
    "lastDistributionDate": null
  }
}
```

## Historical Fund Performance (Quarterly Changes in Partners' Capital)

```json
{
  "quarterlyPerformance": [
    {
      "quarter": "Q4 2019",
      "totalCommitment": 13500000,
      "capitalAccountBeginning": 0,
      "otherContributions": 0,
      "contributionsFromLPs": 0,
      "distributionsToLPs": 0,
      "realizedPortfolioGains": 0,
      "unrealizedPortfolioGains": 0,
      "operatingExpenses": -148300,
      "capitalAccountEnd": -148300
    },
    {
      "quarter": "Q1 2020",
      "totalCommitment": 13500000,
      "capitalAccountBeginning": -148300,
      "otherContributions": 0,
      "contributionsFromLPs": 1956400,
      "distributionsToLPs": 0,
      "realizedPortfolioGains": 0,
      "unrealizedPortfolioGains": 0,
      "operatingExpenses": -387300,
      "capitalAccountEnd": 1420800
    },
    {
      "quarter": "Q1 2025",
      "totalCommitment": 30524500,
      "capitalAccountBeginning": 22558100,
      "otherContributions": 0,
      "contributionsFromLPs": 0,
      "distributionsToLPs": 0,
      "realizedPortfolioGains": 0,
      "unrealizedPortfolioGains": 1500,
      "operatingExpenses": -36500,
      "capitalAccountEnd": 22523000
    }
  ],
  "sinceInception": {
    "totalCommitment": 30524500,
    "totalContributions": 28082200,
    "totalDistributions": 0,
    "totalRealizedGains": -2139900,
    "totalUnrealizedGains": 4914700,
    "totalOperatingExpenses": -8334000,
    "finalCapitalAccount": 22523000
  }
}
```

# Portfolio-Level Data (Individual Investments)

```json
[
  {
    "name": "OVOM Care GmbH",
    "normalizedName": "ovom care",
    "sector": "Fertility Tech",
    "stage": "Seed",
    "status": "active",
    "totalInvested": 1536400,
    "ownership": 9.5,
    "dataQuality": 0.95,
    "lastUpdated": "2025-03-31",
    "investmentAmountUSD": 1536400,
    "investmentCurrency": "EUR",
    "exchangeRate": 1.0,
    "currentValuation": 21200000,
    "unrealizedValue": 2018900,
    "totalValue": 2018900,
    "realizedValue": 0,
    "moic": 1.3,
    "irr": 18.2,
    "initialInvestmentDate": "2023-03",
    "headquarters": "Germany",
    "description": "OVŌM Care redefines how reproductive care is brought to patients by combining modern in-person care with advanced AI-based technology.",
    "competitivePosition": "AI-based fertility technology platform",
    "employeeCount": null,
    "revenue": null,
    "revenueGrowthRate": null,
    "website": null,
    "fundingRounds": [
      {
        "round": "Seed",
        "date": "2023-03",
        "valuation": 9000000,
        "amount": 1536400
      }
    ],
    "keyMetrics": {
      "fairValueDelta": 0.0,
      "totalGainLoss": 482600,
      "grossMultipleToCost": 1.3
    },
    "boardMembers": null,
    "boardRepresentation": null,
    "exitDate": null,
    "exitType": null,
    "fullyDilutedOwnership": 9.5,
    "dataSource": "Merantix Fund II Q1 2025 Report",
    "notes": "Currently progressing on clinic opening in Portugal. Preparing interim financing round later this year. Founder Felicia von Reden featured in Forbes 30 under 30."
  },
  {
    "name": "Ficus Health GmbH",
    "normalizedName": "ficus health",
    "sector": "Medical Records",
    "stage": "Pre-seed",
    "status": "active",
    "totalInvested": 502300,
    "ownership": null,
    "dataQuality": 0.9,
    "lastUpdated": "2025-03-31",
    "investmentAmountUSD": 502300,
    "investmentCurrency": "EUR",
    "exchangeRate": 1.0,
    "currentValuation": null,
    "unrealizedValue": 933400,
    "totalValue": 933400,
    "realizedValue": 0,
    "moic": 1.9,
    "irr": 245.6,
    "initialInvestmentDate": "2024-07",
    "headquarters": "Germany",
    "description": null,
    "competitivePosition": "Medical records technology",
    "employeeCount": null,
    "revenue": null,
    "revenueGrowthRate": null,
    "website": null,
    "fundingRounds": [
      {
        "round": "Pre-seed",
        "date": "2024-07",
        "valuation": null,
        "amount": 502300
      }
    ],
    "keyMetrics": {
      "fairValueDelta": 0.0,
      "totalGainLoss": 431100,
      "grossMultipleToCost": 1.9
    },
    "boardMembers": null,
    "boardRepresentation": null,
    "exitDate": null,
    "exitType": null,
    "fullyDilutedOwnership": null,
    "dataSource": "Merantix Fund II Q1 2025 Report",
    "notes": "Incorporation date: July 2024"
  },
  {
    "name": "MX Healthcare GmbH",
    "normalizedName": "mx healthcare",
    "sector": "Radiology",
    "stage": "Series A",
    "status": "active",
    "totalInvested": 2405900,
    "ownership": 7.1,
    "dataQuality": 0.95,
    "lastUpdated": "2025-03-31",
    "investmentAmountUSD": 2405900,
    "investmentCurrency": "EUR",
    "exchangeRate": 1.0,
    "currentValuation": 24400000,
    "unrealizedValue": 1586600,
    "totalValue": 1586600,
    "realizedValue": 0,
    "moic": 0.7,
    "irr": -12.7,
    "initialInvestmentDate": "2020-05",
    "headquarters": "Germany",
    "description": "Better breast cancer screening should be a universal offering to every woman in the world. Vara's AI-powered software platform, created with screening radiologists in Germany is making breast cancer screening more effective, more measurable, and more accessible for everyone, everywhere.",
    "competitivePosition": "AI-powered breast cancer screening platform",
    "employeeCount": null,
    "revenue": 300000,
    "revenueGrowthRate": null,
    "website": null,
    "fundingRounds": [
      {
        "round": "Series A",
        "date": "2020-05",
        "valuation": 16000000,
        "amount": 2405900
      }
    ],
    "keyMetrics": {
      "fairValueDelta": 0.0,
      "totalGainLoss": -819300,
      "grossMultipleToCost": 0.7,
      "adoptionRate": "84-86%",
      "customersOnboarded": 20
    },
    "boardMembers": null,
    "boardRepresentation": null,
    "exitDate": null,
    "exitType": null,
    "fullyDilutedOwnership": 7.1,
    "dataSource": "Merantix Fund II Q1 2025 Report",
    "notes": "Vara grew German ARR past €300k, secured €8M fresh funding from JRI Investment in April 2025. Restructuring reduced headcount by half. On track to reach €1M ARR by year-end."
  },
  {
    "name": "Libra Technology GmbH",
    "normalizedName": "libra technology",
    "sector": "LegalTech",
    "stage": "Pre-seed",
    "status": "active",
    "totalInvested": 1008400,
    "ownership": 9.7,
    "dataQuality": 0.95,
    "lastUpdated": "2025-03-31",
    "investmentAmountUSD": 1008400,
    "investmentCurrency": "EUR",
    "exchangeRate": 1.0,
    "currentValuation": 15500000,
    "unrealizedValue": 1500300,
    "totalValue": 1500300,
    "realizedValue": 0,
    "moic": 1.5,
    "irr": 57.2,
    "initialInvestmentDate": "2023-11",
    "headquarters": "Germany",
    "description": "Libra, the scales of justice, stand for justice and fairness. But in today's world, more people have access to the internet than access to justice. That's why Libra is building an AI claims factory to empower every claim owner to make full use of their rights.",
    "competitivePosition": "AI-powered legal claims processing platform",
    "employeeCount": null,
    "revenue": 400000,
    "revenueGrowthRate": 60,
    "website": null,
    "fundingRounds": [
      {
        "round": "Pre-seed",
        "date": "2023-11",
        "valuation": 9000000,
        "amount": 1008400
      }
    ],
    "keyMetrics": {
      "fairValueDelta": 0.0,
      "totalGainLoss": 491900,
      "grossMultipleToCost": 1.5,
      "arr": 400000,
      "monthlyGrowthRate": 60
    },
    "boardMembers": null,
    "boardRepresentation": null,
    "exitDate": null,
    "exitType": null,
    "fullyDilutedOwnership": 9.7,
    "dataSource": "Merantix Fund II Q1 2025 Report",
    "notes": "Libra v2 launched with new legal-focused LLM 'Noxtua'. Grew 60% MoM since Sept-24, currently at €400K ARR. Seed fundraising of €5–10M planned for early fall, targeting €20–40M valuation after reaching €1M ARR."
  },
  {
    "name": "The Why Company GmbH",
    "normalizedName": "the why company",
    "sector": "Analytics",
    "stage": "Exit",
    "status": "exited",
    "totalInvested": 2974200,
    "ownership": null,
    "dataQuality": 0.85,
    "lastUpdated": "2025-03-31",
    "investmentAmountUSD": 2974200,
    "investmentCurrency": "EUR",
    "exchangeRate": 1.0,
    "currentValuation": 0,
    "unrealizedValue": 0,
    "totalValue": 1000000,
    "realizedValue": 1000000,
    "moic": 0.3,
    "irr": null,
    "initialInvestmentDate": "2020-08",
    "headquarters": "Germany",
    "description": null,
    "competitivePosition": "Analytics platform",
    "employeeCount": null,
    "revenue": null,
    "revenueGrowthRate": null,
    "website": null,
    "fundingRounds": [
      {
        "round": "Incorporation",
        "date": "2020-08",
        "valuation": null,
        "amount": 2974200
      }
    ],
    "keyMetrics": {
      "fairValueDelta": 0.0,
      "totalGainLoss": null,
      "grossMultipleToCost": 0.3
    },
    "boardMembers": null,
    "boardRepresentation": null,
    "exitDate": null,
    "exitType": "Exit",
    "fullyDilutedOwnership": null,
    "dataSource": "Merantix Fund II Q1 2025 Report",
    "notes": "Company has exited. Realized value of €1M from total investment of €2.97M."
  },
  {
    "name": "Graph Therapeutics FlexCo",
    "normalizedName": "graph therapeutics",
    "sector": "TechBio",
    "stage": "Pre-seed",
    "status": "active",
    "totalInvested": 500000,
    "ownership": null,
    "dataQuality": 0.9,
    "lastUpdated": "2025-03-31",
    "investmentAmountUSD": 500000,
    "investmentCurrency": "EUR",
    "exchangeRate": 1.0,
    "currentValuation": null,
    "unrealizedValue": 758900,
    "totalValue": 758900,
    "realizedValue": 0,
    "moic": 1.5,
    "irr": 87.6,
    "initialInvestmentDate": "2024-07",
    "headquarters": "Germany",
    "description": null,
    "competitivePosition": "TechBio platform",
    "employeeCount": null,
    "revenue": null,
    "revenueGrowthRate": null,
    "website": null,
    "fundingRounds": [
      {
        "round": "Pre-seed",
        "date": "2024-07",
        "valuation": null,
        "amount": 500000
      }
    ],
    "keyMetrics": {
      "fairValueDelta": 0.0,
      "totalGainLoss": 258900,
      "grossMultipleToCost": 1.5
    },
    "boardMembers": null,
    "boardRepresentation": null,
    "exitDate": null,
    "exitType": null,
    "fullyDilutedOwnership": null,
    "dataSource": "Merantix Fund II Q1 2025 Report",
    "notes": "Incorporation date: July 2024"
  },
  {
    "name": "Hoshii",
    "normalizedName": "hoshii",
    "sector": "AI",
    "stage": "Unknown",
    "status": "active",
    "totalInvested": null,
    "ownership": null,
    "dataQuality": 0.3,
    "lastUpdated": "2025-03-31",
    "investmentAmountUSD": null,
    "investmentCurrency": "EUR",
    "exchangeRate": 1.0,
    "currentValuation": null,
    "unrealizedValue": null,
    "totalValue": null,
    "realizedValue": null,
    "moic": null,
    "irr": null,
    "initialInvestmentDate": null,
    "headquarters": null,
    "description": null,
    "competitivePosition": null,
    "employeeCount": null,
    "revenue": null,
    "revenueGrowthRate": null,
    "website": null,
    "fundingRounds": null,
    "keyMetrics": null,
    "boardMembers": null,
    "boardRepresentation": null,
    "exitDate": null,
    "exitType": null,
    "fullyDilutedOwnership": null,
    "dataSource": "Merantix Fund II Q1 2025 Report",
    "notes": "Portfolio company mentioned in context of team member Matilda Glynn-Henley's evaluation work. No detailed financial information provided in this report."
  }
]
```

## Testing Guidelines for Fund-Level Metrics

When testing your extraction system, ensure it can:

1. **Extract Fund Overview Data**: Basic fund identification, structure, and terms
2. **Parse Performance Metrics**: NAV, IRR, multiples (TVPI, DPI, RVPI, PICC)
3. **Capture Capital Activity**: Capital calls, distributions, deployment ratios
4. **Handle Historical Data**: Quarterly progression of fund performance
5. **Validate Data Types**: Ensure proper handling of currencies, percentages, dates
6. **Process Missing Values**: Handle null/empty fields appropriately
7. **Semantic Understanding**: Extract contextual information like fund status, investment focus, etc.

## Key LP-Relevant Metrics Extracted:

- **NAV (Net Asset Value)**: €22.37M as of Q1 2025
- **Total Commitments**: €30.52M
- **Deployment Rate**: 92% of commitments called
- **Fund Performance**: 5.4% gross IRR, 0.8x TVPI
- **Cash Position**: €22K remaining cash
- **Portfolio Composition**: 7 active investments + 1 exit
- **Fund Maturity**: Vintage 2019, approaching mid-stage of fund lifecycle
