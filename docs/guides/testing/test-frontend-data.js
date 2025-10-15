#!/usr/bin/env node

/**
 * VC Portfolio OS - Frontend Data Validation Script
 * Tests frontend pages and validates data rendering
 */

import { chromium } from "playwright";

// Test results
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: [],
  startTime: Date.now(),
};

// Helper function to run a test
async function testPage(name, testFn) {
  try {
    console.log(`\n🧪 Testing: ${name}`);
    const startTime = Date.now();

    const result = await testFn();
    const duration = Date.now() - startTime;

    let status = "PASS";
    let issues = [];

    // Validate result
    if (!result.success) {
      status = "FAIL";
      issues.push(result.error || "Test failed");
    } else if (result.warnings && result.warnings.length > 0) {
      status = "WARN";
      issues.push(...result.warnings);
    }

    const testResult = {
      name,
      status,
      duration,
      dataFound: result.dataFound || 0,
      issues,
      details: result.details || {},
    };

    results.tests.push(testResult);

    if (status === "PASS") {
      results.passed++;
      console.log(
        `✅ ${name} - PASS (${duration}ms) - ${testResult.dataFound} data points`
      );
    } else if (status === "WARN") {
      results.warnings++;
      console.log(`⚠️  ${name} - WARN (${duration}ms) - ${issues.join(", ")}`);
    } else {
      results.failed++;
      console.log(`❌ ${name} - FAIL (${duration}ms) - ${issues.join(", ")}`);
    }

    return testResult;
  } catch (error) {
    results.failed++;
    results.tests.push({
      name,
      status: "FAIL",
      duration: 0,
      error: error.message,
      dataFound: 0,
    });
    console.log(`❌ ${name} - ERROR - ${error.message}`);
    return null;
  }
}

// Test functions
async function testOverviewPage(page) {
  await page.goto("http://localhost:5173/overview");
  await page.waitForTimeout(3000);

  const data = await page.evaluate(() => {
    const elements = document.querySelectorAll(
      "[data-testid], .stat-value, .metric-value, .card-content"
    );
    const text = document.body.innerText;

    return {
      totalFunds: text.includes("Total Funds:")
        ? text.match(/Total Funds:\s*(\d+)/)?.[1]
        : null,
      activeCompanies: text.includes("Active Companies:")
        ? text.match(/Active Companies:\s*(\d+)/)?.[1]
        : null,
      totalCommitments: text.includes("Total Commitments:")
        ? text.match(/Total Commitments:\s*€?([\d,\.]+)/)?.[1]
        : null,
      totalNAV: text.includes("Total NAV:")
        ? text.match(/Total NAV:\s*€?([\d,\.]+)/)?.[1]
        : null,
      avgMOIC: text.includes("Average MOIC:")
        ? text.match(/Average MOIC:\s*([\d,\.]+x)/)?.[1]
        : null,
      avgIRR: text.includes("Average IRR:")
        ? text.match(/Average IRR:\s*([\d,\.]+%)/)?.[1]
        : null,
      elementCount: elements.length,
      hasData:
        text.includes("Total Funds:") || text.includes("Active Companies:"),
    };
  });

  const warnings = [];
  if (!data.totalFunds || data.totalFunds === "0")
    warnings.push("No funds data");
  if (!data.activeCompanies || data.activeCompanies === "0")
    warnings.push("No companies data");
  if (!data.totalCommitments || data.totalCommitments === "€0")
    warnings.push("No commitments data");

  return {
    success: data.hasData,
    dataFound:
      parseInt(data.totalFunds || 0) + parseInt(data.activeCompanies || 0),
    warnings,
    details: data,
  };
}

async function testPortfolioPage(page) {
  await page.goto("http://localhost:5173/portfolio");
  await page.waitForTimeout(3000);

  const data = await page.evaluate(() => {
    const text = document.body.innerText;
    const tables = document.querySelectorAll("table");
    const rows = document.querySelectorAll("tr");

    return {
      hasFundTable: text.includes("Fund") && text.includes("Vintage"),
      hasCompanyTable: text.includes("Company") && text.includes("Sector"),
      totalCompanies: text.includes("Total Companies:")
        ? text.match(/Total Companies:\s*(\d+)/)?.[1]
        : null,
      totalValue: text.includes("Total Value:")
        ? text.match(/Total Value:\s*€?([\d,\.]+)/)?.[1]
        : null,
      tableCount: tables.length,
      rowCount: rows.length,
      hasData:
        text.includes("Total Companies:") || text.includes("Total Value:"),
    };
  });

  const warnings = [];
  if (!data.hasFundTable) warnings.push("No fund table");
  if (!data.hasCompanyTable) warnings.push("No company table");
  if (!data.totalCompanies || data.totalCompanies === "0")
    warnings.push("No companies data");

  return {
    success: data.hasData,
    dataFound: parseInt(data.totalCompanies || 0),
    warnings,
    details: data,
  };
}

async function testDataManagementPage(page) {
  await page.goto("http://localhost:5173/data-management");
  await page.waitForTimeout(3000);

  const data = await page.evaluate(() => {
    const text = document.body.innerText;
    const uploadButton = document.querySelector('input[type="file"]');
    const documents = document.querySelectorAll(
      '[data-testid="document-item"]'
    );

    return {
      hasUploadButton: !!uploadButton,
      hasDocuments: documents.length > 0,
      documentCount: documents.length,
      hasData: text.includes("Upload") || text.includes("Document"),
    };
  });

  const warnings = [];
  if (!data.hasUploadButton) warnings.push("No upload functionality");
  if (data.documentCount === 0) warnings.push("No documents found");

  return {
    success: data.hasData,
    dataFound: data.documentCount,
    warnings,
    details: data,
  };
}

