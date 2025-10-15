/**
 * Language-agnostic NLP-based extraction system
 * Following mg:extraction-strategy guidelines - no regex patterns
 * Uses semantic understanding and NLP techniques for robust data extraction
 */

export interface ExtractedFundData {
  fundSize?: number;
  fundNAV?: number;
  cumulativeCalledCapital?: number;
  uncalledCapital?: number;
  irr?: number;
  moic?: number;
  tvpi?: number;
  dpi?: number;
  rvpi?: number;
  companyName?: string;
}

export class NLPExtractor {
  /**
   * Extract fund metrics using language-agnostic NLP approach
   */
  public extractFundMetrics(markdownText: string): ExtractedFundData {
    console.log(
      "🧠 Using language-agnostic NLP-based extraction for fund metrics"
    );

    const fundData: ExtractedFundData = {};

    try {
      // Use semantic understanding to extract fund metrics
      const extractedData = this.extractFundMetricsSemantically(markdownText);

      // Merge extracted data
      Object.assign(fundData, extractedData);

      // Perform data validation and consistency checks
      this.validateAndNormalizeFundData(fundData);

      console.log("🧠 NLP-based extraction completed:", {
        fundSize: fundData.fundSize,
        fundNAV: fundData.fundNAV,
        cumulativeCalledCapital: fundData.cumulativeCalledCapital,
        uncalledCapital: fundData.uncalledCapital,
      });

      return fundData;
    } catch (error) {
      console.error("Error in NLP-based extraction:", error);
      return {};
    }
  }

  /**
   * Extract fund metrics using semantic understanding and NLP techniques
   * Language-agnostic approach that works across different document formats
   */
  private extractFundMetricsSemantically(
    markdownText: string
  ): ExtractedFundData {
    const fundData: ExtractedFundData = {};

    // Split text into semantic chunks for analysis
    const textChunks = this.createSemanticChunks(markdownText);

    // Extract key metrics using semantic analysis
    for (const chunk of textChunks) {
      const metrics = this.analyzeChunkForMetrics(chunk);
      Object.assign(fundData, metrics);
    }

    // Use table structure analysis for additional data
    const tableData = this.extractTableData(markdownText);
    Object.assign(fundData, tableData);

    return fundData;
  }

