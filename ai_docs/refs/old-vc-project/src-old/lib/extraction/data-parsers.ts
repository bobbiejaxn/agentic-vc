/**
 * VC Portfolio Data Parsers
 * Specialized parsing logic for VC portfolio reports including
 * fund information, investment data, and performance metrics.
 */

import type {
  TextExtractionResult,
  ImageExtractionResult,
  ValidationResult,
  VCPortfolioExtraction,
  PortfolioSector,
  VCInvestment,
} from "./types/extraction";

/**
 * Parse text and image extraction results into VC portfolio data
 */
export async function parseVCPortfolioData(
  textResult: TextExtractionResult,
  _imageResult: ImageExtractionResult,
  _validations: ValidationResult[]
): Promise<VCPortfolioExtraction> {
  const fullText = extractFullText(textResult);

  // Extract fund-level information
  const fundName = extractFundName(fullText);
  const vintage = extractVintage(fullText);
  const fundSize = extractFundSize(fullText);
  const currency = extractCurrency(fullText);

  // Extract portfolio summary
  const portfolioSummary = extractPortfolioSummary(fullText);

  // Extract individual investments
  const investments = extractInvestments(fullText);

  // Extract performance metrics
  const performance = extractPerformanceMetrics(fullText);

  // Extract top investments
  const topInvestments = extractTopInvestments(fullText);

  return {
    fundName,
    vintage,
    fundSize,
    currency,
    portfolioSummary,
    investments,
    topInvestments,
    performance,
  };
}

/**
 * Extract full text content from extraction results
 */
function extractFullText(textResult: TextExtractionResult): string {
  return (
    textResult.content + " " + textResult.pages.map((p) => p.content).join(" ")
  );
}

/**
 * Extract fund name from text
 */
function extractFundName(text: string): string | undefined {
  const fundPatterns = [
    /fund[:\s]+([A-Z][a-zA-Z\s&\.,-]+(?:Fund|Capital|Ventures|Partners|Investments))/gi,
    /([A-Z][a-zA-Z\s&\.,-]+(?:Fund|Capital|Ventures|Partners|Investments)[\s\.,]*\d*)/gi,
    /portfolio[:\s]+([A-Z][a-zA-Z\s&\.,-]+(?:Fund|Portfolio))/gi,
  ];

  for (const pattern of fundPatterns) {
    const match = pattern.exec(text);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return undefined;
}

/**
 * Extract vintage year from text
 */
function extractVintage(text: string): string | undefined {
  const vintagePattern = /(?:vintage|year|established|founded)[:\s]*(\d{4})/gi;
  const match = vintagePattern.exec(text);
  return match ? match[1] : undefined;
}

/**
 * Extract fund size from text
 */
function extractFundSize(text: string): number | undefined {
  const sizePatterns = [
    /fund\s+size[:\s]*[€$]?(\d+(?:[,.]\d+)?)\s*(?:million|million|billion|bn|m|b)?/gi,
    /total\s+commitments?[:\s]*[€$]?(\d+(?:[,.]\d+)?)\s*(?:million|million|billion|bn|m|b)?/gi,
    /committed\s+capital[:\s]*[€$]?(\d+(?:[,.]\d+)?)\s*(?:million|million|billion|bn|m|b)?/gi,
  ];

  for (const pattern of sizePatterns) {
    const match = pattern.exec(text);
    if (match && match[1]) {
      let amount = parseFloat(match[1].replace(/,/g, ""));
      const unit = match[2]?.toLowerCase();

      if (unit?.includes("billion") || unit === "bn") {
        amount *= 1000000000;
      } else if (unit?.includes("million") || unit === "m") {
        amount *= 1000000;
      }

      return amount;
    }
  }

  return undefined;
}

/**
 * Extract currency from text
 */
function extractCurrency(text: string): string | undefined {
  const currencyPattern = /([€$£¥])(?:\s*[\d.,]+|$)/g;
  const currencies = ["€", "$", "£", "¥"];

  for (const match of text.matchAll(currencyPattern)) {
    if (currencies.includes(match[1])) {
      return match[1];
    }
  }

  return undefined;
}

/**
 * Extract portfolio summary from text
 */
function extractPortfolioSummary(text: string): Record<string, unknown> {
  const totalValue = extractTotalValue(text);
  const totalInvestments = extractTotalInvestments(text);
  const sectors = extractSectors(text);

  if (totalValue || totalInvestments || sectors.length > 0) {
    return {
      totalValue,
      totalInvestments,
      sectors,
    };
  }

  return undefined;
}

/**
 * Extract total portfolio value from text
 */
function extractTotalValue(text: string): number | undefined {
  const valuePatterns = [
    /total\s+(?:portfolio\s+)?value[:\s]*[€$]?(\d+(?:[,.]\d+)?)\s*(?:million|million|billion|bn|m|b)?/gi,
    /nav[:\s]*[€$]?(\d+(?:[,.]\d+)?)\s*(?:million|million|billion|bn|m|b)?/gi,
    /gross\s+asset\s+value[:\s]*[€$]?(\d+(?:[,.]\d+)?)\s*(?:million|million|billion|bn|m|b)?/gi,
  ];

  for (const pattern of valuePatterns) {
    const match = pattern.exec(text);
    if (match && match[1]) {
      let amount = parseFloat(match[1].replace(/,/g, ""));
      const unit = match[2]?.toLowerCase();

      if (unit?.includes("billion") || unit === "bn") {
        amount *= 1000000000;
      } else if (unit?.includes("million") || unit === "m") {
        amount *= 1000000;
      }

      return amount;
    }
  }

  return undefined;
}

/**
 * Extract total number of investments from text
 */
function extractTotalInvestments(text: string): number | undefined {
  const countPattern =
    /(\d+)\s+(?:companies|investments|portfolio\s+companies)/gi;
  const match = countPattern.exec(text);
  return match ? parseInt(match[1]) : undefined;
}

/**
 * Extract sector breakdown from text
 */
function extractSectors(text: string): PortfolioSector[] {
  const sectors: PortfolioSector[] = [];

  const sectorPatterns = [
    /([A-Z][a-z\s&]+)[:\s]*(\d+)\s*(?:companies|investments)/gi,
    /sector[:\s]+([A-Z][a-z\s&]+)[:\s]*(\d+)\s*(?:companies|investments)/gi,
  ];

  for (const pattern of sectorPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const sectorName = match[1]?.trim();
      const count = parseInt(match[2]);

      if (sectorName && count > 0) {
        sectors.push({
          sector: sectorName,
          count,
          totalValue: 0,
          avgIRR: 0,
          avgMOIC: 0,
          companies: [],
        });
      }
    }
  }

  return sectors;
}