async function testPerformancePage(page) {
  await page.goto("http://localhost:5173/performance");
  await page.waitForTimeout(3000);

  const data = await page.evaluate(() => {
    const text = document.body.innerText;
    const charts = document.querySelectorAll("canvas, svg");

    return {
      hasPerformanceData:
        text.includes("Performance") || text.includes("Metrics"),
      hasCharts: charts.length > 0,
      chartCount: charts.length,
      hasData: text.includes("Performance") || text.includes("Return"),
    };
  });

  const warnings = [];
  if (!data.hasPerformanceData) warnings.push("No performance data");
  if (data.chartCount === 0) warnings.push("No charts found");

  return {
    success: data.hasData,
    dataFound: data.chartCount,
    warnings,
    details: data,
  };
}

async function testEnhancedPortfolioPage(page) {
  await page.goto("http://localhost:5173/enhanced-portfolio");
  await page.waitForTimeout(3000);

  const data = await page.evaluate(() => {
    const text = document.body.innerText;
    const tabs = document.querySelectorAll('[role="tab"]');

    return {
      hasTabs: tabs.length > 0,
      hasIntelligence:
        text.includes("Intelligence") || text.includes("Analytics"),
      hasNetwork: text.includes("Network") || text.includes("Graph"),
      tabCount: tabs.length,
      hasData: text.includes("Portfolio") || text.includes("Intelligence"),
    };
  });

  const warnings = [];
  if (!data.hasTabs) warnings.push("No tabs found");
  if (!data.hasIntelligence) warnings.push("No intelligence data");

  return {
    success: data.hasData,
    dataFound: data.tabCount,
    warnings,
    details: data,
  };
}

// Main test runner
async function runTests() {
  console.log("🚀 Starting VC Portfolio OS Frontend Data Validation...\n");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Test all pages
    await testPage("Overview Page", () => testOverviewPage(page));
    await testPage("Portfolio Page", () => testPortfolioPage(page));
    await testPage("Data Management Page", () => testDataManagementPage(page));
    await testPage("Performance Page", () => testPerformancePage(page));
    await testPage("Enhanced Portfolio Page", () =>
      testEnhancedPortfolioPage(page)
    );
  } finally {
    await browser.close();
  }
}

// Generate report
function generateReport() {
  const totalTime = Date.now() - results.startTime;

  console.log("\n" + "=".repeat(80));
  console.log("📊 VC PORTFOLIO OS - FRONTEND DATA VALIDATION REPORT");
  console.log("=".repeat(80));

  console.log(`\n📈 SUMMARY:`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`⚠️  Warnings: ${results.warnings}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📊 Total: ${results.tests.length}`);
  console.log(`⏱️  Total Time: ${totalTime}ms`);

  const successRate = (
    ((results.passed + results.warnings) / results.tests.length) *
    100
  ).toFixed(1);
  console.log(`🎯 Success Rate: ${successRate}%`);

  // Failed tests
  const failedTests = results.tests.filter((t) => t.status === "FAIL");
  if (failedTests.length > 0) {
    console.log(`\n❌ FAILED TESTS:`);
    failedTests.forEach((test) => {
      console.log(
        `   • ${test.name}: ${test.issues?.join(", ") || test.error}`
      );
    });
  }

  // Warning tests
  const warningTests = results.tests.filter((t) => t.status === "WARN");
  if (warningTests.length > 0) {
    console.log(`\n⚠️  WARNING TESTS:`);
    warningTests.forEach((test) => {
      console.log(`   • ${test.name}: ${test.issues?.join(", ")}`);
    });
  }

  // Data analysis
  console.log(`\n🔍 DATA ANALYSIS:`);
  const dataTests = results.tests.filter((t) => t.dataFound > 0);
  if (dataTests.length > 0) {
    const totalDataPoints = dataTests.reduce(
      (sum, test) => sum + test.dataFound,
      0
    );
    console.log(`   • Total data points found: ${totalDataPoints}`);

    const topDataSources = dataTests
      .sort((a, b) => b.dataFound - a.dataFound)
      .slice(0, 3);

    console.log(`   • Top data sources:`);
    topDataSources.forEach((test) => {
      console.log(`     - ${test.name}: ${test.dataFound} data points`);
    });
  }

  // System health
  console.log(`\n🏥 SYSTEM HEALTH:`);
  if (successRate >= 95) {
    console.log(`   🟢 EXCELLENT: Frontend is rendering data correctly`);
  } else if (successRate >= 80) {
    console.log(`   🟡 GOOD: Frontend mostly working with minor issues`);
  } else if (successRate >= 60) {
    console.log(`   🟠 FAIR: Frontend has some rendering issues`);
  } else {
    console.log(`   🔴 POOR: Frontend has significant rendering problems`);
  }

  console.log("\n" + "=".repeat(80));
}

// Main execution
async function main() {
  try {
    await runTests();
    generateReport();

    if (results.failed > 0) {
      console.log(`\n❌ Tests completed with ${results.failed} failures`);
      process.exit(1);
    } else {
      console.log(`\n✅ All frontend tests passed successfully!`);
      process.exit(0);
    }
  } catch (error) {
    console.error("❌ Test execution failed:", error);
    process.exit(1);
  }
}

// Run the tests
main();
