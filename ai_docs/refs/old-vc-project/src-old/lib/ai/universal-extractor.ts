/**
 * Universal Personal LP Data Extractor
 * Language-agnostic, format-flexible extraction for any fund report
 */

export interface PersonalLPData {
  personalCommitment?: number;
  personalCalledCapital?: number;
  personalNAV?: number;
  personalDistributions?: number;
  personalUnfunded?: number;
  personalOwnership?: number;
  personalIRR?: number;
  personalMOIC?: number;
}

export class UniversalPersonalLPExtractor {
  /**
   * Extract personal LP data from any fund report format using semantic analysis
   */
  async extractPersonalLPData(markdownText: string): Promise<PersonalLPData> {
    console.log("🔍 Universal Personal LP Data Extraction");

    // Method 1: Section-based extraction
    const sectionData = await this.extractFromSections(markdownText);

    // Method 2: Table-based extraction
    const tableData = await this.extractFromTables(markdownText);

    // Method 3: Semantic pattern extraction
    const semanticData = await this.extractFromSemanticPatterns(markdownText);

    // Method 4: LLM-based extraction
    const llmData = await this.extractWithLLM(markdownText);

    // Cross-validate and merge results
    return this.mergeAndValidateResults([
      sectionData,
      tableData,
      semanticData,
      llmData,
    ]);
  }

  /**
   * Extract from dedicated personal LP sections
   */
  private async extractFromSections(
    markdownText: string
  ): Promise<PersonalLPData> {
    const sections = this.findPersonalLPSections(markdownText);
    const data: PersonalLPData = this.getEmptyData();

    for (const section of sections) {
      // Look for personal LP data in each section
      const sectionData = this.extractFromSectionContent(section);
      this.mergeData(data, sectionData);
    }

    return data;
  }

  /**
   * Find all sections that might contain personal LP data
   */
  private findPersonalLPSections(markdownText: string): string[] {
    const sectionPatterns = [
      // European patterns
      /#+\s*Individual capital account[\s\S]*?(?=#+\s*|$)/gi,
      /#+\s*Partners' Capital[\s\S]*?(?=#+\s*|$)/gi,
      /#+\s*LP Account[\s\S]*?(?=#+\s*|$)/gi,
      /#+\s*Capital Account[\s\S]*?(?=#+\s*|$)/gi,

      // US patterns
      /#+\s*Limited Partner Statement[\s\S]*?(?=#+\s*|$)/gi,
      /#+\s*Investor Statement[\s\S]*?(?=#+\s*|$)/gi,
      /#+\s*LP Statement[\s\S]*?(?=#+\s*|$)/gi,
      /#+\s*Investor Report[\s\S]*?(?=#+\s*|$)/gi,

      // UK patterns
      /#+\s*Partner Capital[\s\S]*?(?=#+\s*|$)/gi,
      /#+\s*LP Capital Statement[\s\S]*?(?=#+\s*|$)/gi,
      /#+\s*Investor Account[\s\S]*?(?=#+\s*|$)/gi,
      /#+\s*LP Summary[\s\S]*?(?=#+\s*|$)/gi,

      // Asian patterns
      /#+\s*Capital Summary[\s\S]*?(?=#+\s*|$)/gi,
      /#+\s*Investor Summary[\s\S]*?(?=#+\s*|$)/gi,
      /#+\s*LP Report[\s\S]*?(?=#+\s*|$)/gi,
      /#+\s*Partner Statement[\s\S]*?(?=#+\s*|$)/gi,

      // Generic patterns
      /#+\s*.*Personal.*[\s\S]*?(?=#+\s*|$)/gi,
      /#+\s*.*Individual.*[\s\S]*?(?=#+\s*|$)/gi,
      /#+\s*.*LP.*[\s\S]*?(?=#+\s*|$)/gi,
      /#+\s*.*Partner.*[\s\S]*?(?=#+\s*|$)/gi,
      /#+\s*.*Investor.*[\s\S]*?(?=#+\s*|$)/gi,
    ];

    const sections: string[] = [];

    for (const pattern of sectionPatterns) {
      const matches = markdownText.match(pattern);
      if (matches) {
        sections.push(...matches);
      }
    }

    return sections;
  }

