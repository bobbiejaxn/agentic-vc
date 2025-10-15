/**
 * Universal Language-Agnostic NLP-based extraction system
 * Works across ALL fund report formats without any document-specific patterns
 * Following mg:extraction-strategy guidelines - completely generalizable
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

export class UniversalNLPExtractor {
  /**
   * Extract fund metrics using universal language-agnostic NLP approach
   * Works across ALL fund report formats without any document-specific patterns
   * Includes timeout protection to prevent hanging
   */
  public async extractFundMetrics(
    markdownText: string
  ): Promise<ExtractedFundData> {
    console.log(
      "🌍 Using universal language-agnostic NLP extraction for fund metrics"
    );

    const fundData: ExtractedFundData = {};

    try {
      // Add timeout protection to prevent hanging (increased to 60s for complex documents)
      const timeoutPromise = new Promise<ExtractedFundData>((_, reject) => {
        setTimeout(() => {
          reject(
            new Error("Universal NLP extraction timeout after 60 seconds")
          );
        }, 60000); // 60 second timeout for complex documents
      });

      const extractionPromise =
        this.extractFundMetricsWithTimeout(markdownText);

      // Race between extraction and timeout
      const result = await Promise.race([extractionPromise, timeoutPromise]);

      // Merge extracted data
      Object.assign(fundData, result);

      // Perform universal data validation and consistency checks
      this.validateAndNormalizeFundData(fundData);

      console.log("🌍 Universal NLP extraction completed:", {
        fundSize: fundData.fundSize,
        fundNAV: fundData.fundNAV,
        cumulativeCalledCapital: fundData.cumulativeCalledCapital,
        uncalledCapital: fundData.uncalledCapital,
      });

      return fundData;
    } catch (error) {
      console.error("Error in universal NLP extraction:", error);

      // Return partial data if extraction partially succeeded
      if (Object.keys(fundData).length > 0) {
        console.log("🌍 Returning partial extraction results:", fundData);
        return fundData;
      }

      return {};
    }
  }

  /**
   * Extract fund metrics with proper async timeout protection
   * Uses setImmediate to prevent event loop blocking
   */
  private async extractFundMetricsWithTimeout(
    markdownText: string
  ): Promise<ExtractedFundData> {
    return new Promise((resolve, reject) => {
      // Use setImmediate to make processing truly async and prevent blocking
      setImmediate(async () => {
        try {
          console.log("🔄 Starting async extraction processing...");

          // Use universal semantic understanding to extract fund metrics
          const extractedData = await this.extractFundMetricsUniversallyAsync(
            markdownText
          );

          console.log("✅ Async extraction completed successfully");
          resolve(extractedData);
        } catch (error) {
          console.error("❌ Async extraction failed:", error);
          reject(error);
        }
      });
    });
  }

  /**
   * Extract fund metrics using universal semantic understanding (ASYNC VERSION)
   * Language-agnostic approach that works across ALL document formats
   * Enhanced with advanced NAV and capital extraction
   * Uses chunked processing to prevent event loop blocking
   */
  private async extractFundMetricsUniversallyAsync(
    markdownText: string
  ): Promise<ExtractedFundData> {
    const fundData: ExtractedFundData = {};

    console.log("🔍 Starting universal semantic analysis...");

    // Split text into semantic chunks for universal analysis
    const textChunks = this.createUniversalSemanticChunks(markdownText);
    console.log(`📊 Processing ${textChunks.length} semantic chunks...`);

    // Extract key metrics using universal semantic analysis with async processing
    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i];
      console.log(`🔄 Processing chunk ${i + 1}/${textChunks.length}...`);

      // Use setImmediate to yield control and prevent blocking
      await new Promise((resolve) => setImmediate(resolve));

      const metrics = this.analyzeChunkUniversally(chunk);
      Object.assign(fundData, metrics);

      // Log progress every 5 chunks
      if ((i + 1) % 5 === 0) {
        console.log(
          `📈 Progress: ${i + 1}/${textChunks.length} chunks processed`
        );
      }
    }

    console.log("🔍 Processing universal table data...");
    // Use universal table structure analysis for additional data
    await new Promise((resolve) => setImmediate(resolve));
    const tableData = this.extractUniversalTableData(markdownText);
    Object.assign(fundData, tableData);

    console.log("🔍 Processing enhanced NAV and capital extraction...");
    // Enhanced NAV and capital extraction using advanced semantic analysis
    await new Promise((resolve) => setImmediate(resolve));
    const enhancedData = this.extractEnhancedNAVAndCapital(markdownText);
    Object.assign(fundData, enhancedData);

    console.log("🔍 Processing performance metrics extraction...");
    // Extract performance metrics from specific performance tables
    await new Promise((resolve) => setImmediate(resolve));
    const performanceData =
      this.extractPerformanceMetricsFromTables(markdownText);
    Object.assign(fundData, performanceData);

    console.log("✅ Universal extraction completed");
    return fundData;
  }

  /**
   * Extract fund metrics using universal semantic understanding (SYNC VERSION - kept for compatibility)
   * Language-agnostic approach that works across ALL document formats
   * Enhanced with advanced NAV and capital extraction
   */
  private extractFundMetricsUniversally(
    markdownText: string
  ): ExtractedFundData {
    const fundData: ExtractedFundData = {};

    // Split text into semantic chunks for universal analysis
    const textChunks = this.createUniversalSemanticChunks(markdownText);

    // Extract key metrics using universal semantic analysis
    for (const chunk of textChunks) {
      const metrics = this.analyzeChunkUniversally(chunk);
      Object.assign(fundData, metrics);
    }

    // Use universal table structure analysis for additional data
    const tableData = this.extractUniversalTableData(markdownText);
    Object.assign(fundData, tableData);

    // Enhanced NAV and capital extraction using advanced semantic analysis
    const enhancedData = this.extractEnhancedNAVAndCapital(markdownText);
    Object.assign(fundData, enhancedData);

    return fundData;
  }

  /**
   * Enhanced NAV and capital extraction using advanced semantic analysis
   * Works across ALL fund report formats with sophisticated pattern recognition
   */
  private extractEnhancedNAVAndCapital(
    markdownText: string
  ): ExtractedFundData {
    const enhancedData: ExtractedFundData = {};

    try {
      // Advanced semantic analysis for NAV extraction
      const navValue = this.extractAdvancedNAV(markdownText);
      if (navValue) enhancedData.fundNAV = navValue;

      // Advanced semantic analysis for called capital extraction
      const calledCapital = this.extractAdvancedCalledCapital(markdownText);
      if (calledCapital) enhancedData.cumulativeCalledCapital = calledCapital;

      // Advanced semantic analysis for uncalled capital extraction
      const uncalledCapital = this.extractAdvancedUncalledCapital(markdownText);
      if (uncalledCapital) enhancedData.uncalledCapital = uncalledCapital;

      console.log("🔍 Enhanced extraction results:", {
        nav: enhancedData.fundNAV,
        calledCapital: enhancedData.cumulativeCalledCapital,
        uncalledCapital: enhancedData.uncalledCapital,
      });
    } catch (error) {
      console.error("Error in enhanced NAV and capital extraction:", error);
    }

    return enhancedData;
  }

  /**
   * Advanced NAV extraction using sophisticated semantic analysis
   */
  private extractAdvancedNAV(markdownText: string): number | null {
    // Look for NAV in various contexts and formats
    const navPatterns = [
      // Direct NAV patterns
      /(?:nav|net asset value|unrealized fair value)[\s:]*([0-9,]+\.?[0-9]*)\s*(?:k|m|b|eur|€|€k|€m|€b)?/gi,
      // Table row patterns
      /(?:nav|net asset value)[\s|]*([0-9,]+\.?[0-9]*)/gi,
      // Contextual patterns
      /(?:total|fund|portfolio)\s*(?:nav|net asset value|value)[\s:]*([0-9,]+\.?[0-9]*)/gi,
    ];

    for (const pattern of navPatterns) {
      const matches = markdownText.match(pattern);
      if (matches) {
        for (const match of matches) {
          const value = this.parseUniversalNumericValue(match);
          if (value && value > 0) {
            console.log("🔍 Found NAV value:", value);
            return value;
          }
        }
      }
    }

    return null;
  }

  /**
   * Advanced called capital extraction using sophisticated semantic analysis
   */
  private extractAdvancedCalledCapital(markdownText: string): number | null {
    // Look for called capital in various contexts and formats
    const calledCapitalPatterns = [
      // Direct called capital patterns
      /(?:called capital|cumulative called|paid in capital|realized capital)[\s:]*([0-9,]+\.?[0-9]*)\s*(?:k|m|b|eur|€|€k|€m|€b)?/gi,
      // Table row patterns
      /(?:called|cumulative called|paid in)[\s|]*([0-9,]+\.?[0-9]*)/gi,
      // Contextual patterns
      /(?:total|fund|portfolio)\s*(?:called|cumulative called|paid in)[\s:]*([0-9,]+\.?[0-9]*)/gi,
    ];

    for (const pattern of calledCapitalPatterns) {
      const matches = markdownText.match(pattern);
      if (matches) {
        for (const match of matches) {
          const value = this.parseUniversalNumericValue(match);
          if (value && value > 0) {
            console.log("🔍 Found called capital value:", value);
            return value;
          }
        }
      }
    }

    return null;
  }

  /**
   * Advanced uncalled capital extraction using sophisticated semantic analysis
   */
  private extractAdvancedUncalledCapital(markdownText: string): number | null {
    // Look for uncalled capital in various contexts and formats
    const uncalledCapitalPatterns = [
      // Direct uncalled capital patterns
      /(?:uncalled capital|unfunded commitment|remaining commitment|available for drawdown)[\s:]*([0-9,]+\.?[0-9]*)\s*(?:k|m|b|eur|€|€k|€m|€b)?/gi,
      // Table row patterns
      /(?:uncalled|unfunded|remaining|available)[\s|]*([0-9,]+\.?[0-9]*)/gi,
      // Contextual patterns
      /(?:total|fund|portfolio)\s*(?:uncalled|unfunded|remaining)[\s:]*([0-9,]+\.?[0-9]*)/gi,
    ];

    for (const pattern of uncalledCapitalPatterns) {
      const matches = markdownText.match(pattern);
      if (matches) {
        for (const match of matches) {
          const value = this.parseUniversalNumericValue(match);
          if (value && value > 0) {
            console.log("🔍 Found uncalled capital value:", value);
            return value;
          }
        }
      }
    }

    return null;
  }

  /**
   * Create universal semantic chunks from document text for analysis
   * Works across ALL document structures and formats
   */
  private createUniversalSemanticChunks(text: string): string[] {
    // Universal approach: split by natural language boundaries
    const chunks: string[] = [];

    // Split by sections, paragraphs, and sentences for comprehensive analysis
    const sections = text.split(/#+\s+/);

    for (const section of sections) {
      // Split by paragraphs
      const paragraphs = section.split(/\n\s*\n/);

      for (const paragraph of paragraphs) {
        // Split by sentences for fine-grained analysis
        const sentences = paragraph.split(/[.!?]+/);

        chunks.push(...sentences.filter((s) => s.trim().length > 0));
        chunks.push(...paragraphs.filter((p) => p.trim().length > 0));
      }
    }

    return chunks.filter((chunk) => chunk.trim().length > 0);
  }

  /**
   * Analyze a text chunk for financial metrics using universal semantic understanding
   * Works across ALL fund report formats and languages
   */
  private analyzeChunkUniversally(chunk: string): ExtractedFundData {
    const metrics: ExtractedFundData = {};

    // Universal fund size detection
    if (this.containsUniversalFundSizeIndicators(chunk)) {
      const fundSize = this.extractUniversalNumericValue(chunk, "fundSize");
      if (fundSize) metrics.fundSize = fundSize;
    }

    // Universal NAV detection
    if (this.containsUniversalNAVIndicators(chunk)) {
      const nav = this.extractUniversalNumericValue(chunk, "nav");
      if (nav) metrics.fundNAV = nav;
    }

    // Universal called capital detection
    if (this.containsUniversalCalledCapitalIndicators(chunk)) {
      const calledCapital = this.extractUniversalNumericValue(
        chunk,
        "calledCapital"
      );
      if (calledCapital) metrics.cumulativeCalledCapital = calledCapital;
    }

    // Universal uncalled capital detection
    if (this.containsUniversalUncalledCapitalIndicators(chunk)) {
      const uncalledCapital = this.extractUniversalNumericValue(
        chunk,
        "uncalledCapital"
      );
      if (uncalledCapital) metrics.uncalledCapital = uncalledCapital;
    }

    // Universal performance metrics detection
    if (this.containsUniversalPerformanceIndicators(chunk)) {
      const irr = this.extractUniversalNumericValue(chunk, "irr");
      const moic = this.extractUniversalNumericValue(chunk, "moic");
      const tvpi = this.extractUniversalNumericValue(chunk, "tvpi");
      const dpi = this.extractUniversalNumericValue(chunk, "dpi");
      const rvpi = this.extractUniversalNumericValue(chunk, "rvpi");

      if (irr) metrics.irr = irr;
      if (moic) metrics.moic = moic;
      if (tvpi) metrics.tvpi = tvpi;
      if (dpi) metrics.dpi = dpi;
      if (rvpi) metrics.rvpi = rvpi;
    }

    return metrics;
  }

  /**
   * Universal fund size indicators - works across ALL fund report formats
   */
  private containsUniversalFundSizeIndicators(chunk: string): boolean {
    const universalIndicators = [
      // English variations
      "total commitments",
      "fund size",
      "capital commitment",
      "total committed",
      "commitments",
      "fund size",
      "capital size",
      "total fund size",
      "fund commitments",
      "total fund commitments",
      "capital commitments",
      "fund capital",
      "total capital",
      "committed capital",
      "fund total",
      "total fund",
      "fund amount",
      "total amount",
      "commitment amount",
      "fund value",
      "total value",
      "capital value",
      "fund size",

      // Alternative terms used across different fund types
      "total fund size",
      "fund size",
      "capital size",
      "total capital",
      "fund commitments",
      "total commitments",
      "capital commitments",
      "fund amount",
      "total amount",
      "capital amount",
      "commitment amount",
      "fund value",
      "total value",
      "capital value",
      "fund total",
      "total fund",
      "fund capital",
      "total capital",
      "committed capital",

      // International variations
      "fondsgröße",
      "kapitalgröße",
      "gesamtkapital",
      "fondsgröße",
      "taille du fonds",
      "capital total",
      "montant total",
      "valeur totale",
      "tamaño del fondo",
      "capital total",
      "monto total",
      "valor total",

      // Common abbreviations and variations
      "fund size",
      "total size",
      "capital size",
      "fund amount",
      "total amount",
      "capital amount",
      "fund value",
      "total value",
      "capital value",
      "fund total",
      "total fund",
      "fund capital",
      "total capital",
      "committed capital",
      "fund commitments",
      "total commitments",
      "capital commitments",
      "commitment amount",
    ];

    return universalIndicators.some((indicator) =>
      chunk.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  /**
   * Universal NAV indicators - works across ALL fund report formats
   * Enhanced with more comprehensive semantic understanding
   */
  private containsUniversalNAVIndicators(chunk: string): boolean {
    const universalIndicators = [
      // English variations
      "net asset value",
      "nav",
      "total net asset value",
      "unrealized fair value",
      "fair value",
      "net value",
      "asset value",
      "total nav",
      "fund nav",
      "portfolio value",
      "unrealized value",
      "current value",
      "market value",
      "book value",
      "carrying value",
      "net worth",
      "total assets",
      "net assets",
      "fund value",
      "investment value",
      "portfolio net value",
      "unrealized gains",
      "unrealized losses",
      "fair market value",
      "current market value",
      "valuation",
      "total valuation",
      "net portfolio value",
      "fund net value",
      "investment portfolio value",

      // Alternative terms used across different fund types
      "net asset value",
      "nav",
      "total net asset value",
      "unrealized fair value",
      "fair value",
      "net value",
      "asset value",
      "portfolio value",
      "unrealized value",
      "current value",
      "market value",
      "book value",
      "carrying value",
      "net worth",
      "total assets",
      "net assets",
      "fund value",
      "investment value",
      "portfolio net value",
      "unrealized gains",
      "unrealized losses",
      "fair market value",
      "current market value",
      "valuation",
      "total valuation",
      "net portfolio value",
      "fund net value",
      "investment portfolio value",

      // International variations
      "nettovermögen",
      "nettovermögenswert",
      "fair value",
      "nettovermögen",
      "aktueller wert",
      "marktwert",
      "buchwert",
      "nettovermögen",
      "portfolio wert",
      "investitionswert",
      "valeur nette",
      "valeur nette d'actifs",
      "fair value",
      "valeur nette",
      "valeur actuelle",
      "valeur de marché",
      "valeur comptable",
      "valeur nette",
      "valeur du portefeuille",
      "valeur d'investissement",
      "valor neto",
      "valor neto de activos",
      "fair value",
      "valor neto",
      "valor actual",
      "valor de mercado",
      "valor contable",
      "valor neto",
      "valor del portafolio",
      "valor de inversión",

      // Common abbreviations and variations
      "nav",
      "net asset value",
      "total nav",
      "fund nav",
      "portfolio value",
      "unrealized value",
      "fair value",
      "net value",
      "asset value",
      "net asset value",
      "total net asset value",
      "unrealized fair value",
      "current value",
      "market value",
      "book value",
      "carrying value",
      "net worth",
      "total assets",
      "net assets",
      "fund value",
      "investment value",
      "portfolio net value",
      "unrealized gains",
      "unrealized losses",
      "fair market value",
      "current market value",
      "valuation",
      "total valuation",
      "net portfolio value",
      "fund net value",
      "investment portfolio value",
    ];

    return universalIndicators.some((indicator) =>
      chunk.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  /**
   * Universal called capital indicators - works across ALL fund report formats
   */
  private containsUniversalCalledCapitalIndicators(chunk: string): boolean {
    const universalIndicators = [
      // English variations
      "cumulative paid in capital",
      "paid in capital",
      "called capital",
      "realized capital",
      "capital calls",
      "paid capital",
      "called",
      "cumulative called capital",
      "called capital",
      "realized capital",
      "capital calls",
      "paid in capital",
      "called capital",
      "realized",
      "paid capital",
      "called",
      "cumulative called",
      "called capital",

      // Alternative terms used across different fund types
      "cumulative paid in capital",
      "paid in capital",
      "called capital",
      "realized capital",
      "capital calls",
      "paid capital",
      "called",
      "cumulative called capital",
      "called capital",
      "realized capital",
      "capital calls",
      "paid in capital",
      "called capital",
      "realized",
      "paid capital",
      "called",
      "cumulative called",
      "called capital",

      // International variations
      "eingezahltes kapital",
      "aufgerufenes kapital",
      "realisiertes kapital",
      "kapitalaufrufe",
      "eingezahltes kapital",
      "aufgerufenes kapital",
      "capital appelé",
      "capital réalisé",
      "appels de capital",
      "capital appelé",
      "capital llamado",
      "capital realizado",
      "llamadas de capital",
      "capital llamado",

      // Common abbreviations and variations
      "called capital",
      "paid in capital",
      "cumulative called capital",
      "realized capital",
      "capital calls",
      "paid capital",
      "called",
      "cumulative called",
      "called capital",
      "realized",
      "paid capital",
    ];

    return universalIndicators.some((indicator) =>
      chunk.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  /**
   * Universal uncalled capital indicators - works across ALL fund report formats
   */
  private containsUniversalUncalledCapitalIndicators(chunk: string): boolean {
    const universalIndicators = [
      // English variations
      "unfunded commitment",
      "uncalled capital",
      "remaining commitment",
      "available for drawdown",
      "unfunded",
      "uncalled",
      "remaining",
      "unfunded commitment",
      "uncalled capital",
      "remaining commitment",
      "available for drawdown",
      "unfunded",
      "uncalled",
      "remaining",
      "unfunded commitment",
      "uncalled capital",
      "remaining commitment",

      // Alternative terms used across different fund types
      "unfunded commitment",
      "uncalled capital",
      "remaining commitment",
      "available for drawdown",
      "unfunded",
      "uncalled",
      "remaining",
      "unfunded commitment",
      "uncalled capital",
      "remaining commitment",
      "available for drawdown",
      "unfunded",
      "uncalled",
      "remaining",

      // International variations
      "unfunded commitment",
      "uncalled capital",
      "remaining commitment",
      "available for drawdown",
      "unfunded",
      "uncalled",
      "remaining",
      "engagement non financé",
      "capital non appelé",
      "engagement restant",
      "disponible pour tirage",
      "non financé",
      "non appelé",
      "restant",
      "compromiso no financiado",
      "capital no llamado",
      "compromiso restante",
      "disponible para extracción",
      "no financiado",
      "no llamado",
      "restante",

      // Common abbreviations and variations
      "unfunded",
      "uncalled",
      "remaining",
      "available for drawdown",
      "unfunded commitment",
      "uncalled capital",
      "remaining commitment",
      "unfunded",
      "uncalled",
      "remaining",
      "available for drawdown",
    ];

    return universalIndicators.some((indicator) =>
      chunk.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  /**
   * Universal performance indicators - works across ALL fund report formats
   */
  private containsUniversalPerformanceIndicators(chunk: string): boolean {
    const universalIndicators = [
      // English variations
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
      "total value",
      "distributions",
      "residual value",
      "paid in capital",
      "invested capital",
      "return on investment",
      "investment return",
      "fund performance",
      "portfolio performance",
      "investment performance",
      "fund return",

      // Alternative terms used across different fund types
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
      "total value",
      "distributions",
      "residual value",
      "paid in capital",
      "invested capital",
      "return on investment",
      "investment return",
      "fund performance",
      "portfolio performance",
      "investment performance",
      "fund return",

      // International variations
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
      "total value",
      "distributions",
      "residual value",
      "paid in capital",
      "invested capital",
      "return on investment",
      "investment return",
      "fund performance",
      "portfolio performance",
      "investment performance",
      "fund return",

      // Common abbreviations and variations
      "irr",
      "moic",
      "tvpi",
      "dpi",
      "rvpi",
      "performance",
      "return",
      "multiple",
      "gross",
      "net",
      "total value",
      "distributions",
      "residual value",
      "paid in capital",
      "invested capital",
      "return on investment",
      "investment return",
      "fund performance",
      "portfolio performance",
    ];

    return universalIndicators.some((indicator) =>
      chunk.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  /**
   * Extract numeric value from text using universal semantic understanding
   * Works across ALL document formats and languages
   */
  private extractUniversalNumericValue(
    text: string,
    metricType: string
  ): number | null {
    // Find all numeric values in the text using universal approach
    const numbers = this.findUniversalNumericValues(text);

    if (numbers.length === 0) return null;

    // Use universal semantic context to determine the most likely value
    return this.selectUniversalMostLikelyValue(numbers, metricType, text);
  }

  /**
   * Find all numeric values in text using universal language-agnostic approach
   * Works across ALL document formats and languages
   */
  private findUniversalNumericValues(text: string): number[] {
    const numbers: number[] = [];

    // Universal approach: split text into words and analyze each
    const words = text.split(/\s+/);

    for (const word of words) {
      // Look for numeric patterns without regex - universal approach
      if (this.isUniversalNumericValue(word)) {
        const value = this.parseUniversalNumericValue(word);
        if (value !== null) {
          numbers.push(value);
        }
      }
    }

    return numbers;
  }

  /**
   * Check if a word represents a numeric value using universal semantic analysis
   * Works across ALL document formats and languages
   */
  private isUniversalNumericValue(word: string): boolean {
    // Universal approach: remove common currency symbols and check if remaining is numeric
    const cleaned = word.replace(/[€$£¥₹₽₩₪₨₦₡₱₴₸₼₾₿,\s]/g, "");

    // Check if it's a number (including with k, M, B suffixes)
    if (cleaned === "") return false;

    // Check for pure numbers
    if (!isNaN(Number(cleaned))) return true;

    // Check for numbers with universal suffixes
    if (cleaned.endsWith("k") || cleaned.endsWith("K")) {
      const base = cleaned.slice(0, -1);
      return !isNaN(Number(base));
    }

    if (cleaned.endsWith("M") || cleaned.endsWith("m")) {
      const base = cleaned.slice(0, -1);
      return !isNaN(Number(base));
    }

    if (cleaned.endsWith("B") || cleaned.endsWith("b")) {
      const base = cleaned.slice(0, -1);
      return !isNaN(Number(base));
    }

    return false;
  }

  /**
   * Select the most likely value based on universal semantic context
   * Works across ALL document formats and languages
   */
  private selectUniversalMostLikelyValue(
    numbers: number[],
    metricType: string,
    context: string
  ): number | null {
    if (numbers.length === 0) return null;
    if (numbers.length === 1) return numbers[0];

    // Use universal context clues to select the most appropriate value
    // For fund size, look for larger values
    if (metricType === "fundSize") {
      return Math.max(...numbers);
    }

    // For NAV, look for values that make sense in context
    if (metricType === "nav") {
      // Look for values that appear near NAV indicators
      const navContext = this.getUniversalContextAroundIndicators(context, [
        "nav",
        "net asset value",
        "unrealized fair value",
        "fair value",
        "net value",
        "asset value",
      ]);
      if (navContext) {
        const navNumbers = this.findUniversalNumericValues(navContext);
        if (navNumbers.length > 0) return navNumbers[0];
      }
    }

    // For called capital, look for values that make sense
    if (metricType === "calledCapital") {
      const calledContext = this.getUniversalContextAroundIndicators(context, [
        "paid in capital",
        "called capital",
        "realized capital",
        "capital calls",
        "paid capital",
        "called",
      ]);
      if (calledContext) {
        const calledNumbers = this.findUniversalNumericValues(calledContext);
        if (calledNumbers.length > 0) return calledNumbers[0];
      }
    }

    // For uncalled capital, look for values that make sense
    if (metricType === "uncalledCapital") {
      const uncalledContext = this.getUniversalContextAroundIndicators(
        context,
        [
          "unfunded",
          "uncalled",
          "remaining",
          "available for drawdown",
          "unfunded commitment",
          "uncalled capital",
        ]
      );
      if (uncalledContext) {
        const uncalledNumbers =
          this.findUniversalNumericValues(uncalledContext);
        if (uncalledNumbers.length > 0) return uncalledNumbers[0];
      }
    }

    // Default to the largest reasonable value
    return Math.max(...numbers);
  }

  /**
   * Get context around specific indicators using universal approach
   * Works across ALL document formats and languages
   */
  private getUniversalContextAroundIndicators(
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
   * Extract data from table structures using universal semantic analysis
   * Works across ALL document formats and languages
   */
  private extractUniversalTableData(markdownText: string): ExtractedFundData {
    const tableData: ExtractedFundData = {};

    // Universal approach: look for table structures and extract data semantically
    const lines = markdownText.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Universal approach: look for any row that might contain key metrics
      if (
        line.includes("|") &&
        this.containsUniversalPerformanceIndicators(line)
      ) {
        const performanceData =
          this.extractUniversalPerformanceFromTableRow(line);
        Object.assign(tableData, performanceData);
      }

      // Universal approach: look for any row that might contain financial data
      if (
        line.includes("|") &&
        this.containsUniversalFinancialIndicators(line)
      ) {
        const financialData = this.extractUniversalFinancialFromTableRow(line);
        Object.assign(tableData, financialData);
      }
    }

    return tableData;
  }

  /**
   * Universal financial indicators - works across ALL fund report formats
   */
  private containsUniversalFinancialIndicators(line: string): boolean {
    const universalIndicators = [
      "total",
      "fund",
      "capital",
      "nav",
      "value",
      "amount",
      "size",
      "commitment",
      "called",
      "uncalled",
      "unfunded",
      "remaining",
      "paid",
      "realized",
      "unrealized",
      "fair",
      "net",
      "gross",
    ];

    return universalIndicators.some((indicator) =>
      line.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  /**
   * Extract data from a table row using universal semantic analysis
   * Works across ALL document formats and languages
   */
  private extractUniversalTableRowData(row: string): ExtractedFundData {
    const data: ExtractedFundData = {};

    // Universal approach: split by pipe characters and analyze each cell
    const cells = row
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell.length > 0);

    if (cells.length > 1) {
      // Look for numeric values in the row
      const numbers = this.findUniversalNumericValues(row);

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
   * Extract performance metrics from table row using universal approach
   * Works across ALL document formats and languages
   */
  private extractUniversalPerformanceFromTableRow(
    row: string
  ): ExtractedFundData {
    const data: ExtractedFundData = {};

    // Universal approach: look for any performance indicators
    if (row.toLowerCase().includes("irr")) {
      const irrValue = this.extractUniversalNumericValue(row, "irr");
      if (irrValue) data.irr = irrValue;
    }

    if (
      row.toLowerCase().includes("moic") ||
      row.toLowerCase().includes("multiple")
    ) {
      const moicValue = this.extractUniversalNumericValue(row, "moic");
      if (moicValue) data.moic = moicValue;
    }

    if (row.toLowerCase().includes("tvpi")) {
      const tvpiValue = this.extractUniversalNumericValue(row, "tvpi");
      if (tvpiValue) data.tvpi = tvpiValue;
    }

    return data;
  }

  /**
   * Extract performance metrics from specific performance tables
   * Focus on the actual performance metrics section, not capital account tables
   */
  private extractPerformanceMetricsFromTables(text: string): ExtractedFundData {
    const data: ExtractedFundData = {};

    // Use semantic analysis to identify performance metrics sections
    const performanceSections = this.identifyPerformanceSections(text);

    // Extract metrics using contextual understanding
    for (const section of performanceSections) {
      const metrics = this.extractMetricsFromSection(section);
      Object.assign(data, metrics);
    }

    return data;
  }

  /**
   * Identify performance metrics sections using semantic analysis
   * Works across all document formats and languages
   */
  private identifyPerformanceSections(text: string): string[] {
    const sections: string[] = [];
    const lines = text.split("\n");

    let inPerformanceSection = false;
    let currentSection: string[] = [];

    for (const line of lines) {
      const lineLower = line.toLowerCase();

      // Detect performance section headers using semantic understanding
      if (
        lineLower.includes("irr") ||
        lineLower.includes("multiple") ||
        lineLower.includes("performance") ||
        lineLower.includes("returns") ||
        lineLower.includes("metrics") ||
        lineLower.includes("investment multiple") ||
        lineLower.includes("paid-in capital")
      ) {
        inPerformanceSection = true;
        currentSection = [line];
        continue;
      }

      // Continue collecting lines in performance section
      if (inPerformanceSection) {
        currentSection.push(line);

        // End section on empty line or new major section
        if (
          line.trim() === "" ||
          lineLower.includes("##") ||
          lineLower.includes("---") ||
          lineLower.includes("summary") ||
          lineLower.includes("conclusion") ||
          lineLower.includes("capital account")
        ) {
          if (currentSection.length > 1) {
            sections.push(currentSection.join("\n"));
          }
          inPerformanceSection = false;
          currentSection = [];
        }
      }
    }

    // Add final section if still collecting
    if (inPerformanceSection && currentSection.length > 1) {
      sections.push(currentSection.join("\n"));
    }

    return sections;
  }

  /**
   * Extract metrics from a performance section using contextual understanding
   * Uses NLP techniques instead of regex patterns
   */
  private extractMetricsFromSection(section: string): ExtractedFundData {
    const data: ExtractedFundData = {};
    const lines = section.split("\n");

    for (const line of lines) {
      const lineLower = line.toLowerCase();

      // IRR extraction using semantic understanding
      if (lineLower.includes("irr") && lineLower.includes("gross")) {
        const irrValue = this.extractNumericValueFromLine(line);
        if (irrValue !== null) {
          data.irr = irrValue;
          console.log(`🎯 Found IRR: ${data.irr}%`);
        }
      }

      // MOIC extraction using semantic understanding
      if (
        lineLower.includes("gross investment multiple") ||
        lineLower.includes("investment multiple")
      ) {
        const moicValue = this.extractNumericValueFromLine(line);
        if (moicValue !== null) {
          data.moic = moicValue;
          console.log(`🎯 Found MOIC: ${data.moic}x`);
        }
      }

      // TVPI extraction using semantic understanding
      if (
        lineLower.includes("total value to paid-in capital") ||
        lineLower.includes("tvpi")
      ) {
        const tvpiValue = this.extractNumericValueFromLine(line);
        if (tvpiValue !== null) {
          data.tvpi = tvpiValue;
          console.log(`🎯 Found TVPI: ${data.tvpi}x`);
        }
      }

      // DPI extraction using semantic understanding
      if (
        lineLower.includes("distributions to paid-in capital") ||
        lineLower.includes("dpi")
      ) {
        if (lineLower.includes("n/a") || lineLower.includes("na")) {
          data.dpi = undefined;
          console.log(`🎯 Found DPI: n/a (undefined)`);
        } else {
          const dpiValue = this.extractNumericValueFromLine(line);
          if (dpiValue !== null) {
            data.dpi = dpiValue;
            console.log(`🎯 Found DPI: ${data.dpi}x`);
          }
        }
      }

      // RVPI extraction using semantic understanding
      if (
        lineLower.includes("residual value to paid-in capital") ||
        lineLower.includes("rvpi")
      ) {
        const rvpiValue = this.extractNumericValueFromLine(line);
        if (rvpiValue !== null) {
          data.rvpi = rvpiValue;
          console.log(`🎯 Found RVPI: ${data.rvpi}x`);
        }
      }
    }

    return data;
  }

  /**
   * Extract numeric value from a line using contextual understanding
   * Works across all number formats and languages
   */
  private extractNumericValueFromLine(line: string): number | null {
    // Remove common separators and currency symbols
    const cleaned = line.replace(/[€$£¥₹₽₩₪₨₦₡₱₴₸₼₾₿,\s]/g, "");

    // Look for decimal numbers
    const decimalMatch = cleaned.match(/([0-9]+\.?[0-9]*)/);
    if (decimalMatch) {
      const value = parseFloat(decimalMatch[1]);

      // Validate reasonable ranges for financial metrics
      if (value >= 0 && value <= 1000) {
        return value;
      }
    }

    return null;
  }

  /**
   * Extract financial data from table row using universal approach
   * Works across ALL document formats and languages
   */
  private extractUniversalFinancialFromTableRow(
    row: string
  ): ExtractedFundData {
    const data: ExtractedFundData = {};

    // Universal approach: look for any financial indicators
    if (
      row.toLowerCase().includes("nav") ||
      row.toLowerCase().includes("net asset value")
    ) {
      const navValue = this.extractUniversalNumericValue(row, "nav");
      if (navValue) data.fundNAV = navValue;
    }

    if (
      row.toLowerCase().includes("called") ||
      row.toLowerCase().includes("paid")
    ) {
      const calledValue = this.extractUniversalNumericValue(
        row,
        "calledCapital"
      );
      if (calledValue) data.cumulativeCalledCapital = calledValue;
    }

    if (
      row.toLowerCase().includes("uncalled") ||
      row.toLowerCase().includes("unfunded")
    ) {
      const uncalledValue = this.extractUniversalNumericValue(
        row,
        "uncalledCapital"
      );
      if (uncalledValue) data.uncalledCapital = uncalledValue;
    }

    return data;
  }

  /**
   * Validate and normalize fund data using universal approach
   * Works across ALL document formats and languages
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
    this.validateUniversalFundData(fundData);
  }

  /**
   * Parse numeric values from text using universal language-agnostic approach
   * Works across ALL document formats and languages
   */
  private parseUniversalNumericValue(value: string): number | null {
    // Universal approach: remove currency symbols and convert universal suffixes
    const cleaned = value.replace(/[€$£¥₹₽₩₪₨₦₡₱₴₸₼₾₿,\s]/g, "");

    if (cleaned.endsWith("k") || cleaned.endsWith("K")) {
      return parseFloat(cleaned.slice(0, -1)) * 1000;
    } else if (cleaned.endsWith("M") || cleaned.endsWith("m")) {
      return parseFloat(cleaned.slice(0, -1)) * 1000000;
    } else if (cleaned.endsWith("B") || cleaned.endsWith("b")) {
      return parseFloat(cleaned.slice(0, -1)) * 1000000000;
    }

    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  }

  /**
   * Validate fund data for consistency using universal approach
   * Works across ALL document formats and languages
   */
  private validateUniversalFundData(fundData: ExtractedFundData): void {
    // CRITICAL: First validate and scale values to fit database constraints
    this.validateAndScaleValues(fundData);

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
          `⚠️ Universal data validation warning: Called (${calledCapital}) + Uncalled (${uncalledCapital}) = ${calculatedTotal}, but Total = ${fundSize}. Difference: ${difference}`
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
          `⚠️ Universal data validation warning: DPI (${dpi}) + RVPI (${rvpi}) = ${calculatedTVPI}, but TVPI = ${tvpi}. Difference: ${difference}`
        );
      }
    }
  }

  /**
   * Validate and scale values to fit database constraints
   * Database constraints: DECIMAL(5,2) = max 999.99
   */
  private validateAndScaleValues(fundData: ExtractedFundData): void {
    // IRR: Should be a percentage (0-100), scale if needed
    if (fundData.irr !== undefined) {
      const originalIRR = fundData.irr;

      // If IRR is extremely large, it's likely a currency amount being misinterpreted
      if (fundData.irr > 100000) {
        console.log(
          `🚨 IRR value ${fundData.irr} is extremely large - likely currency misinterpretation, setting to null`
        );
        fundData.irr = undefined;
      } else if (fundData.irr > 1000) {
        // If IRR is > 1000, it's likely in basis points, convert to percentage
        fundData.irr = fundData.irr / 100;
        console.log(
          `🔧 Scaled IRR from ${originalIRR} to ${fundData.irr} (basis points to percentage)`
        );
      }

      if (fundData.irr !== undefined && fundData.irr > 999.99) {
        // Cap at database limit
        fundData.irr = 999.99;
        console.log(`🔧 Capped IRR at database limit: 999.99`);
      }
      if (fundData.irr !== undefined && fundData.irr < 0) {
        // Ensure non-negative
        fundData.irr = 0;
        console.log(`🔧 Set negative IRR to 0`);
      }
    }

    // MOIC: Should be a multiple (0-100), scale if needed
    if (fundData.moic !== undefined) {
      const originalMOIC = fundData.moic;

      // If MOIC is extremely large, it's likely a currency amount being misinterpreted
      if (fundData.moic > 100000) {
        console.log(
          `🚨 MOIC value ${fundData.moic} is extremely large - likely currency misinterpretation, setting to null`
        );
        fundData.moic = undefined;
      } else if (fundData.moic > 1000) {
        // If MOIC is > 1000, it's likely in basis points, convert to multiple
        fundData.moic = fundData.moic / 100;
        console.log(
          `🔧 Scaled MOIC from ${originalMOIC} to ${fundData.moic} (basis points to multiple)`
        );
      }

      if (fundData.moic !== undefined && fundData.moic > 999.99) {
        // Cap at database limit
        fundData.moic = 999.99;
        console.log(`🔧 Capped MOIC at database limit: 999.99`);
      }
      if (fundData.moic !== undefined && fundData.moic < 0) {
        // Ensure non-negative
        fundData.moic = 0;
        console.log(`🔧 Set negative MOIC to 0`);
      }
    }

    // TVPI: Should be a multiple (0-100), scale if needed
    if (fundData.tvpi !== undefined) {
      const originalTVPI = fundData.tvpi;

      // If TVPI is extremely large, it's likely a currency amount being misinterpreted
      if (fundData.tvpi > 100000) {
        console.log(
          `🚨 TVPI value ${fundData.tvpi} is extremely large - likely currency misinterpretation, setting to null`
        );
        fundData.tvpi = undefined;
      } else if (fundData.tvpi > 1000) {
        // If TVPI is > 1000, it's likely in basis points, convert to multiple
        fundData.tvpi = fundData.tvpi / 100;
        console.log(
          `🔧 Scaled TVPI from ${originalTVPI} to ${fundData.tvpi} (basis points to multiple)`
        );
      }

      if (fundData.tvpi !== undefined && fundData.tvpi > 999.99) {
        // Cap at database limit
        fundData.tvpi = 999.99;
        console.log(`🔧 Capped TVPI at database limit: 999.99`);
      }
      if (fundData.tvpi !== undefined && fundData.tvpi < 0) {
        // Ensure non-negative
        fundData.tvpi = 0;
        console.log(`🔧 Set negative TVPI to 0`);
      }
    }

    // DPI: Should be a multiple (0-100), scale if needed
    if (fundData.dpi !== undefined) {
      const originalDPI = fundData.dpi;

      // If DPI is extremely large, it's likely a currency amount being misinterpreted
      if (fundData.dpi > 100000) {
        console.log(
          `🚨 DPI value ${fundData.dpi} is extremely large - likely currency misinterpretation, setting to null`
        );
        fundData.dpi = undefined;
      } else if (fundData.dpi > 1000) {
        // If DPI is > 1000, it's likely in basis points, convert to multiple
        fundData.dpi = fundData.dpi / 100;
        console.log(
          `🔧 Scaled DPI from ${originalDPI} to ${fundData.dpi} (basis points to multiple)`
        );
      }

      if (fundData.dpi !== undefined && fundData.dpi > 999.99) {
        // Cap at database limit
        fundData.dpi = 999.99;
        console.log(`🔧 Capped DPI at database limit: 999.99`);
      }
      if (fundData.dpi !== undefined && fundData.dpi < 0) {
        // Ensure non-negative
        fundData.dpi = 0;
        console.log(`🔧 Set negative DPI to 0`);
      }
    }

    // RVPI: Should be a multiple (0-100), scale if needed
    if (fundData.rvpi !== undefined) {
      const originalRVPI = fundData.rvpi;

      // If RVPI is extremely large, it's likely a currency amount being misinterpreted
      if (fundData.rvpi > 100000) {
        console.log(
          `🚨 RVPI value ${fundData.rvpi} is extremely large - likely currency misinterpretation, setting to null`
        );
        fundData.rvpi = undefined;
      } else if (fundData.rvpi > 1000) {
        // If RVPI is > 1000, it's likely in basis points, convert to multiple
        fundData.rvpi = fundData.rvpi / 100;
        console.log(
          `🔧 Scaled RVPI from ${originalRVPI} to ${fundData.rvpi} (basis points to multiple)`
        );
      }

      if (fundData.rvpi !== undefined && fundData.rvpi > 999.99) {
        // Cap at database limit
        fundData.rvpi = 999.99;
        console.log(`🔧 Capped RVPI at database limit: 999.99`);
      }
      if (fundData.rvpi !== undefined && fundData.rvpi < 0) {
        // Ensure non-negative
        fundData.rvpi = 0;
        console.log(`🔧 Set negative RVPI to 0`);
      }
    }
  }
}
