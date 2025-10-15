#!/usr/bin/env node

/**
 * VC Portfolio OS - Simple Test Runner
 * Executes all test files and generates reports
 */

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

// Test configuration
const tests = [
  {
    name: "API Validation",
    file: "test-api-validation.js",
    description: "Simulated API testing with mock data",
    timeout: 30000,
  },
  {
    name: "Frontend Data Validation",
    file: "test-frontend-data.js",
    description: "Browser automation testing for frontend rendering",
    timeout: 60000,
  },
];

// Test results
const results = {
  startTime: Date.now(),
  tests: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
  },
};

// Helper function to run a test
function runTest(test) {
  return new Promise((resolve) => {
    console.log(`\n🧪 Running: ${test.name}`);
    console.log(`📝 Description: ${test.description}`);
    console.log("─".repeat(50));

    const startTime = Date.now();
    const child = spawn("node", [test.file], {
      stdio: "inherit",
      env: { ...process.env },
    });

    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
    }, test.timeout);

    child.on("close", (code) => {
      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;

      const testResult = {
        name: test.name,
        file: test.file,
        duration,
        exitCode: code,
        timedOut,
        success: code === 0 && !timedOut,
      };

      results.tests.push(testResult);
      results.summary.total++;

      if (testResult.success) {
        results.summary.passed++;
        console.log(
          `\n✅ ${test.name} - PASSED (${(duration / 1000).toFixed(1)}s)`
        );
      } else {
        results.summary.failed++;
        console.log(
          `\n❌ ${test.name} - FAILED (${(duration / 1000).toFixed(1)}s)`
        );
        if (timedOut) {
          console.log(`   Error: Test timed out after ${test.timeout / 1000}s`);
        } else if (code !== 0) {
          console.log(`   Error: Test failed with exit code ${code}`);
        }
      }

      resolve(testResult);
    });

    child.on("error", (error) => {
      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;

      const testResult = {
        name: test.name,
        file: test.file,
        duration,
        exitCode: -1,
        timedOut: false,
        success: false,
        error: error.message,
      };

      results.tests.push(testResult);
      results.summary.total++;
      results.summary.failed++;

      console.log(
        `\n❌ ${test.name} - ERROR (${(duration / 1000).toFixed(1)}s)`
      );
      console.log(`   Error: ${error.message}`);

      resolve(testResult);
    });
  });
}

// Generate report
function generateReport() {
  const totalTime = Date.now() - results.startTime;

  console.log("\n" + "=".repeat(60));
  console.log("📊 VC PORTFOLIO OS - TEST SUITE REPORT");
  console.log("=".repeat(60));

  console.log(`\n📈 SUMMARY:`);
  console.log(`✅ Passed: ${results.summary.passed}`);
  console.log(`❌ Failed: ${results.summary.failed}`);
  console.log(`📊 Total: ${results.summary.total}`);
  console.log(`⏱️  Total Time: ${(totalTime / 1000).toFixed(1)}s`);

  const successRate = (
    (results.summary.passed / results.summary.total) *
    100
  ).toFixed(1);
  console.log(`🎯 Success Rate: ${successRate}%`);

  // Test details
  console.log(`\n📋 TEST DETAILS:`);
  results.tests.forEach((test) => {
    const status = test.success ? "✅ PASS" : "❌ FAIL";
    const duration = `${(test.duration / 1000).toFixed(1)}s`;
    console.log(`   ${status} ${test.name} (${duration})`);
  });

  // System health
  console.log(`\n🏥 SYSTEM HEALTH:`);
  if (successRate >= 95) {
    console.log(`   🟢 EXCELLENT: All tests passing, system is healthy`);
  } else if (successRate >= 80) {
    console.log(`   🟡 GOOD: Most tests passing, minor issues to address`);
  } else if (successRate >= 60) {
    console.log(`   🟠 FAIR: Some tests failing, system needs attention`);
  } else {
    console.log(
      `   🔴 POOR: Many tests failing, system has significant issues`
    );
  }

  console.log("\n" + "=".repeat(60));
}

// Main execution
async function main() {
  console.log("🚀 Starting VC Portfolio OS Test Suite...\n");
  console.log(`📅 Started at: ${new Date().toLocaleString()}`);

  // Check if test files exist
  const missingFiles = tests.filter((test) => !fs.existsSync(test.file));
  if (missingFiles.length > 0) {
    console.log("\n❌ Missing test files:");
    missingFiles.forEach((test) => {
      console.log(`   • ${test.file}`);
    });
    process.exit(1);
  }

  // Run all tests
  for (const test of tests) {
    try {
      await runTest(test);
    } catch (error) {
      console.error(`\n❌ Error running ${test.name}:`, error.message);
      results.summary.failed++;
    }
  }

  // Generate report
  generateReport();

  // Exit with appropriate code
  if (results.summary.failed > 0) {
    console.log(
      `\n❌ Test suite completed with ${results.summary.failed} failures`
    );
    process.exit(1);
  } else {
    console.log(`\n✅ All tests passed successfully!`);
    process.exit(0);
  }
}

// Run the test suite
main().catch((error) => {
  console.error("\n❌ Test suite execution failed:", error);
  process.exit(1);
});