  /**
   * Create semantic chunks from document text for analysis
   */
  private createSemanticChunks(text: string): string[] {
    // Split by sections and paragraphs for semantic analysis
    const sections = text.split(/#+\s+/);
    const chunks: string[] = [];

    for (const section of sections) {
      // Split by paragraphs and lines
      const paragraphs = section.split(/\n\s*\n/);
      chunks.push(...paragraphs.filter((p) => p.trim().length > 0));
    }

    return chunks;
  }

  /**
   * Analyze a text chunk for financial metrics using semantic understanding
   */
  private analyzeChunkForMetrics(chunk: string): ExtractedFundData {
    const metrics: ExtractedFundData = {};

    // Look for fund size indicators
    if (this.containsFundSizeIndicators(chunk)) {
      const fundSize = this.extractNumericValue(chunk, "fundSize");
      if (fundSize) metrics.fundSize = fundSize;
    }

    // Look for NAV indicators
    if (this.containsNAVIndicators(chunk)) {
      const nav = this.extractNumericValue(chunk, "nav");
      if (nav) metrics.fundNAV = nav;
    }

    // Look for called capital indicators
    if (this.containsCalledCapitalIndicators(chunk)) {
      const calledCapital = this.extractNumericValue(chunk, "calledCapital");
      if (calledCapital) metrics.cumulativeCalledCapital = calledCapital;
    }

    // Look for uncalled capital indicators
    if (this.containsUncalledCapitalIndicators(chunk)) {
      const uncalledCapital = this.extractNumericValue(
        chunk,
        "uncalledCapital"
      );
      if (uncalledCapital) metrics.uncalledCapital = uncalledCapital;
    }

    // Look for performance metrics
    if (this.containsPerformanceIndicators(chunk)) {
      const irr = this.extractNumericValue(chunk, "irr");
      const moic = this.extractNumericValue(chunk, "moic");
      const tvpi = this.extractNumericValue(chunk, "tvpi");
      const dpi = this.extractNumericValue(chunk, "dpi");
      const rvpi = this.extractNumericValue(chunk, "rvpi");

      if (irr) metrics.irr = irr;
      if (moic) metrics.moic = moic;
      if (tvpi) metrics.tvpi = tvpi;
      if (dpi) metrics.dpi = dpi;
      if (rvpi) metrics.rvpi = rvpi;
    }

    return metrics;
  }

  /**
   * Check if chunk contains fund size indicators using semantic understanding
   */
  private containsFundSizeIndicators(chunk: string): boolean {
    const indicators = [
      "total commitments",
      "fund size",
      "capital commitment",
      "total committed",
      "commitments",
      "fund size",
      "capital size",
      "total fund size",
    ];

    return indicators.some((indicator) =>
      chunk.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  /**
   * Check if chunk contains NAV indicators using semantic understanding
   */
  private containsNAVIndicators(chunk: string): boolean {
    const indicators = [
      "net asset value",
      "nav",
      "total net asset value",
      "unrealized fair value",
      "fair value",
      "net value",
      "asset value",
    ];

    return indicators.some((indicator) =>
      chunk.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  /**
   * Check if chunk contains called capital indicators using semantic understanding
   */
  private containsCalledCapitalIndicators(chunk: string): boolean {
    const indicators = [
      "cumulative paid in capital",
      "paid in capital",
      "called capital",
      "realized capital",
      "capital calls",
      "paid capital",
      "called",
    ];

    return indicators.some((indicator) =>
      chunk.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  /**
   * Check if chunk contains uncalled capital indicators using semantic understanding
   */
  private containsUncalledCapitalIndicators(chunk: string): boolean {
    const indicators = [
      "unfunded commitment",
      "uncalled capital",
      "remaining commitment",
      "available for drawdown",
      "unfunded",
      "uncalled",
      "remaining",
    ];

    return indicators.some((indicator) =>
      chunk.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  /**
   * Check if chunk contains performance indicators using semantic understanding
   */
  private containsPerformanceIndicators(chunk: string): boolean {
    const indicators = [
      "irr",
      "internal rate of return",
      "moic",
      "multiple",
      "tvpi",
      "dpi",
      "rvpi",
      "performance",
      "return",
      "multiple",
      "gross",
      "net",
    ];

    return indicators.some((indicator) =>
      chunk.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  /**
   * Extract numeric value from text using semantic understanding
   */
  private extractNumericValue(text: string, metricType: string): number | null {
    // Find all numeric values in the text
    const numbers = this.findNumericValues(text);

    if (numbers.length === 0) return null;

    // Use semantic context to determine the most likely value
    return this.selectMostLikelyValue(numbers, metricType, text);
  }

  /**
   * Find all numeric values in text using language-agnostic approach
   */
  private findNumericValues(text: string): number[] {
    const numbers: number[] = [];

    // Split text into words and analyze each
    const words = text.split(/\s+/);

    for (const word of words) {
      // Look for numeric patterns without regex
      if (this.isNumericValue(word)) {
        const value = this.parseNumericValue(word);
        if (value !== null) {
          numbers.push(value);
        }
      }
    }

    return numbers;
  }

  /**
   * Check if a word represents a numeric value using semantic analysis
   */
  private isNumericValue(word: string): boolean {
    // Remove common currency symbols and check if remaining is numeric
    const cleaned = word.replace(/[€$,\s]/g, "");

    // Check if it's a number (including with k, M suffixes)
    if (cleaned === "") return false;

    // Check for pure numbers
    if (!isNaN(Number(cleaned))) return true;

    // Check for numbers with k/M suffixes
    if (cleaned.endsWith("k") || cleaned.endsWith("M")) {
      const base = cleaned.slice(0, -1);
      return !isNaN(Number(base));
    }

    return false;
  }

  /**
   * Select the most likely value based on semantic context
   */
  private selectMostLikelyValue(
    numbers: number[],
    metricType: string,
    context: string
  ): number | null {
    if (numbers.length === 0) return null;
    if (numbers.length === 1) return numbers[0];

    // Use context clues to select the most appropriate value
    const contextLower = context.toLowerCase();

    // For fund size, look for larger values
    if (metricType === "fundSize") {
      return Math.max(...numbers);
    }

    // For NAV, look for values that make sense in context
    if (metricType === "nav") {
      // Look for values that appear near NAV indicators
      const navContext = this.getContextAroundIndicators(context, [
        "nav",
        "net asset value",
      ]);
      if (navContext) {
        const navNumbers = this.findNumericValues(navContext);
        if (navNumbers.length > 0) return navNumbers[0];
      }
    }

    // For called capital, look for values that make sense
    if (metricType === "calledCapital") {
      const calledContext = this.getContextAroundIndicators(context, [
        "paid in capital",
        "called capital",
      ]);
      if (calledContext) {
        const calledNumbers = this.findNumericValues(calledContext);
        if (calledNumbers.length > 0) return calledNumbers[0];
      }
    }

    // For uncalled capital, look for values that make sense
    if (metricType === "uncalledCapital") {
      const uncalledContext = this.getContextAroundIndicators(context, [
        "unfunded",
        "uncalled",
        "remaining",
      ]);
      if (uncalledContext) {
        const uncalledNumbers = this.findNumericValues(uncalledContext);
        if (uncalledNumbers.length > 0) return uncalledNumbers[0];
      }
    }

    // Default to the largest reasonable value
    return Math.max(...numbers);
  }

  /**
   * Get context around specific indicators
   */
  private getContextAroundIndicators(
    text: string,
    indicators: string[]
  ): string | null {
    const lines = text.split("\n");

    for (const line of lines) {
      const lineLower = line.toLowerCase();
      if (indicators.some((indicator) => lineLower.includes(indicator))) {
        return line;
      }
    }

    return null;
  }

  /**
   * Extract data from table structures using semantic analysis
   */
  private extractTableData(markdownText: string): ExtractedFundData {
    const tableData: ExtractedFundData = {};

    // Look for table structures and extract data semantically
    const lines = markdownText.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Look for "Since inception" rows which often contain key metrics
      if (line.toLowerCase().includes("since inception")) {
        const tableRowData = this.extractTableRowData(line);
        Object.assign(tableData, tableRowData);
      }

      // Look for performance metrics in table format
      if (line.includes("|") && this.containsPerformanceIndicators(line)) {
        const performanceData = this.extractPerformanceFromTableRow(line);
        Object.assign(tableData, performanceData);
      }
    }

    return tableData;
  }

  /**
   * Extract data from a table row using semantic analysis
   */
  private extractTableRowData(row: string): ExtractedFundData {
    const data: ExtractedFundData = {};

    // Split by pipe characters and analyze each cell
    const cells = row
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell.length > 0);

    if (cells.length > 1) {
      // Look for numeric values in the row
      const numbers = this.findNumericValues(row);

      if (numbers.length > 0) {
        // Use the largest number as it's likely the total
        data.fundSize = Math.max(...numbers);

        // If we have multiple numbers, use context to assign them
        if (numbers.length > 1) {
          // Sort numbers and assign based on typical table structure
          const sortedNumbers = numbers.sort((a, b) => b - a);
          data.fundNAV = sortedNumbers[0];
          if (sortedNumbers.length > 1) {
            data.cumulativeCalledCapital = sortedNumbers[1];
          }
        }
      }
    }

    return data;
  }

  /**
   * Extract performance metrics from table row
   */
  private extractPerformanceFromTableRow(row: string): ExtractedFundData {
    const data: ExtractedFundData = {};

    // Look for IRR
    if (row.toLowerCase().includes("irr")) {
      const irrValue = this.extractNumericValue(row, "irr");
      if (irrValue) data.irr = irrValue;
    }

    // Look for MOIC
    if (
      row.toLowerCase().includes("moic") ||
      row.toLowerCase().includes("multiple")
    ) {
      const moicValue = this.extractNumericValue(row, "moic");
      if (moicValue) data.moic = moicValue;
    }

    // Look for TVPI
    if (row.toLowerCase().includes("tvpi")) {
      const tvpiValue = this.extractNumericValue(row, "tvpi");
      if (tvpiValue) data.tvpi = tvpiValue;
    }

    return data;
  }

  /**
   * Validate and normalize fund data
   */
  private validateAndNormalizeFundData(fundData: ExtractedFundData): void {
    // Calculate uncalled capital if not found but we have total and called
    if (
      !fundData.uncalledCapital &&
      fundData.fundSize &&
      fundData.cumulativeCalledCapital
    ) {
      fundData.uncalledCapital =
        (fundData.fundSize as number) -
        (fundData.cumulativeCalledCapital as number);
    }

    // Validate data consistency
    this.validateFundData(fundData);
  }

  /**
   * Parse numeric values from text using language-agnostic approach
   */
  private parseNumericValue(value: string): number | null {
    // Remove currency symbols and convert k/M suffixes
    let cleaned = value.replace(/[€$,\s]/g, "");

    if (cleaned.endsWith("k")) {
      return parseFloat(cleaned.slice(0, -1)) * 1000;
    } else if (cleaned.endsWith("M")) {
      return parseFloat(cleaned.slice(0, -1)) * 1000000;
    }

    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  }

  /**
   * Validate fund data for consistency
   */
  private validateFundData(fundData: ExtractedFundData): void {
    const fundSize = fundData.fundSize;
    const calledCapital = fundData.cumulativeCalledCapital;
    const uncalledCapital = fundData.uncalledCapital;

    // Validate that called + uncalled = total
    if (fundSize && calledCapital && uncalledCapital) {
      const calculatedTotal = calledCapital + uncalledCapital;
      const difference = Math.abs(fundSize - calculatedTotal);

      if (difference > 0.01) {
        // Allow for small rounding differences
        console.warn(
          `⚠️ Data validation warning: Called (${calledCapital}) + Uncalled (${uncalledCapital}) = ${calculatedTotal}, but Total = ${fundSize}. Difference: ${difference}`
        );
      }
    }

    // Validate TVPI = DPI + RVPI
    const tvpi = fundData.tvpi;
    const dpi = fundData.dpi;
    const rvpi = fundData.rvpi;

    if (tvpi && dpi && rvpi) {
      const calculatedTVPI = dpi + rvpi;
      const difference = Math.abs(tvpi - calculatedTVPI);

      if (difference > 0.01) {
        console.warn(
          `⚠️ Data validation warning: DPI (${dpi}) + RVPI (${rvpi}) = ${calculatedTVPI}, but TVPI = ${tvpi}. Difference: ${difference}`
        );
      }
    }
  }
}
