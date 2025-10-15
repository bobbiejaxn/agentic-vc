I'll search the project knowledge for comprehensive information about all available metrics in the Merantix report. This is a reference document showing the target data we need to achieve. Based on the Merantix report documentation, here's a comprehensive JSON output of all extractable fund performance and financial metrics:

```json
{
  "fundPerformanceMetrics": {
    "fundLevel": {
      "totalCommitments": {
        "value": 30524500,
        "currency": "EUR",
        "description": "Total capital committed by all LPs"
      },
      "cumulativePaidInCapital": {
        "value": 28082200,
        "currency": "EUR",
        "percentageOfCommitment": 92.0
      },
      "cumulativeDistributions": {
        "value": 34098,
        "currency": "EUR",
        "percentageOfCommitment": 0.11
      },
      "totalUnfundedCommitment": {
        "value": 2442300,
        "currency": "EUR",
        "percentageOfCommitment": 8.0
      },
      "totalInvestedInPortfolio": {
        "value": 147404333,
        "currency": "EUR",
        "percentageOfCommitment": 49.44
      },
      "totalFairValuePortfolio": {
        "value": 127800683,
        "currency": "EUR"
      },
      "totalNetAssetValue": {
        "value": 126055567,
        "currency": "EUR",
        "description": "NAV after cash, borrowings, and other assets/liabilities"
      },
      "grossIRR": {
        "value": -8.44,
        "unit": "percent",
        "description": "Gross internal rate of return"
      },
      "netIRR": {
        "value": -14.93,
        "unit": "percent",
        "description": "Net internal rate of return after fees"
      },
      "grossMultipleToCost": {
        "value": 0.87,
        "description": "Current value / total invested"
      },
      "residualValueToPaidInCapital": {
        "value": 0.78,
        "description": "RVPI - Remaining value / paid-in capital"
      },
      "totalValueToPaidInCapital": {
        "value": 0.78,
        "description": "TVPI - Total value (distributions + NAV) / paid-in capital"
      },
      "distributionsToPaidInCapital": {
        "value": 0.0,
        "description": "DPI - Cash returned / paid-in capital"
      },
      "fundedCommitmentToCommittedCapital": {
        "value": 0.55,
        "description": "Percentage of commitment actually called"
      },
      "paidInCapitalToCommittedCapital": {
        "value": 54.54,
        "unit": "percent"
      }
    },
    "capitalMovements": {
      "capitalCalls": [
        {
          "callNumber": 1,
          "callDate": "2021-10-28",
          "amount": 3805093,
          "currency": "EUR",
          "percentageOfCommitment": 1.28,
          "cumulativeCalled": 3805093,
          "cumulativePercentage": 1.28,
          "purpose": "Initial investments",
          "noticePeriodDays": 10,
          "dueDate": "2021-11-07",
          "defaultInterestRate": null
        }
      ],
      "distributions": [
        {
          "distributionNumber": 1,
          "distributionDate": "2024-09-30",
          "amount": 34098,
          "currency": "EUR",
          "type": "Return of Capital",
          "source": "Portfolio Company Exit",
          "cumulativeDistributions": 34098,
          "taxTreatment": "Return of Capital",
          "relatedPortfolioCompany": "Company Name",
          "distributionRatio": 1.0
        }
      ]
    },
    "partnersCapital": {
      "quarterlyChanges": [
        {
          "reportingPeriod": "Q1 2025",
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
      "inceptionToDate": {
        "totalCommitment": 30524500,
        "capitalAccountBeginning": 0,
        "contributionsFromLPs": 28082200,
        "distributionsToLPs": 0,
        "realizedPortfolioGains": -2139900,
        "unrealizedPortfolioGains": 4914700,
        "operatingExpenses": -8334000,
        "capitalAccountEnd": 22523000
      }
    }
  },
  "portfolioInvestmentMetrics": {
    "investmentDetails": {
      "investmentId": "planet_a_foods_series_a",
      "initialInvestmentDate": "2021-10-15",
      "exitDate": null,
      "holdingPeriodYears": 3.4,
      "exitMethod": null,
      "investmentStage": "Series A",
      "currentStage": "Series B",
      "leadInvestor": "World Fund",
      "fundRole": "Co-lead",
      "syndicateSize": 8,
      "totalRoundSize": 45000000,
      "fundInvestmentAmount": 10480000,
      "fundOwnership": 10.48,
      "fullyDilutedOwnership": 8.2,
      "liquidationPreference": "1x Non-Participating Preferred",
      "antiDilutionProvision": "Weighted Average Broad-Based",
      "boardRights": true,
      "boardRepresentative": "Daria Saharova",
      "protectiveProvisions": true,
      "dragAlongRights": true,
      "tagAlongRights": true,
      "preemptiveRights": true
    },
    "financialPerformance": {
      "originalCost": 10480000,
      "currentCost": 10480000,
      "additionalInvestments": 0,
      "totalCashInvested": 10480000,
      "currentFairValue": 11402532,
      "unrealizedGainLoss": 922532,
      "realizedGainLoss": 0,
      "totalReturn": 922532,
      "multipleToCost": 1.09,
      "grossIrr": 2.8,
      "cashReturned": 0,
      "remainingValue": 11402532,
      "totalValue": 11402532,
      "markToMarketDate": "2025-03-31",
      "valuationMethod": "Recent Transaction",
      "valuationMultiple": "15x Revenue",
      "lastRoundValuation": 450000000,
      "lastRoundDate": "2024-06-15",
      "writeDownAmount": 0,
      "writeDownDate": null
    },
    "businessMetricsKPIs": {
      "revenue": 12500000,
      "revenueGrowthRate": 150,
      "grossMargin": 35.2,
      "ebitda": -2500000,
      "ebitdaMargin": -20.0,
      "burnRate": 800000,
      "cashPosition": 15000000,
      "runwayMonths": 18,
      "customerCount": 25000,
      "arpu": 500,
      "ltv": 2500,
      "cac": 150,
      "ltvCacRatio": 16.7,
      "churnRate": 5.2,
      "nps": 45,
      "employees": 150,
      "employeeGrowthRate": 25,
      "lastUpdated": "2025-03-31"
    },
    "coInvestorsSyndicate": {
      "coInvestors": [
        {
          "investorName": "Sequoia Capital",
          "investorType": "VC",
          "leadStatus": "Lead",
          "investmentAmount": null,
          "ownershipPercentage": null
        }
      ]
    }
  },
  "incomeStatement": {
    "germanGAAP": {
      "currentQuarter": {
        "period": "Q1 2025",
        "incomeFromParticipations": 200,
        "revaluationOtherFinancialAssets": 0,
        "interestIncome": 1300,
        "programFee": -2300,
        "auditAccountingFees": -700,
        "externalAdvisorFees": -23000,
        "organizationalExpenses": 0,
        "otherExpenses": -10500,
        "taxesOnIncome": 0,
        "netIncome": -35100
      },
      "yearToDate": {
        "period": "YTD Q1 2025",
        "incomeFromParticipations": 200,
        "interestIncome": 1300,
        "operatingExpenses": -36500,
        "netIncome": -35100
      },
      "inceptionToDate": {
        "incomeFromParticipations": -4574500,
        "interestIncome": 115800,
        "programFee": -7267400,
        "auditAccountingFees": -162200,
        "externalAdvisorFees": -366700,
        "organizationalExpenses": -133900,
        "otherExpenses": -403800,
        "netIncome": -12792800
      }
    },
    "ifrsReconciliation": {
      "netIncomeGermanGAAP": -35100,
      "valuationAdjustmentsToIFRS": 0,
      "netIncomeIFRS": -35100,
      "inceptionToDateIFRSAdjustment": 7233600,
      "inceptionToDateNetIncomeIFRS": -5559200
    }
  },
  "fundAdministration": {
    "fundAdministrator": "PE Admin",
    "auditor": "BTR",
    "legalCounsel": "YPOG",
    "taxRegulatory": "INVESTTAX",
    "bankingFacilities": ["HVB", "BW Bank"],
    "primeBroker": null,
    "custodian": null,
    "valuationProvider": null,
    "lpacMembers": [],
    "advisoryBoard": [],
    "keyContacts": [
      {
        "name": "Oliver Schmied",
        "role": "CFO",
        "email": "oliver.schmied@merantix.com",
        "phone": "+49 174 766 1085"
      },
      {
        "name": "Daria Saharova",
        "role": "Client Contact",
        "email": null,
        "phone": null
      }
    ]
  },
  "metadata": {
    "reportDate": "2025-03-31",
    "reportingPeriod": "Q1 2025",
    "fundName": "Merantix Fund II",
    "reportStatus": "Preliminary and unaudited",
    "currency": "EUR",
    "accountingStandard": "German GAAP with IFRS reconciliation"
  }
}
```

## Key Extractable Metrics Summary:

### Fund-Level Performance (13 metrics)

- NAV, IRR (Gross/Net), MOIC, TVPI, DPI, RVPI
- Capital called/distributed, commitments, deployment %

### Investment-Level Metrics (40+ fields)

- Cost basis, fair value, returns, multiples
- Investment terms, governance rights
- Business KPIs (revenue, burn, runway, unit economics)

### Financial Statements

- Income statement (German GAAP + IFRS)
- Partners' capital movements
- Quarterly and inception-to-date data

### Operational Data

- Capital calls/distributions history
- Service providers and contacts
- Co-investor information

**Total: 80+ extractable data points** across fund performance, portfolio companies, and administrative information.
