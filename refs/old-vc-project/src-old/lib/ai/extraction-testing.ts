/**
 * VC Intelligence Extraction Testing Framework
 *
 * Comprehensive testing system for validating extraction accuracy and performance:
 * - Automated test case execution
 * - Accuracy benchmarking against expected results
 * - Performance metrics and regression testing
 * - Quality assurance for 95%+ accuracy target
 * - European compliance testing
 */

import { StrategicFieldValidator, ValidationReport } from "./field-validation";
import { LlamaParseService } from "./llama-parse";
import { DocumentType } from "../types/documents";

export interface TestCase {
  id: string;
  name: string;
  description: string;
  documentType: DocumentType;
  inputMarkdown: string;
  expectedResults: Record<string, unknown>;
  tags: string[];
  priority: "high" | "medium" | "low";
  europeanComplianceRequired: boolean;
}

export interface TestResult {
  testCaseId: string;
  testCaseName: string;
  executionTime: number;
  extractedData: Record<string, unknown>;
  validationReport: ValidationReport;
  accuracyScore: number;
  passed: boolean;
  errors: string[];
  warnings: string[];
  fieldAccuracy: Record<string, FieldAccuracy>;
  performanceMetrics: PerformanceMetrics;
}

export interface FieldAccuracy {
  fieldName: string;
  expected: unknown;
  actual: unknown;
  match: boolean;
  confidence: number;
  qualityScore: number;
}

export interface PerformanceMetrics {
  totalProcessingTime: number;
  validationTime: number;
  extractionTime: number;
  memoryUsage?: number;
  confidenceDistribution: Record<string, number>;
}

export interface TestSuite {
  id: string;
  name: string;
  description: string;
  testCases: TestCase[];
  executionDate: Date;
  results?: TestSuiteResult;
}

export interface TestSuiteResult {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  averageAccuracy: number;
  averageConfidence: number;
  europeanComplianceScore: number;
  totalExecutionTime: number;
  testResults: TestResult[];
  summary: TestSummary;
  recommendations: string[];
}

export interface TestSummary {
  overallQualityScore: number;
  accuracyDistribution: Record<string, number>;
  fieldCoverage: Record<string, number>;
  complianceIssues: string[];
  performanceInsights: string[];
}

export interface BenchmarkResult {
  testSuiteId: string;
  baselineAccuracy: number;
  currentAccuracy: number;
  improvement: number;
  regressionDetected: boolean;
  performanceComparison: PerformanceComparison;
  recommendations: string[];
}

export interface PerformanceComparison {
  baselineExecutionTime: number;
  currentExecutionTime: number;
  timeImprovement: number;
  memoryEfficiency: number;
  throughput: number;
}

/**
 * Comprehensive Extraction Testing Framework
 */
export class ExtractionTestingFramework {
  private llamaParseService: LlamaParseService;
  private testSuites: Map<string, TestSuite> = new Map();
  private baselineResults: Map<string, BenchmarkResult> = new Map();

  constructor() {
    this.llamaParseService = new LlamaParseService();
  }

  /**
   * Register a test suite
   */
  registerTestSuite(suite: TestSuite): void {
    this.testSuites.set(suite.id, suite);
  }

  /**
   * Execute a single test case
   */
  async executeTestCase(testCase: TestCase): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // Execute extraction
      const extractionStartTime = Date.now();
      const extractionResult =
        await this.llamaParseService.extractStructuredData(
          testCase.inputMarkdown,
          testCase.documentType
        );

      // For streaming results, we'll need to collect the final result
      let finalResult: Record<string, unknown> | null = null;
      let validationReport: ValidationReport | null = null;

      if (Symbol.asyncIterator in extractionResult) {
        // Handle streaming results
        for await (const chunk of extractionResult) {
          if (chunk.type === "data" && chunk.content) {
            finalResult = chunk.content as Record<string, unknown>;
            validationReport = (chunk.content as Record<string, unknown>)
              .validationReport as ValidationReport;
          }
        }
      } else {
        // Handle direct result
        finalResult = extractionResult as Record<string, unknown>;
        if (
          finalResult &&
          typeof finalResult === "object" &&
          "validationReport" in finalResult
        ) {
          validationReport = (finalResult as Record<string, unknown>)
            .validationReport as ValidationReport;
        }
      }

