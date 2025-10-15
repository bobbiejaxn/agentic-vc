#!/usr/bin/env node

/**
 * VC Portfolio OS - API Query Testing Script
 * Tests all Convex queries and validates data quality
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api.js";

// Initialize Convex client
const client = new ConvexHttpClient(
  process.env.VITE_CONVEX_URL || "https://aromatic-sheep-868.convex.cloud"
);

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: [],
};

// Helper function to run a test
async function runTest(name, testFn, expectedData = null) {
  try {
    console.log(`\n🧪 Testing: ${name}`);
    const startTime = Date.now();

    const result = await testFn();
    const duration = Date.now() - startTime;

    // Basic validation
    const hasData = result !== null && result !== undefined;
    const isArray = Array.isArray(result);
    const isObject = typeof result === "object" && !isArray;
    const hasContent = isArray
      ? result.length > 0
      : isObject
        ? Object.keys(result).length > 0
        : true;

    let status = "PASS";
    let issues = [];

    if (!hasData) {
      status = "FAIL";
      issues.push("No data returned");
    } else if (!hasContent) {
      status = "WARN";
      issues.push("Empty data returned");
    }

    // Data quality assessment
    if (hasData && hasContent) {
      const qualityScore = assessDataQuality(result, name);
      if (qualityScore < 0.5) {
        status = "WARN";
        issues.push(`Low data quality score: ${qualityScore.toFixed(2)}`);
      }
    }

    // Expected data validation
    if (expectedData && hasData) {
      const expectedFields = Object.keys(expectedData);
      const actualFields = isObject ? Object.keys(result) : [];
      const missingFields = expectedFields.filter(
        (field) => !actualFields.includes(field)
      );

      if (missingFields.length > 0) {
        status = status === "PASS" ? "WARN" : status;
        issues.push(`Missing expected fields: ${missingFields.join(", ")}`);
      }
    }

    const testResult = {
      name,
      status,
      duration,
      dataType: isArray ? "array" : isObject ? "object" : typeof result,
      dataSize: isArray
        ? result.length
        : isObject
          ? Object.keys(result).length
          : 1,
      issues,
      result: status === "PASS" ? result : null, // Only store result for successful tests
    };

    testResults.tests.push(testResult);

    if (status === "PASS") {
      testResults.passed++;
      console.log(`✅ ${name} - PASS (${duration}ms)`);
    } else if (status === "WARN") {
      testResults.warnings++;
      console.log(`⚠️  ${name} - WARN (${duration}ms) - ${issues.join(", ")}`);
    } else {
      testResults.failed++;
      console.log(`❌ ${name} - FAIL (${duration}ms) - ${issues.join(", ")}`);
    }

    return testResult;
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({
      name,
      status: "FAIL",
      duration: 0,
      error: error.message,
      issues: [`Error: ${error.message}`],
    });
    console.log(`❌ ${name} - ERROR - ${error.message}`);
    return null;
  }
}

// Data quality assessment function
function assessDataQuality(data, queryName) {
  let score = 1.0;

  if (Array.isArray(data)) {
    if (data.length === 0) return 0;

    // Check for required fields in array items
    const sample = data[0];
    if (typeof sample === "object" && sample !== null) {
      const requiredFields = getRequiredFields(queryName);
      const missingFields = requiredFields.filter(
        (field) => !(field in sample)
      );
      score -= (missingFields.length / requiredFields.length) * 0.5;
    }
  } else if (typeof data === "object" && data !== null) {
    // Check for required fields in object
    const requiredFields = getRequiredFields(queryName);
    const missingFields = requiredFields.filter((field) => !(field in data));
    score -= (missingFields.length / requiredFields.length) * 0.5;
  }

  return Math.max(0, score);
}

// Get required fields for specific queries
function getRequiredFields(queryName) {
  const fieldMap = {
    listDocuments: ["_id", "fileName", "status"],
    getAllFunds: ["_id", "name", "vintageYear"],
    getAllPortfolioCompanies: ["companies", "totalValue", "totalCompanies"],
    getAllMetrics: ["totalValue", "totalCommitments"],
    getPortfolioAggregation: ["funds", "totalCommitments", "avgTVPI"],
    getTier2Intelligence: [
      "coInvestors",
      "portfolioCompanies",
      "marketIntelligence",
    ],
    getTier3Analytics: ["analytics", "predictions"],
    getEnhancedHybridChunks: ["content", "type", "tier"],
    getSupportActivities: ["activities", "totalActivities"],
    getCoInvestorIntelligence: ["coInvestors", "networkData"],
    getMarketIntelligence: ["trends", "opportunities", "threats"],
  };

  return fieldMap[queryName] || [];
}

// Test all queries
async function runAllTests() {
  console.log("🚀 Starting VC Portfolio OS API Query Tests...\n");

  // Core Document Queries
  await runTest("listDocuments", () => client.query(api.queries.listDocuments));

  // Fund & Portfolio Queries
  await runTest("getAllFunds", () => client.query(api.queries.getAllFunds));
  await runTest("getAllPortfolioCompanies", () =>
    client.query(api.queries.getAllPortfolioCompanies)
  );
  await runTest("getAllMetrics", () => client.query(api.queries.getAllMetrics));
  await runTest("getPortfolioAggregation", () =>
    client.query(api.queries.getPortfolioAggregation)
  );
  await runTest("getAllFundReports", () =>
    client.query(api.queries.getAllFundReports, { limit: 5 })
  );
  await runTest("getTopPerformingCompanies", () =>
    client.query(api.queries.getTopPerformingCompanies, { limit: 5 })
  );

  // Intelligence Queries
  await runTest("getAllTier2Intelligence", () =>
    client.query(api.queries.getAllTier2Intelligence)
  );
  await runTest("getAllTier3Analytics", () =>
    client.query(api.queries.getAllTier3Analytics)
  );
  await runTest("getCoInvestorIntelligence", () =>
    client.query(api.queries.getCoInvestorIntelligence)
  );
  await runTest("getMarketIntelligence", () =>
    client.query(api.queries.getMarketIntelligence)
  );

  // Enhanced Processing Queries
  await runTest("getEnhancedHybridChunks", () =>
    client.query(api.queries.getEnhancedHybridChunks, {
      documentId: "k574bn0cx7544anfv6dxkwz0wn7s3fvt",
    })
  );
  await runTest("getOCRProcessingStatus", () =>
    client.query(api.queries.getOCRProcessingStatus, {
      documentId: "k574bn0cx7544anfv6dxkwz0wn7s3fvt",
    })
  );
  await runTest("getEnhancedProcessingStatus", () =>
    client.query(api.queries.getEnhancedProcessingStatus, {
      documentId: "k574bn0cx7544anfv6dxkwz0wn7s3fvt",
    })
  );

  // Search & Discovery
  await runTest("searchDocumentsWithEmbeddings", () =>
    client.query(api.queries.searchDocumentsWithEmbeddings, {
      query: "portfolio companies",
    })
  );
  await runTest("getNetworkGraphData", () =>
    client.query(api.queries.getNetworkGraphData)
  );

  // Portfolio Support
  await runTest("getSupportActivities", () =>
    client.query(api.portfolioSupport.getSupportActivities, {
      category: "all",
    })
  );
  await runTest("getSupportStats", () =>
    client.query(api.portfolioSupport.getSupportStats)
  );

  // Processing Progress
  await runTest("listAllProgress", () =>
    client.query(api.processingProgress.listAllProgress)
  );

  // External Enrichment
  await runTest("getEnrichmentStatus", () =>
    client.query(api.externalEnrichmentActions.getEnrichmentStatus, {
      documentId: "k574bn0cx7544anfv6dxkwz0wn7s3fvt",
    })
  );

  // Test with specific document ID if available
  const documents = await client.query(api.queries.listDocuments);
  if (documents && documents.length > 0) {
    const documentId = documents[0]._id;
    console.log(`\n📄 Testing with document ID: ${documentId}`);

    await runTest("getDocument", () =>
      client.query(api.queries.getDocument, { documentId })
    );
    await runTest("getTier2Intelligence", () =>
      client.query(api.queries.getTier2Intelligence, { documentId })
    );
    await runTest("getTier3Analytics", () =>
      client.query(api.queries.getTier3Analytics, { documentId })
    );
    await runTest("getOCRContent", () =>
      client.query(api.queries.getOCRContent, { documentId })
    );
  }
}

// Generate comprehensive report
function generateReport() {
  console.log("\n" + "=".repeat(80));
  console.log("📊 VC PORTFOLIO OS - API TESTING REPORT");
  console.log("=".repeat(80));

  console.log(`\n📈 SUMMARY:`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`⚠️  Warnings: ${testResults.warnings}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📊 Total: ${testResults.tests.length}`);

  const successRate = (
    ((testResults.passed + testResults.warnings) / testResults.tests.length) *
    100
  ).toFixed(1);
  console.log(`🎯 Success Rate: ${successRate}%`);

  // Failed tests
  const failedTests = testResults.tests.filter((t) => t.status === "FAIL");
  if (failedTests.length > 0) {
    console.log(`\n❌ FAILED TESTS:`);
    failedTests.forEach((test) => {
      console.log(
        `   • ${test.name}: ${test.issues?.join(", ") || test.error}`
      );
    });
  }

  // Warning tests
  const warningTests = testResults.tests.filter((t) => t.status === "WARN");
  if (warningTests.length > 0) {
    console.log(`\n⚠️  WARNING TESTS:`);
    warningTests.forEach((test) => {
      console.log(`   • ${test.name}: ${test.issues?.join(", ")}`);
    });
  }

  // Data quality analysis
  console.log(`\n🔍 DATA QUALITY ANALYSIS:`);
  const dataTests = testResults.tests.filter(
    (t) => t.status === "PASS" && t.dataSize > 0
  );

  if (dataTests.length > 0) {
    const totalDataSize = dataTests.reduce(
      (sum, test) => sum + test.dataSize,
      0
    );
    const avgDataSize = (totalDataSize / dataTests.length).toFixed(1);
    console.log(`   • Average data size: ${avgDataSize} items`);
    console.log(`   • Total data points: ${totalDataSize}`);

    // Top data sources
    const topDataSources = dataTests
      .sort((a, b) => b.dataSize - a.dataSize)
      .slice(0, 5);

    console.log(`   • Top data sources:`);
    topDataSources.forEach((test) => {
      console.log(`     - ${test.name}: ${test.dataSize} items`);
    });
  }

  // Performance analysis
  console.log(`\n⚡ PERFORMANCE ANALYSIS:`);
  const performanceTests = testResults.tests.filter((t) => t.duration > 0);
  if (performanceTests.length > 0) {
    const avgDuration = (
      performanceTests.reduce((sum, test) => sum + test.duration, 0) /
      performanceTests.length
    ).toFixed(0);
    const slowTests = performanceTests.filter((t) => t.duration > 1000);

    console.log(`   • Average response time: ${avgDuration}ms`);
    if (slowTests.length > 0) {
      console.log(`   • Slow queries (>1s):`);
      slowTests.forEach((test) => {
        console.log(`     - ${test.name}: ${test.duration}ms`);
      });
    }
  }

  // Recommendations
  console.log(`\n💡 RECOMMENDATIONS:`);

  if (testResults.failed > 0) {
    console.log(
      `   • Fix ${testResults.failed} failed queries to improve system reliability`
    );
  }

  if (testResults.warnings > 0) {
    console.log(
      `   • Address ${testResults.warnings} warning queries for better data quality`
    );
  }

  if (successRate < 80) {
    console.log(
      `   • Overall system health is below 80% - consider system review`
    );
  } else if (successRate >= 95) {
    console.log(`   • Excellent system health! All queries are working well`);
  }

  console.log(`\n🎯 NEXT STEPS:`);
  console.log(`   • Review failed queries and fix underlying issues`);
  console.log(`   • Optimize slow queries for better performance`);
  console.log(`   • Validate data quality for warning queries`);
  console.log(`   • Consider adding more comprehensive error handling`);

  console.log("\n" + "=".repeat(80));
}

// Main execution
async function main() {
  try {
    await runAllTests();
    generateReport();

    // Exit with appropriate code
    if (testResults.failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error("❌ Test execution failed:", error);
    process.exit(1);
  }
}

// Run the tests
main();
