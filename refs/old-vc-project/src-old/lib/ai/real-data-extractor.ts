// Real data extraction from actual document text

export interface ExtractedData {
  // Fund Report specific fields
  totalValue?: number;
  irr?: number;
  moic?: number;
  investmentDate?: string;
  companyName?: string;
  fundName?: string;
  period?: string;
  totalAssets?: number;
  performance?: string;

  // Cap Table specific fields
  ownershipPercentage?: number;
  totalShares?: number;
  sharesOwned?: number;
  valuation?: number;
  investorCount?: number;

  // Financial Statement specific fields
  revenue?: number;
  expenses?: number;
  netIncome?: number;
  assets?: number;
  liabilities?: number;

  // General fields
  documentType?: string;
  confidence?: number;
  rawText?: string;
  pageCount?: number;
  metadata?: any;

  // Multi-modal data structures (for frontend compatibility)
  tables: Array<{
    headers: string[];
    rows: string[][];
    confidence: number;
    boundingBox?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;

  formFields: Array<{
    fieldName: string;
    fieldValue: string;
    confidence: number;
    boundingBox?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;

  entities: Array<{
    type: string;
    value: string;
    confidence: number;
    boundingBox?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;

  layout?: {
    pages: Array<{
      pageNumber: number;
      blocks: Array<{
        type: "text" | "table" | "image" | "form";
        content: string;
        confidence: number;
        boundingBox?: {
          x: number;
          y: number;
          width: number;
          height: number;
        };
      }>;
    }>;
  };
}

export class RealDataExtractor {
  /**
   * Extract real data from document text using pattern matching and AI-like analysis
   */
  extractDataFromText(
    text: string,
    documentType: string
  ): Partial<ExtractedData> {
    const extractedData: Partial<ExtractedData> = {
      documentType,
      confidence: 0.8, // High confidence for real extraction
      // Initialize multi-modal arrays
      tables: [],
      formFields: [],
      entities: [],
      layout: {
        pages: [
          {
            pageNumber: 1,
            blocks: [],
          },
        ],
      },
    };

    switch (documentType) {
      case "fund_report":
        return this.extractFundReportData(text, extractedData);
      case "cap_table":
        return this.extractCapTableData(text, extractedData);
      case "financial_statement":
        return this.extractFinancialStatementData(text, extractedData);
      default:
        return this.extractGeneralData(text, extractedData);
    }
  }

  private extractFundReportData(
    text: string,
    baseData: Partial<ExtractedData>
  ): Partial<ExtractedData> {
    const data = { ...baseData };

    // Extract company/fund name
    const companyMatch = text.match(
      /(?:company)[\s:]*([A-Za-z0-9\s&.,-]+?)(?:\n|$|,|\.)/i
    );
    if (companyMatch) {
      data.companyName = companyMatch[1].trim();
    }

    // Extract fund name
    const fundMatch = text.match(
      /(?:fund|portfolio)[\s:]*([A-Za-z0-9\s&.,-]+?)(?:\s|$|,|\.)/i
    );
    if (fundMatch) {
      data.fundName = fundMatch[1].trim();
    }

    // Extract period
    const periodMatch = text.match(
      /(?:quarterly|annual|report)[\s:]*([A-Za-z0-9\s-]+?)(?:\s|$|,|\.)/i
    );
    if (periodMatch) {
      data.period = periodMatch[1].trim();
    }

    // Extract total value/investment amount
    const valuePatterns = [
      /(?:total investment|investment)[\s:]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/i,
      /(?:total|value)[\s:]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/i,
      /\$([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/i,
      /([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)/i,
    ];

    for (const pattern of valuePatterns) {
      const match = text.match(pattern);
      if (match) {
        let value = parseFloat(match[1].replace(/,/g, ""));
        const unit = match[0].toLowerCase();

        // Only apply multipliers if the unit is explicitly mentioned
        if (unit.includes("billion") || unit.includes(" b")) {
          value *= 1000000000;
        } else if (unit.includes("million") || unit.includes(" m")) {
          value *= 1000000;
        } else if (unit.includes("k")) {
          value *= 1000;
        }
        // If no unit is mentioned, use the value as-is (assume it's already in the correct unit)

        data.totalValue = value;
        break;
      }
    }

    // Extract IRR
    const irrMatch = text.match(
      /(?:irr|internal rate of return)[\s:]*([0-9]+(?:\.[0-9]+)?)\s*%/i
    );
    if (irrMatch) {
      data.irr = parseFloat(irrMatch[1]);
    }

    // Extract MOIC
    const moicMatch = text.match(
      /(?:moic|multiple)[\s:]*([0-9]+(?:\.[0-9]+)?)\s*x/i
    );
    if (moicMatch) {
      data.moic = parseFloat(moicMatch[1]);
    }

    // Extract investment date
    const datePatterns = [
      /(?:investment|date)[\s:]*([0-9]{4}-[0-9]{2}-[0-9]{2})/i,
      /([0-9]{4}-[0-9]{2}-[0-9]{2})/,
      /(?:investment|date)[\s:]*([A-Za-z]+ [0-9]{1,2}, [0-9]{4})/i,
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        data.investmentDate = match[1];
        break;
      }
    }

    // Extract total assets
    const assetsMatch = text.match(
      /(?:total assets|assets)[\s:]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/i
    );
    if (assetsMatch) {
      let value = parseFloat(assetsMatch[1].replace(/,/g, ""));
      const unit = assetsMatch[0].toLowerCase();

      if (unit.includes("billion") || unit.includes("b")) {
        value *= 1000000000;
      } else if (unit.includes("million") || unit.includes("m")) {
        value *= 1000000;
      } else if (unit.includes("k")) {
        value *= 1000;
      }

      data.totalAssets = value;
    }

    // Extract performance
    const performanceMatch = text.match(
      /(?:performance|return)[\s:]*([+-]?[0-9]+(?:\.[0-9]+)?)\s*%/i
    );
    if (performanceMatch) {
      data.performance = `${performanceMatch[1]}%`;
    }

    return data;
  }

  private extractCapTableData(
    text: string,
    baseData: Partial<ExtractedData>
  ): Partial<ExtractedData> {
    const data = { ...baseData };

    // Extract company name
    const companyMatch = text.match(
      /(?:company|corporation|inc|ltd)[\s:]*([A-Za-z0-9\s&.,-]+)/i
    );
    if (companyMatch) {
      data.companyName = companyMatch[1].trim();
    }

    // Extract total shares
    const sharesMatch = text.match(
      /(?:total shares|shares outstanding)[\s:]*([0-9,]+)/i
    );
    if (sharesMatch) {
      data.totalShares = parseInt(sharesMatch[1].replace(/,/g, ""));
    }

    // Extract valuation
    const valuationMatch = text.match(
      /(?:valuation|value)[\s:]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/i
    );
    if (valuationMatch) {
      let value = parseFloat(valuationMatch[1].replace(/,/g, ""));
      const unit = valuationMatch[0].toLowerCase();

      if (unit.includes("billion") || unit.includes("b")) {
        value *= 1000000000;
      } else if (unit.includes("million") || unit.includes("m")) {
        value *= 1000000;
      } else if (unit.includes("k")) {
        value *= 1000;
      }

      data.valuation = value;
    }

    // Extract ownership percentage
    const ownershipMatch = text.match(
      /(?:ownership|percentage)[\s:]*([0-9]+(?:\.[0-9]+)?)\s*%/i
    );
    if (ownershipMatch) {
      data.ownershipPercentage = parseFloat(ownershipMatch[1]);
    }

    // Count investors (rough estimate based on text patterns)
    const investorMatches = text.match(/(?:investor|shareholder|holder)/gi);
    if (investorMatches) {
      data.investorCount = investorMatches.length;
    }

    return data;
  }

  private extractFinancialStatementData(
    text: string,
    baseData: Partial<ExtractedData>
  ): Partial<ExtractedData> {
    const data = { ...baseData };

    // Extract company name
    const companyMatch = text.match(
      /(?:company|corporation)[\s:]*([A-Za-z0-9\s&.,-]+(?:inc|ltd|corp|llc)?)/i
    );
    if (companyMatch) {
      data.companyName = companyMatch[1].trim();
    } else {
      // Fallback: look for company name in title
      const titleMatch = text.match(
        /^([A-Za-z0-9\s&.,-]+(?:inc|ltd|corp|llc)?)/i
      );
      if (titleMatch) {
        data.companyName = titleMatch[1].trim();
      } else {
        // Another fallback: look for "COMPANY:" pattern
        const companyPatternMatch = text.match(
          /COMPANY:\s*([A-Za-z0-9\s&.,-]+(?:inc|ltd|corp|llc)?)/i
        );
        if (companyPatternMatch) {
          data.companyName = companyPatternMatch[1].trim();
        }
      }
    }

    // Extract revenue
    const revenueMatch = text.match(
      /(?:revenue|sales|income)[\s:]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/i
    );
    if (revenueMatch) {
      let value = parseFloat(revenueMatch[1].replace(/,/g, ""));
      const unit = revenueMatch[0].toLowerCase();

      if (unit.includes("billion") || unit.includes("b")) {
        value *= 1000000000;
      } else if (unit.includes("million") || unit.includes("m")) {
        value *= 1000000;
      } else if (unit.includes("k")) {
        value *= 1000;
      }

      data.revenue = value;
      data.totalValue = value; // Also set as total value for compatibility
    }

    // Extract expenses
    const expensesMatch = text.match(
      /(?:expenses|costs)[\s:]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/i
    );
    if (expensesMatch) {
      let value = parseFloat(expensesMatch[1].replace(/,/g, ""));
      const unit = expensesMatch[0].toLowerCase();

      if (unit.includes("billion") || unit.includes("b")) {
        value *= 1000000000;
      } else if (unit.includes("million") || unit.includes("m")) {
        value *= 1000000;
      } else if (unit.includes("k")) {
        value *= 1000;
      }

      data.expenses = value;
    }

    // Extract net income
    const netIncomeMatch = text.match(
      /(?:net income|profit)[\s:]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/i
    );
    if (netIncomeMatch) {
      let value = parseFloat(netIncomeMatch[1].replace(/,/g, ""));
      const unit = netIncomeMatch[0].toLowerCase();

      if (unit.includes("billion") || unit.includes("b")) {
        value *= 1000000000;
      } else if (unit.includes("million") || unit.includes("m")) {
        value *= 1000000;
      } else if (unit.includes("k")) {
        value *= 1000;
      }

      data.netIncome = value;
    }

    // Extract assets
    const assetsMatch = text.match(
      /(?:total assets|assets)[\s:]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/i
    );
    if (assetsMatch) {
      let value = parseFloat(assetsMatch[1].replace(/,/g, ""));
      const unit = assetsMatch[0].toLowerCase();

      if (unit.includes("billion") || unit.includes("b")) {
        value *= 1000000000;
      } else if (unit.includes("million") || unit.includes("m")) {
        value *= 1000000;
      } else if (unit.includes("k")) {
        value *= 1000;
      }

      data.assets = value;
    }

    // Extract liabilities
    const liabilitiesMatch = text.match(
      /(?:liabilities|debt)[\s:]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/i
    );
    if (liabilitiesMatch) {
      let value = parseFloat(liabilitiesMatch[1].replace(/,/g, ""));
      const unit = liabilitiesMatch[0].toLowerCase();

      if (unit.includes("billion") || unit.includes("b")) {
        value *= 1000000000;
      } else if (unit.includes("million") || unit.includes("m")) {
        value *= 1000000;
      } else if (unit.includes("k")) {
        value *= 1000;
      }

      data.liabilities = value;
    }

    return data;
  }

  private extractGeneralData(
    text: string,
    baseData: Partial<ExtractedData>
  ): Partial<ExtractedData> {
    const data = { ...baseData };

    // Extract any monetary values
    const valueMatch = text.match(
      /\$([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/i
    );
    if (valueMatch) {
      let value = parseFloat(valueMatch[1].replace(/,/g, ""));
      const unit = valueMatch[0].toLowerCase();

      if (unit.includes("billion") || unit.includes("b")) {
        value *= 1000000000;
      } else if (unit.includes("million") || unit.includes("m")) {
        value *= 1000000;
      } else if (unit.includes("k")) {
        value *= 1000;
      }

      data.totalValue = value;
    }

    // Extract company name
    const companyMatch = text.match(
      /(?:company|corporation|inc|ltd)[\s:]*([A-Za-z0-9\s&.,-]+)/i
    );
    if (companyMatch) {
      data.companyName = companyMatch[1].trim();
    }

    return data;
  }

  private extractTables(
    text: string,
    extractedData: Partial<ExtractedData>
  ): void {
    if (!extractedData.tables) return;

    // Look for table patterns in the text
    const tablePatterns = [
      // Pattern 1: Pipe-separated tables
      /([^|\n]+(?:\|[^|\n]+)+)/g,
      // Pattern 2: Tab-separated tables
      /([^\t\n]+(?:\t[^\t\n]+)+)/g,
    ];

    for (const pattern of tablePatterns) {
      const matches = text.match(pattern);
      if (matches) {
        for (const match of matches) {
          const rows = match.split("\n").filter((row) => row.trim());
          if (rows.length >= 2) {
            const headers = rows[0]
              .split(/[|\t]/)
              .map((h) => h.trim())
              .filter((h) => h);
            const dataRows = rows.slice(1).map((row) =>
              row
                .split(/[|\t]/)
                .map((cell) => cell.trim())
                .filter((cell) => cell)
            );

            if (headers.length > 0 && dataRows.length > 0) {
              extractedData.tables.push({
                headers,
                rows: dataRows,
                confidence: 0.8,
              });
            }
          }
        }
      }
    }
  }

  private extractFormFields(
    text: string,
    extractedData: Partial<ExtractedData>
  ): void {
    if (!extractedData.formFields) return;

    // Look for form field patterns
    const formPatterns = [
      // Pattern 1: "Field Name: Value"
      /([A-Za-z\s]+):\s*([^\n]+)/g,
      // Pattern 2: "Field Name = Value"
      /([A-Za-z\s]+)\s*=\s*([^\n]+)/g,
    ];

    for (const pattern of formPatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const fieldName = match[1].trim();
        const fieldValue = match[2].trim();

        if (fieldName.length > 0 && fieldValue.length > 0) {
          extractedData.formFields.push({
            fieldName,
            fieldValue,
            confidence: 0.8,
          });
        }
      }
    }
  }

  private extractEntities(
    text: string,
    extractedData: Partial<ExtractedData>
  ): void {
    if (!extractedData.entities) return;

    // Extract company names
    const companyMatches = text.match(
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:Inc|Corp|LLC|Ltd|Company|Corporation))?)/g
    );
    if (companyMatches) {
      for (const match of companyMatches) {
        extractedData.entities.push({
          type: "COMPANY_NAME",
          value: match.trim(),
          confidence: 0.9,
        });
      }
    }

    // Extract monetary values
    const moneyMatches = text.match(
      /\$([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi
    );
    if (moneyMatches) {
      for (const match of moneyMatches) {
        extractedData.entities.push({
          type: "MONETARY_VALUE",
          value: match.trim(),
          confidence: 0.8,
        });
      }
    }

    // Extract percentages
    const percentageMatches = text.match(/([0-9]+(?:\.[0-9]+)?)\s*%/g);
    if (percentageMatches) {
      for (const match of percentageMatches) {
        extractedData.entities.push({
          type: "PERCENTAGE",
          value: match.trim(),
          confidence: 0.9,
        });
      }
    }

    // Extract dates
    const dateMatches = text.match(
      /([0-9]{4}-[0-9]{2}-[0-9]{2}|[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4})/g
    );
    if (dateMatches) {
      for (const match of dateMatches) {
        extractedData.entities.push({
          type: "DATE",
          value: match.trim(),
          confidence: 0.9,
        });
      }
    }
  }

  private updateLayout(
    text: string,
    extractedData: Partial<ExtractedData>
  ): void {
    if (!extractedData.layout || !extractedData.layout.pages) return;

    const page = extractedData.layout.pages[0];
    if (!page.blocks) {
      page.blocks = [];
    }

    // Add text blocks
    const paragraphs = text.split("\n\n").filter((p) => p.trim());
    for (const paragraph of paragraphs) {
      if (paragraph.trim()) {
        page.blocks.push({
          type: "text",
          content: paragraph.trim(),
          confidence: 0.8,
        });
      }
    }

    // Add table blocks if tables were found
    if (extractedData.tables && extractedData.tables.length > 0) {
      for (const table of extractedData.tables) {
        page.blocks.push({
          type: "table",
          content: `Table with ${table.rows.length} rows`,
          confidence: table.confidence,
        });
      }
    }

    // Add form blocks if form fields were found
    if (extractedData.formFields && extractedData.formFields.length > 0) {
      for (const field of extractedData.formFields) {
        page.blocks.push({
          type: "form",
          content: `${field.fieldName}: ${field.fieldValue}`,
          confidence: field.confidence,
        });
      }
    }
  }
}

export const realDataExtractor = new RealDataExtractor();