/**
 * Extract individual investments from text
 */
function extractInvestments(_text: string): VCInvestment[] {
  // This would be a complex extraction - simplified for now
  return [];
}

/**
 * Extract performance metrics from text
 */
function extractPerformanceMetrics(text: string): Record<string, unknown> {
  const irr = extractIRR(text);
  const moic = extractMOIC(text);
  const tvpi = extractTVPI(text);
  const dpi = extractDPI(text);

  if (irr || moic || tvpi || dpi) {
    return {
      irr,
      moic,
      tvpi,
      dpi,
    };
  }

  return undefined;
}

/**
 * Extract IRR from text
 */
function extractIRR(text: string): number | undefined {
  const irrPattern =
    /(?:irr|internal\s+rate\s+of\s+return)[:\s]*(\d+(?:\.\d+)?)\s*%/gi;
  const match = irrPattern.exec(text);
  return match ? parseFloat(match[1]) : undefined;
}

/**
 * Extract MOIC from text
 */
function extractMOIC(text: string): number | undefined {
  const moicPattern =
    /(?:moic|multiple\s+on\s+invested\s+capital)[:\s]*(\d+(?:\.\d+)?)(?:x)?/gi;
  const match = moicPattern.exec(text);
  return match ? parseFloat(match[1]) : undefined;
}

/**
 * Extract TVPI from text
 */
function extractTVPI(text: string): number | undefined {
  const tvpiPattern =
    /(?:tvpi|total\s+value\s+to\s+paid\s+in)[:\s]*(\d+(?:\.\d+)?)(?:x)?/gi;
  const match = tvpiPattern.exec(text);
  return match ? parseFloat(match[1]) : undefined;
}

/**
 * Extract DPI from text
 */
function extractDPI(text: string): number | undefined {
  const dpiPattern =
    /(?:dpi|distributed\s+to\s+paid\s+in)[:\s]*(\d+(?:\.\d+)?)(?:x)?/gi;
  const match = dpiPattern.exec(text);
  return match ? parseFloat(match[1]) : undefined;
}

/**
 * Extract top investments from text
 */
function extractTopInvestments(_text: string): VCInvestment[] {
  // Simplified extraction - would need more sophisticated parsing
  return [];
}
