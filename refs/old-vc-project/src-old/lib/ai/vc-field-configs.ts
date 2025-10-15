/**
 * VC Fund Field Extraction Configurations
 *
 * Defines regex patterns and LLM prompts for each VC fund field
 */

import { FieldExtractionConfig } from "./robust-extractor";

export const VC_FUND_FIELD_CONFIGS: Record<string, FieldExtractionConfig> = {
  // Fund-level metrics
  fundSize: {
    fieldName: "Fund Size (Total Commitments)",
    regexPatterns: [
      /Total committed[:\s]*([0-9,]+\.?[0-9]*)\s*(?:kEUR|EUR|€|k€)/i,
      /Total commitments[:\s]*([0-9,]+\.?[0-9]*)\s*(?:kEUR|EUR|€|k€)/i,
      /Fund size[:\s]*([0-9,]+\.?[0-9]*)\s*(?:kEUR|EUR|€|k€)/i,
    ],
    llmPrompt: "Extract the total fund size or total commitments in EUR",
    expectedType: "number",
    validationRules: {
      min: 0,
      max: 1000000, // 1B EUR max
      required: true,
    },
  },

  fundNAV: {
    fieldName: "Fund NAV (Net Asset Value)",
    regexPatterns: [
      /Net asset value[:\s]*\(NAV\)[:\s]*([0-9,]+\.?[0-9]*)\s*(?:kEUR|EUR|€|k€)/i,
      /NAV[:\s]*([0-9,]+\.?[0-9]*)\s*(?:kEUR|EUR|€|k€)/i,
      /Net asset value[:\s]*([0-9,]+\.?[0-9]*)\s*(?:kEUR|EUR|€|k€)/i,
    ],
    llmPrompt: "Extract the Net Asset Value (NAV) of the fund in EUR",
    expectedType: "number",
    validationRules: {
      min: 0,
      max: 1000000,
      required: true,
    },
  },

  irr: {
    fieldName: "IRR (Internal Rate of Return)",
    regexPatterns: [
      /IRR[,\s]*(?:gross|net)[:\s]*([0-9]+\.?[0-9]*)\s*%/i,
      /Internal rate of return[:\s]*([0-9]+\.?[0-9]*)\s*%/i,
      /IRR[:\s]*([0-9]+\.?[0-9]*)\s*%/i,
    ],
    llmPrompt: "Extract the IRR (Internal Rate of Return) percentage",
    expectedType: "number",
    validationRules: {
      min: -100,
      max: 1000,
      required: true,
    },
  },

  moic: {
    fieldName: "MOIC (Multiple on Invested Capital)",
    regexPatterns: [
      /Multiple to investors[:\s]*([0-9]+\.?[0-9]*)\s*x/i,
      /MOIC[:\s]*([0-9]+\.?[0-9]*)\s*x/i,
      /Multiple on invested capital[:\s]*([0-9]+\.?[0-9]*)\s*x/i,
    ],
    llmPrompt: "Extract the MOIC (Multiple on Invested Capital) ratio",
    expectedType: "number",
    validationRules: {
      min: 0,
      max: 100,
      required: true,
    },
  },

  tvpi: {
    fieldName: "TVPI (Total Value to Paid-In Capital)",
    regexPatterns: [
      /Total value to paid-in capital[:\s]*\(TVPI\)[:\s]*([0-9]+\.?[0-9]*)\s*x/i,
      /TVPI[:\s]*([0-9]+\.?[0-9]*)\s*x/i,
      /Total value to paid-in[:\s]*([0-9]+\.?[0-9]*)\s*x/i,
    ],
    llmPrompt: "Extract the TVPI (Total Value to Paid-In Capital) ratio",
    expectedType: "number",
    validationRules: {
      min: 0,
      max: 100,
      required: true,
    },
  },

  dpi: {
    fieldName: "DPI (Distributions to Paid-In Capital)",
    regexPatterns: [
      /Distributions to paid-in capital[:\s]*\(DPI\)[:\s]*([0-9]+\.?[0-9]*)\s*x/i,
      /DPI[:\s]*([0-9]+\.?[0-9]*)\s*x/i,
      /Distributions to paid-in[:\s]*([0-9]+\.?[0-9]*)\s*x/i,
    ],
    llmPrompt: "Extract the DPI (Distributions to Paid-In Capital) ratio",
    expectedType: "number",
    validationRules: {
      min: 0,
      max: 100,
      required: false,
    },
  },

  rvpi: {
    fieldName: "RVPI (Residual Value to Paid-In Capital)",
    regexPatterns: [
      /Residual value to paid-in capital[:\s]*\(RVPI\)[:\s]*([0-9]+\.?[0-9]*)\s*x/i,
      /RVPI[:\s]*([0-9]+\.?[0-9]*)\s*x/i,
      /Residual value to paid-in[:\s]*([0-9]+\.?[0-9]*)\s*x/i,
    ],
    llmPrompt: "Extract the RVPI (Residual Value to Paid-In Capital) ratio",
    expectedType: "number",
    validationRules: {
      min: 0,
      max: 100,
      required: false,
    },
  },

  cumulativeCalledCapital: {
    fieldName: "Cumulative Called Capital",
    regexPatterns: [
      /Total capital calls[:\s]*\/\s*in\s*%\s*of\s*committed\s*capital[:\s]*([0-9,]+\.?[0-9]*)\s*(?:kEUR|EUR|€|k€)/i,
      /Capital calls[:\s]*([0-9,]+\.?[0-9]*)\s*(?:kEUR|EUR|€|k€)/i,
      /Called capital[:\s]*([0-9,]+\.?[0-9]*)\s*(?:kEUR|EUR|€|k€)/i,
    ],
    llmPrompt:
      "Extract the total capital calls or called capital amount in EUR",
    expectedType: "number",
    validationRules: {
      min: 0,
      max: 1000000,
      required: true,
    },
  },

  uncalledCapital: {
    fieldName: "Uncalled Capital",
    regexPatterns: [
      /Uncalled capital[:\s]*\/\s*in\s*%\s*of\s*committed\s*capital[:\s]*([0-9,]+\.?[0-9]*)\s*(?:kEUR|EUR|€|k€)/i,
      /Uncalled capital[:\s]*([0-9,]+\.?[0-9]*)\s*(?:kEUR|EUR|€|k€)/i,
      /Remaining capital[:\s]*([0-9,]+\.?[0-9]*)\s*(?:kEUR|EUR|€|k€)/i,
    ],
    llmPrompt: "Extract the uncalled or remaining capital amount in EUR",
    expectedType: "number",
    validationRules: {
      min: 0,
      max: 1000000,
      required: false,
    },
  },

  // Portfolio company fields
  portfolioCompanies: {
    fieldName: "Portfolio Companies",
    regexPatterns: [
      /\| ([A-Za-z\s]+(?:GmbH|Ltd|Inc|Corp|LLC|AG|KG|GmbH & Co\. KG))\s+\|/g,
      /Company Name[:\s]*([A-Za-z\s]+(?:GmbH|Ltd|Inc|Corp|LLC|AG|KG))/gi,
      /Portfolio[:\s]*([A-Za-z\s]+(?:GmbH|Ltd|Inc|Corp|LLC|AG|KG))/gi,
    ],
    llmPrompt: "Extract all portfolio company names from the document",
    expectedType: "array",
    validationRules: {
      required: true,
    },
  },

  // Company name extraction
  companyName: {
    fieldName: "Company/Fund Name",
    regexPatterns: [
      /(?:Fund|Fund II|Fund III|Fund IV|Fund V|Fund VI|Fund VII|Fund VIII|Fund IX|Fund X)\s+([A-Za-z\s]+)/i,
      /Fund[:\s]*([A-Za-z\s]+)/i,
      /Company[:\s]*([A-Za-z\s]+)/i,
    ],
    llmPrompt: "Extract the fund or company name",
    expectedType: "string",
    validationRules: {
      required: true,
    },
  },
};

/**
 * Get field configuration by name
 */
export function getFieldConfig(
  fieldName: string
): FieldExtractionConfig | null {
  return VC_FUND_FIELD_CONFIGS[fieldName] || null;
}

/**
 * Get all field configurations
 */
export function getAllFieldConfigs(): Record<string, FieldExtractionConfig> {
  return VC_FUND_FIELD_CONFIGS;
}

/**
 * Get field names for a specific document type
 */
export function getFieldsForDocumentType(documentType: string): string[] {
  switch (documentType) {
    case "fund_quarterly_report":
      return [
        "fundSize",
        "fundNAV",
        "irr",
        "moic",
        "tvpi",
        "dpi",
        "rvpi",
        "cumulativeCalledCapital",
        "uncalledCapital",
        "portfolioCompanies",
        "companyName",
      ];
    case "lp_capital_account":
      return [
        "companyName",
        // Add LP-specific fields here
      ];
    default:
      return Object.keys(VC_FUND_FIELD_CONFIGS);
  }
}