      const extractionTime = Date.now() - extractionStartTime;

      if (!finalResult) {
        throw new Error("No extraction result received");
      }

      // Apply validation
      const validationStartTime = Date.now();
      const validatedReport =
        validationReport ||
        StrategicFieldValidator.validateStrategicData(finalResult);
      const validationTime = Date.now() - validationStartTime;

      // Calculate field-level accuracy
      const fieldAccuracy = this.calculateFieldAccuracy(
        testCase.expectedResults,
        finalResult
      );

      // Calculate overall accuracy score
      const accuracyScore = this.calculateAccuracyScore(
        fieldAccuracy,
        validatedReport
      );

      const totalTime = Date.now() - startTime;

      // Calculate performance metrics
      const performanceMetrics = this.calculatePerformanceMetrics(
        totalTime,
        extractionTime,
        validationTime,
        validatedReport
      );

      // Determine if test passed (95%+ accuracy required)
      const passed =
        accuracyScore >= 0.95 && validatedReport.overallQualityScore >= 0.85;

      return {
        testCaseId: testCase.id,
        testCaseName: testCase.name,
        executionTime: totalTime,
        extractedData: finalResult,
        validationReport: validatedReport,
        accuracyScore,
        passed,
        errors: this.generateErrors(fieldAccuracy, validatedReport),
        warnings: this.generateWarnings(fieldAccuracy),
        fieldAccuracy,
        performanceMetrics,
      };
    } catch (error) {
      const totalTime = Date.now() - startTime;

      return {
        testCaseId: testCase.id,
        testCaseName: testCase.name,
        executionTime: totalTime,
        extractedData: {},
        validationReport: {
          totalFields: 0,
          validFields: 0,
          invalidFields: 0,
          averageConfidence: 0,
          overallQualityScore: 0,
          europeanComplianceScore: 0,
          fieldResults: {},
          complianceIssues: [
            error instanceof Error ? error.message : "Unknown error",
          ],
        },
        accuracyScore: 0,
        passed: false,
        errors: [error instanceof Error ? error.message : "Unknown error"],
        warnings: [],
        fieldAccuracy: {},
        performanceMetrics: {
          totalProcessingTime: totalTime,
          validationTime: 0,
          extractionTime: 0,
          confidenceDistribution: {},
        },
      };
    }
  }

  /**
   * Execute a complete test suite
   */
  async executeTestSuite(suiteId: string): Promise<TestSuiteResult> {
    const suite = this.testSuites.get(suiteId);
    if (!suite) {
      throw new Error(`Test suite ${suiteId} not found`);
    }

    const startTime = Date.now();
    const testResults: TestResult[] = [];

    for (const testCase of suite.testCases) {
      const result = await this.executeTestCase(testCase);
      testResults.push(result);
    }

    const totalExecutionTime = Date.now() - startTime;
    const summary = this.generateTestSummary(testResults);
    const recommendations = this.generateRecommendations(testResults, summary);

    return {
      totalTests: testResults.length,
      passedTests: testResults.filter((r) => r.passed).length,
      failedTests: testResults.filter((r) => !r.passed).length,
      averageAccuracy: this.calculateAverage(
        testResults.map((r) => r.accuracyScore)
      ),
      averageConfidence: this.calculateAverage(
        testResults.map((r) => r.validationReport.averageConfidence)
      ),
      europeanComplianceScore: this.calculateAverage(
        testResults.map((r) => r.validationReport.europeanComplianceScore)
      ),
      totalExecutionTime,
      testResults,
      summary,
      recommendations,
    };
  }

  /**
   * Run benchmark against baseline
   */
  async runBenchmark(suiteId: string): Promise<BenchmarkResult> {
    const currentResult = await this.executeTestSuite(suiteId);
    const baseline = this.baselineResults.get(suiteId);

    if (!baseline) {
      throw new Error(`No baseline found for suite ${suiteId}`);
    }

    const improvement =
      currentResult.averageAccuracy - baseline.currentAccuracy;
    const regressionDetected =
      currentResult.averageAccuracy < baseline.currentAccuracy * 0.95;

    const performanceComparison: PerformanceComparison = {
      baselineExecutionTime:
        baseline.performanceComparison.baselineExecutionTime,
      currentExecutionTime: currentResult.totalExecutionTime,
      timeImprovement:
        baseline.performanceComparison.baselineExecutionTime -
        currentResult.totalExecutionTime,
      memoryEfficiency: 1.0, // Placeholder - would need actual memory tracking
      throughput:
        currentResult.totalTests / (currentResult.totalExecutionTime / 1000),
    };

    const recommendations = this.generateBenchmarkRecommendations(
      currentResult,
      baseline,
      improvement,
      regressionDetected
    );

    return {
      testSuiteId: suiteId,
      baselineAccuracy: baseline.currentAccuracy,
      currentAccuracy: currentResult.averageAccuracy,
      improvement,
      regressionDetected,
      performanceComparison,
      recommendations,
    };
  }

  /**
   * Set baseline for regression testing
   */
  setBaseline(suiteId: string, benchmarkResult: BenchmarkResult): void {
    this.baselineResults.set(suiteId, benchmarkResult);
  }

  /**
   * Get predefined test cases for common scenarios
   */
  getPredefinedTestCases(): TestCase[] {
    return [
      // Fund Report Test Cases
      this.createFundReportTestCase(),
      this.createPersonalPortfolioTestCase(),
      this.createPortfolioCompanyTestCase(),
      this.createEuropeanComplianceTestCase(),
      this.createPerformanceRegressionTestCase(),
    ];
  }

  /**
   * Calculate field-level accuracy
   */
  private calculateFieldAccuracy(
    expected: Record<string, unknown>,
    actual: Record<string, unknown>
  ): Record<string, FieldAccuracy> {
    const accuracy: Record<string, FieldAccuracy> = {};

    // Check all expected fields
    for (const [fieldName, expectedValue] of Object.entries(expected)) {
      const actualValue = actual[fieldName];

      accuracy[fieldName] = {
        fieldName,
        expected: expectedValue,
        actual: actualValue,
        match: this.valuesMatch(expectedValue, actualValue),
        confidence: this.calculateFieldConfidence(expectedValue, actualValue),
        qualityScore: this.calculateFieldQualityScore(
          expectedValue,
          actualValue
        ),
      };
    }

    return accuracy;
  }

  /**
   * Calculate overall accuracy score
   */
  private calculateAccuracyScore(
    fieldAccuracy: Record<string, FieldAccuracy>,
    validationReport: ValidationReport
  ): number {
    const fieldScores: number[] = [];
    let totalWeight = 0;

    for (const [fieldName, accuracy] of Object.entries(fieldAccuracy)) {
      const weight = this.getFieldWeight(fieldName);
      totalWeight += weight;

      if (accuracy.match) {
        fieldScores.push(accuracy.qualityScore * weight);
      } else {
        fieldScores.push(0);
      }
    }

    // Factor in validation report quality
    const validationBonus = validationReport.overallQualityScore * 0.3;
    const totalScore = fieldScores.reduce((sum, score) => sum + score, 0);

    return totalWeight > 0 ? totalScore / totalWeight + validationBonus : 0;
  }

  /**
   * Generate errors from field accuracy and validation
   */
  private generateErrors(
    fieldAccuracy: Record<string, FieldAccuracy>,
    validationReport: ValidationReport
  ): string[] {
    const errors: string[] = [];

    for (const accuracy of Object.values(fieldAccuracy)) {
      if (!accuracy.match) {
        errors.push(
          `${accuracy.fieldName}: Expected ${JSON.stringify(
            accuracy.expected
          )}, got ${JSON.stringify(accuracy.actual)}`
        );
      }
    }

    errors.push(...validationReport.complianceIssues);

    return errors;
  }

  /**
   * Generate warnings from field accuracy and validation
   */
  private generateWarnings(
    fieldAccuracy: Record<string, FieldAccuracy>
  ): string[] {
    const warnings: string[] = [];

    for (const accuracy of Object.values(fieldAccuracy)) {
      if (accuracy.confidence < 0.8) {
        warnings.push(
          `${accuracy.fieldName}: Low confidence (${(
            accuracy.confidence * 100
          ).toFixed(1)}%)`
        );
      }
    }

    return warnings;
  }

  /**
   * Calculate performance metrics
   */
  private calculatePerformanceMetrics(
    totalTime: number,
    extractionTime: number,
    validationTime: number,
    validationReport: ValidationReport
  ): PerformanceMetrics {
    return {
      totalProcessingTime: totalTime,
      validationTime,
      extractionTime,
      confidenceDistribution:
        this.calculateConfidenceDistribution(validationReport),
    };
  }

  /**
   * Calculate confidence distribution
   */
  private calculateConfidenceDistribution(
    validationReport: ValidationReport
  ): Record<string, number> {
    const distribution: Record<string, number> = {
      "0.0-0.2": 0,
      "0.2-0.4": 0,
      "0.4-0.6": 0,
      "0.6-0.8": 0,
      "0.8-1.0": 0,
    };

    for (const result of Object.values(validationReport.fieldResults)) {
      const confidence = result.confidence;
      if (confidence < 0.2) distribution["0.0-0.2"]++;
      else if (confidence < 0.4) distribution["0.2-0.4"]++;
      else if (confidence < 0.6) distribution["0.4-0.6"]++;
      else if (confidence < 0.8) distribution["0.6-0.8"]++;
      else distribution["0.8-1.0"]++;
    }

    return distribution;
  }

  /**
   * Generate test summary
   */
  private generateTestSummary(results: TestResult[]): TestSummary {
    const accuracyDistribution = this.calculateAccuracyDistribution(results);
    const fieldCoverage = this.calculateFieldCoverage(results);
    const complianceIssues = this.collectComplianceIssues(results);
    const performanceInsights = this.generatePerformanceInsights(results);

    return {
      overallQualityScore: this.calculateAverage(
        results.map((r) => r.validationReport.overallQualityScore)
      ),
      accuracyDistribution,
      fieldCoverage,
      complianceIssues,
      performanceInsights,
    };
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    results: TestResult[],
    summary: TestSummary
  ): string[] {
    const recommendations: string[] = [];

    if (summary.overallQualityScore < 0.85) {
      recommendations.push(
        "Improve overall extraction quality - consider prompt engineering or model tuning"
      );
    }

    const failedTests = results.filter((r) => !r.passed);
    if (failedTests.length > 0) {
      recommendations.push(
        `Address failures in: ${failedTests
          .map((r) => r.testCaseName)
          .join(", ")}`
      );
    }

    const lowConfidenceFields = this.identifyLowConfidenceFields(results);
    if (lowConfidenceFields.length > 0) {
      recommendations.push(
        `Improve confidence for fields: ${lowConfidenceFields.join(", ")}`
      );
    }

    if (summary.complianceIssues.length > 0) {
      recommendations.push("Resolve European compliance issues");
    }

    return recommendations;
  }

  /**
   * Generate benchmark recommendations
   */
  private generateBenchmarkRecommendations(
    current: TestSuiteResult,
    baseline: BenchmarkResult,
    improvement: number,
    regression: boolean
  ): string[] {
    const recommendations: string[] = [];

    if (regression) {
      recommendations.push(
        "PERFORMANCE REGRESSION DETECTED - Investigate extraction pipeline changes"
      );
    }

    if (improvement > 0.05) {
      recommendations.push("Accuracy improved - document successful changes");
    }

    if (
      current.totalExecutionTime >
      baseline.performanceComparison.baselineExecutionTime * 1.2
    ) {
      recommendations.push(
        "Performance degraded - optimize extraction pipeline"
      );
    }

    return recommendations;
  }

  // Helper methods
  private valuesMatch(expected: unknown, actual: unknown): boolean {
    if (expected === null || expected === undefined) {
      return actual === null || actual === undefined;
    }

    if (typeof expected === "number" && typeof actual === "number") {
      // Allow for small numerical differences
      return Math.abs(expected - actual) < Math.abs(expected * 0.01); // 1% tolerance
    }

    if (typeof expected === "string" && typeof actual === "string") {
      return expected.toLowerCase().trim() === actual.toLowerCase().trim();
    }

    return JSON.stringify(expected) === JSON.stringify(actual);
  }

  private calculateFieldConfidence(expected: unknown, actual: unknown): number {
    if (this.valuesMatch(expected, actual)) {
      return 1.0;
    }

    if (
      expected === null ||
      expected === undefined ||
      actual === null ||
      actual === undefined
    ) {
      return 0.0;
    }

    if (typeof expected === "string" && typeof actual === "string") {
      // Calculate string similarity
      return this.calculateStringSimilarity(expected, actual);
    }

    if (typeof expected === "number" && typeof actual === "number") {
      const diff = Math.abs(expected - actual);
      const tolerance = Math.abs(expected * 0.01); // 1% tolerance
      return Math.max(0, 1 - diff / Math.max(tolerance, 1));
    }

    return 0.0;
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  private calculateFieldQualityScore(
    expected: unknown,
    actual: unknown
  ): number {
    const confidence = this.calculateFieldConfidence(expected, actual);

    if (expected === null || expected === undefined) {
      return actual === null || actual === undefined ? 1.0 : 0.0;
    }

    if (actual === null || actual === undefined) {
      return 0.0;
    }

    // Quality bonuses based on data type and completeness
    let qualityBonus = 0;

    if (typeof expected === "number" && typeof actual === "number") {
      qualityBonus += 0.1;
    } else if (typeof expected === "string" && typeof actual === "string") {
      qualityBonus += 0.05;
    } else if (Array.isArray(expected) && Array.isArray(actual)) {
      qualityBonus += 0.08;
    } else if (typeof expected === "object" && typeof actual === "object") {
      qualityBonus += 0.12;
    }

    return Math.min(1.0, confidence + qualityBonus);
  }

  private getFieldWeight(fieldName: string): number {
    // Strategic fields have higher weight
    const strategicFields = [
      "fundNAV",
      "personalCommitment",
      "personalNAV",
      "fundSize",
      "personalIRR",
      "personalMOIC",
      "companyName",
      "totalValue",
    ];

    return strategicFields.includes(fieldName) ? 2.0 : 1.0;
  }

  private calculateAverage(values: number[]): number {
    return values.length > 0
      ? values.reduce((sum, val) => sum + val, 0) / values.length
      : 0;
  }

  private calculateAccuracyDistribution(
    results: TestResult[]
  ): Record<string, number> {
    const distribution: Record<string, number> = {
      "0-20%": 0,
      "20-40%": 0,
      "40-60%": 0,
      "60-80%": 0,
      "80-90%": 0,
      "90-95%": 0,
      "95-100%": 0,
    };

    results.forEach((result) => {
      const accuracy = result.accuracyScore * 100;
      if (accuracy < 20) distribution["0-20%"]++;
      else if (accuracy < 40) distribution["20-40%"]++;
      else if (accuracy < 60) distribution["40-60%"]++;
      else if (accuracy < 80) distribution["60-80%"]++;
      else if (accuracy < 90) distribution["80-90%"]++;
      else if (accuracy < 95) distribution["90-95%"]++;
      else distribution["95-100%"]++;
    });

    return distribution;
  }

  private calculateFieldCoverage(
    results: TestResult[]
  ): Record<string, number> {
    const coverage: Record<string, number> = {};

    results.forEach((result) => {
      Object.keys(result.fieldAccuracy).forEach((fieldName) => {
        coverage[fieldName] = (coverage[fieldName] || 0) + 1;
      });
    });

    // Convert to percentage of total tests
    const totalTests = results.length;
    Object.keys(coverage).forEach((fieldName) => {
      coverage[fieldName] = (coverage[fieldName] / totalTests) * 100;
    });

    return coverage;
  }

  private collectComplianceIssues(results: TestResult[]): string[] {
    const issues: string[] = [];

    results.forEach((result) => {
      issues.push(...result.validationReport.complianceIssues);
    });

    return [...new Set(issues)]; // Remove duplicates
  }

  private generatePerformanceInsights(results: TestResult[]): string[] {
    const insights: string[] = [];

    const avgExecutionTime = this.calculateAverage(
      results.map((r) => r.executionTime)
    );
    insights.push(`Average execution time: ${avgExecutionTime.toFixed(2)}ms`);

    const avgConfidence = this.calculateAverage(
      results.map((r) => r.validationReport.averageConfidence)
    );
    insights.push(`Average confidence: ${(avgConfidence * 100).toFixed(1)}%`);

    const fastTests = results.filter((r) => r.executionTime < 1000);
    if (fastTests.length > 0) {
      insights.push(`${fastTests.length} tests completed in under 1 second`);
    }

    return insights;
  }

  private identifyLowConfidenceFields(results: TestResult[]): string[] {
    const fieldConfidence: Record<string, number[]> = {};

    results.forEach((result) => {
      Object.entries(result.fieldAccuracy).forEach(([fieldName, accuracy]) => {
        if (!fieldConfidence[fieldName]) {
          fieldConfidence[fieldName] = [];
        }
        fieldConfidence[fieldName].push(accuracy.confidence);
      });
    });

    const lowConfidenceFields: string[] = [];

    Object.entries(fieldConfidence).forEach(([fieldName, confidences]) => {
      const avgConfidence = this.calculateAverage(confidences);
      if (avgConfidence < 0.7) {
        lowConfidenceFields.push(fieldName);
      }
    });

    return lowConfidenceFields;
  }

  // Predefined test cases
  private createFundReportTestCase(): TestCase {
    return {
      id: "fund-report-basic",
      name: "Basic Fund Report Extraction",
      description: "Test extraction of basic fund performance metrics",
      documentType: "fund_report",
      inputMarkdown: `
# Merantix Fund II Q1 2024 Report

## Fund Overview
- **Fund Name**: Merantix Fund II
- **Vintage Year**: 2022
- **Fund Size**: €150 million
- **Management Fee**: 2.0%
- **Carried Interest**: 20%

## Performance Summary
- **NAV**: €45.2 million
- **Cumulative Distributions**: €12.8 million
- **IRR**: 18.5%
- **MOIC**: 1.25x
- **TVPI**: 1.32x
- **DPI**: 0.28x

## Portfolio Companies
- **Company A** (FinTech): €5M invested, Series A, Berlin
- **Company B** (HealthTech): €3M invested, Seed, London
      `,
      expectedResults: {
        companyName: "Merantix Fund II",
        vintageYear: 2022,
        fundSize: 150000000,
        managementFeeRate: 2.0,
        carriedInterestRate: 20,
        fundNAV: 45200000,
        cumulativeDistributions: 12800000,
        irr: 18.5,
        moic: 1.25,
        tvpi: 1.32,
        dpi: 0.28,
        portfolioCompanyCount: 2,
        industrySector: "FinTech",
        geography: "Berlin",
      },
      tags: ["fund_report", "basic", "performance"],
      priority: "high",
      europeanComplianceRequired: true,
    };
  }

  private createPersonalPortfolioTestCase(): TestCase {
    return {
      id: "personal-portfolio-basic",
      name: "Personal Portfolio Metrics",
      description: "Test extraction of personal LP portfolio data",
      documentType: "fund_report",
      inputMarkdown: `
# Personal Portfolio Statement - Q1 2024

## Your Investment in Merantix Fund II
- **Commitment**: €500,000
- **Called Capital**: €375,000
- **Personal NAV**: €425,000
- **Distributions Received**: €75,000
- **Ownership %**: 0.33%
- **Personal IRR**: 22.1%
- **Personal MOIC**: 1.33x

## Capital Calls
- Q1 2024: €50,000 (Portfolio expansion)
- Q4 2023: €25,000 (Follow-on investment)

## Tax Treatment
Distributions characterized as return of capital (tax-deferred).
      `,
      expectedResults: {
        personalCommitment: 500000,
        personalCalledCapital: 375000,
        personalNAV: 425000,
        personalDistributions: 75000,
        personalOwnershipPercentage: 0.33,
        personalIRR: 22.1,
        personalMOIC: 1.33,
        taxTreatment: "return of capital",
      },
      tags: ["personal_portfolio", "lp_data", "tax"],
      priority: "high",
      europeanComplianceRequired: true,
    };
  }

  private createPortfolioCompanyTestCase(): TestCase {
    return {
      id: "portfolio-company-detailed",
      name: "Detailed Portfolio Company Data",
      description:
        "Test extraction of comprehensive portfolio company information",
      documentType: "fund_report",
      inputMarkdown: `
# Portfolio Company Details

## Company A - FinTech Sector
- **Investment Stage**: Series A
- **Geography**: Berlin, Germany
- **Founding Year**: 2020
- **Last Round Valuation**: €25 million
- **Last Round Date**: December 2023
- **Revenue Growth**: 150%
- **EBITDA**: €2.1 million
- **Cash Position**: €8.5 million
- **Burn Rate**: €150,000/month
- **Runway**: 56 months
- **Employee Count**: 45
- **Key Investors**: Merantix Fund II, LocalGlobe
- **Board Representation**: Observer rights
- **Valuation Method**: Recent round
- **Market Size**: €50 billion TAM
- **Business Model**: SaaS subscription
      `,
      expectedResults: {
        industrySector: "FinTech",
        investmentStage: "Series A",
        geography: "Berlin, Germany",
        foundingYear: 2020,
        lastRoundValuation: 25000000,
        lastRoundDate: "December 2023",
        revenueGrowth: 150,
        ebitda: 2100000,
        cashPosition: 8500000,
        burnRate: 150000,
        runway: 56,
        employeeCount: 45,
        keyInvestors: ["Merantix Fund II", "LocalGlobe"],
        boardRepresentation: "Observer rights",
        valuationMethod: "Recent round",
        marketSize: 50000000000,
        businessModel: "SaaS subscription",
      },
      tags: ["portfolio_company", "detailed", "metrics"],
      priority: "high",
      europeanComplianceRequired: false,
    };
  }

  private createEuropeanComplianceTestCase(): TestCase {
    return {
      id: "european-compliance-gdpr",
      name: "European Compliance - GDPR",
      description: "Test GDPR compliance for personal financial data",
      documentType: "fund_report",
      inputMarkdown: `
# Personal Investment Statement

## GDPR Protected Information
- **Personal Commitment**: €1,000,000
- **Investment Vehicle**: Personal (Individual)
- **Tax Residency**: Germany
- **Investment Date**: January 1, 2022

## Consent Status
Data processing consent granted for investment management purposes.
Data retention: 7 years post-fund liquidation.
      `,
      expectedResults: {
        personalCommitment: 1000000,
        investmentVehicle: "Personal",
        investmentDate: "January 1, 2022",
      },
      tags: ["european_compliance", "gdpr", "personal_data"],
      priority: "high",
      europeanComplianceRequired: true,
    };
  }

  private createPerformanceRegressionTestCase(): TestCase {
    return {
      id: "performance-regression-test",
      name: "Performance Regression Test",
      description: "Test for performance regression detection",
      documentType: "fund_report",
      inputMarkdown: `
# Performance Test Document

## Fund Metrics
- **Fund NAV**: €100,000,000
- **IRR**: 25.5%
- **MOIC**: 1.45x
- **Vintage**: 2021
- **Currency**: EUR
- **Reporting Period**: Q1 2024

## Personal Metrics
- **Commitment**: €2,500,000
- **Called**: €1,875,000
- **NAV**: €2,125,000
- **Distributions**: €375,000
      `,
      expectedResults: {
        fundNAV: 100000000,
        irr: 25.5,
        moic: 1.45,
        vintageYear: 2021,
        fundCurrency: "EUR",
        reportingPeriod: "Q1 2024",
        personalCommitment: 2500000,
        personalCalledCapital: 1875000,
        personalNAV: 2125000,
        personalDistributions: 375000,
      },
      tags: ["performance", "regression", "comprehensive"],
      priority: "medium",
      europeanComplianceRequired: true,
    };
  }
}