  /**
   * Extract personal LP data from section content
   */
  private extractFromSectionContent(section: string): PersonalLPData {
    const data: PersonalLPData = this.getEmptyData();

    // Universal field patterns
    const fieldPatterns = {
      personalCommitment: [
        /commitment[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
        /committed[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
        /total commitment[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
        /LP commitment[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
      ],
      personalCalledCapital: [
        /called capital[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
        /paid in capital[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
        /contributions[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
        /called[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
      ],
      personalNAV: [
        /NAV[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
        /net asset value[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
        /capital account[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
        /fair value[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
        /balance[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
      ],
      personalDistributions: [
        /distributions[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
        /returns[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
        /cash returned[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
        /distributions to LPs[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
      ],
      personalUnfunded: [
        /unfunded[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
        /remaining commitment[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
        /uncalled[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
        /available for drawdown[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
      ],
      personalOwnership: [
        /ownership[:\s]*([0-9]+(?:\.[0-9]+)?)\s*%/gi,
        /percentage[:\s]*([0-9]+(?:\.[0-9]+)?)\s*%/gi,
        /share[:\s]*([0-9]+(?:\.[0-9]+)?)\s*%/gi,
        /stake[:\s]*([0-9]+(?:\.[0-9]+)?)\s*%/gi,
        /interest[:\s]*([0-9]+(?:\.[0-9]+)?)\s*%/gi,
      ],
    };

    // Extract data using universal patterns
    for (const [field, patterns] of Object.entries(fieldPatterns)) {
      for (const pattern of patterns) {
        const match = section.match(pattern);
        if (match) {
          let value = parseFloat(match[1].replace(/,/g, ""));

          // Handle currency multipliers
          const unit = match[0].toLowerCase();
          if (unit.includes("billion") || unit.includes(" b")) {
            value *= 1000000000;
          } else if (unit.includes("million") || unit.includes(" m")) {
            value *= 1000000;
          } else if (unit.includes("k")) {
            value *= 1000;
          }

          data[field as keyof PersonalLPData] = value;
          break;
        }
      }
    }

    return data;
  }

  /**
   * Extract from tables with personal LP data
   */
  private async extractFromTables(
    markdownText: string
  ): Promise<PersonalLPData> {
    const data: PersonalLPData = this.getEmptyData();

    // Find tables with personal LP data
    const tablePatterns = [
      // Column-based tables
      /\|.*INVESTOR.*\|.*COMMITMENT.*\|.*CALLED.*\|.*NAV.*\|.*DISTRIBUTIONS.*\|[\s\S]*?\|/gi,
      /\|.*LP.*\|.*TOTAL.*\|.*PAID IN.*\|.*FAIR VALUE.*\|.*RETURNS.*\|[\s\S]*?\|/gi,
      /\|.*PARTNER.*\|.*COMMITTED.*\|.*CONTRIBUTED.*\|.*BALANCE.*\|.*DISTRIBUTED.*\|[\s\S]*?\|/gi,

      // Row-based tables
      /Personal Commitment[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
      /Individual Called Capital[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
      /LP NAV[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
      /Partner Distributions[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
    ];

    for (const pattern of tablePatterns) {
      const matches = markdownText.match(pattern);
      if (matches) {
        // Extract data from table matches
        const tableData = this.extractFromTableContent(matches.join("\n"));
        this.mergeData(data, tableData);
      }
    }

    return data;
  }

  /**
   * Extract from table content
   */
  private extractFromTableContent(tableContent: string): PersonalLPData {
    const data: PersonalLPData = this.getEmptyData();

    // Extract data from table rows
    const rows = tableContent.split("\n").filter((row) => row.includes("|"));

    for (const row of rows) {
      // Look for personal LP data in each row
      const rowData = this.extractFromTableRow(row);
      this.mergeData(data, rowData);
    }

    return data;
  }

  /**
   * Extract from table row
   */
  private extractFromTableRow(row: string): PersonalLPData {
    const data: PersonalLPData = this.getEmptyData();

    // Look for personal LP data in row
    const cells = row.split("|").map((cell) => cell.trim());

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];

      // Look for personal LP data in each cell
      if (
        cell.match(/^\$?[0-9,]+(?:\.[0-9]+)?\s*(?:million|billion|k|m|b)?$/)
      ) {
        // This cell contains a number - try to determine what it represents
        const value = this.parseNumericValue(cell);

        // Look at surrounding cells to determine field type
        const prevCell = i > 0 ? cells[i - 1].toLowerCase() : "";
        const nextCell = i < cells.length - 1 ? cells[i + 1].toLowerCase() : "";

        if (
          prevCell.includes("commitment") ||
          nextCell.includes("commitment")
        ) {
          data.personalCommitment = value;
        } else if (prevCell.includes("called") || nextCell.includes("called")) {
          data.personalCalledCapital = value;
        } else if (prevCell.includes("nav") || nextCell.includes("nav")) {
          data.personalNAV = value;
        } else if (
          prevCell.includes("distribution") ||
          nextCell.includes("distribution")
        ) {
          data.personalDistributions = value;
        } else if (
          prevCell.includes("unfunded") ||
          nextCell.includes("unfunded")
        ) {
          data.personalUnfunded = value;
        } else if (
          prevCell.includes("ownership") ||
          nextCell.includes("ownership")
        ) {
          data.personalOwnership = value;
        }
      }
    }

    return data;
  }

  /**
   * Extract using semantic patterns
   */
  private async extractFromSemanticPatterns(
    markdownText: string
  ): Promise<PersonalLPData> {
    const data: PersonalLPData = this.getEmptyData();

    // Look for semantic patterns that indicate personal LP data
    const semanticPatterns = [
      // Look for personal/individual/LP references
      /personal[^a-z]*commitment[^a-z]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
      /individual[^a-z]*commitment[^a-z]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
      /LP[^a-z]*commitment[^a-z]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
      /partner[^a-z]*commitment[^a-z]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
      /investor[^a-z]*commitment[^a-z]*\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/gi,
    ];

    for (const pattern of semanticPatterns) {
      const matches = markdownText.match(pattern);
      if (matches) {
        for (const match of matches) {
          const value = this.parseNumericValue(match);
          if (value > 0) {
            data.personalCommitment = value;
            break;
          }
        }
      }
    }

    return data;
  }

  /**
   * Extract using LLM-based approach
   */
  private async extractWithLLM(markdownText: string): Promise<PersonalLPData> {
    // This would call the actual LLM service
    // For now, return empty data
    return this.getEmptyData();
  }

  /**
   * Parse numeric value from text
   */
  private parseNumericValue(text: string): number {
    const match = text.match(
      /\$?([0-9,]+(?:\.[0-9]+)?)\s*(?:million|billion|k|m|b)?/
    );
    if (!match) return 0;

    let value = parseFloat(match[1].replace(/,/g, ""));

    // Handle currency multipliers
    const unit = text.toLowerCase();
    if (unit.includes("billion") || unit.includes(" b")) {
      value *= 1000000000;
    } else if (unit.includes("million") || unit.includes(" m")) {
      value *= 1000000;
    } else if (unit.includes("k")) {
      value *= 1000;
    }

    return value;
  }

  /**
   * Merge data from multiple sources
   */
  private mergeData(target: PersonalLPData, source: PersonalLPData): void {
    for (const [key, value] of Object.entries(source)) {
      if (
        value !== undefined &&
        target[key as keyof PersonalLPData] === undefined
      ) {
        target[key as keyof PersonalLPData] = value;
      }
    }
  }

  /**
   * Cross-validate and merge results from multiple extraction methods
   */
  private mergeAndValidateResults(results: PersonalLPData[]): PersonalLPData {
    const merged: PersonalLPData = this.getEmptyData();

    // Merge all results
    for (const result of results) {
      this.mergeData(merged, result);
    }

    // Cross-validate results
    this.crossValidateResults(merged, results);

    return merged;
  }

  /**
   * Cross-validate results from multiple methods
   */
  private crossValidateResults(
    merged: PersonalLPData,
    results: PersonalLPData[]
  ): void {
    // If multiple methods found the same field, use the most common value
    for (const field of Object.keys(merged) as (keyof PersonalLPData)[]) {
      const values = results
        .map((r) => r[field])
        .filter((v) => v !== undefined);

      if (values.length > 1) {
        // Use the most common value
        const valueCounts = values.reduce((acc, val) => {
          acc[val] = (acc[val] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);

        const mostCommonValue = Object.entries(valueCounts).sort(
          ([, a], [, b]) => b - a
        )[0][0];

        merged[field] = parseFloat(mostCommonValue);
      }
    }
  }

  /**
   * Get empty data structure
   */
  private getEmptyData(): PersonalLPData {
    return {
      personalCommitment: undefined,
      personalCalledCapital: undefined,
      personalNAV: undefined,
      personalDistributions: undefined,
      personalUnfunded: undefined,
      personalOwnership: undefined,
      personalIRR: undefined,
      personalMOIC: undefined,
    };
  }
}
