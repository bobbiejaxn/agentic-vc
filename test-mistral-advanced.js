#!/usr/bin/env node

/**
 * Advanced Mistral OCR Test Suite
 *
 * This script tests the Mistral OCR implementation with:
 * 1. Real Mistral API integration (if configured)
 * 2. Mock data testing
 * 3. Performance benchmarking
 * 4. Error scenario testing
 * 5. Integration with Google ADK agents
 */

const { ConvexHttpClient } = require("convex/browser");
const fs = require("fs");
const path = require("path");

// Initialize Convex client
const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// Test data samples
const TEST_DOCUMENTS = [
  {
    name: "fund-report-q4-2024.pdf",
    type: "application/pdf",
    size: 2048000,
    expectedContent: ["IRR", "MOIC", "Fund Size", "Performance"],
  },
  {
    name: "portfolio-summary-2024.pdf",
    type: "application/pdf",
    size: 1536000,
    expectedContent: ["Portfolio", "Companies", "Investments", "Valuation"],
  },
  {
    name: "capital-account-statement.pdf",
    type: "application/pdf",
    size: 1024000,
    expectedContent: ["Capital", "Account", "Statement", "Balance"],
  },
];

async function testMistralOCRAdvanced() {
  console.log("🚀 Advanced Mistral OCR Test Suite");
  console.log("=".repeat(60));

  try {
    // Setup: Create test user
    console.log("\n👤 Setting up test user...");
    const userId = await client.mutation("users:createUser", {
      email: "advanced-test@mistral.com",
      name: "Advanced Test User",
      investorType: "institutional",
      role: "portfolio_manager",
    });
    console.log(`✅ Test user created: ${userId}`);

    const results = {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      processingTimes: [],
      documents: [],
    };

    // Test 1: Multiple document processing
    console.log("\n📚 Test 1: Multiple document processing...");
    for (const [index, doc] of TEST_DOCUMENTS.entries()) {
      results.totalTests++;

      try {
        console.log(
          `\n  Processing document ${index + 1}/${TEST_DOCUMENTS.length}: ${doc.name}`
        );

        // Create document
        const documentId = await client.mutation("documents:createDocument", {
          userId,
          fileName: doc.name,
          fileSize: doc.size,
          fileType: doc.type,
          filePath: `/uploads/${doc.name}`,
        });

        // Process with Mistral OCR
        const startTime = Date.now();
        const ocrResult = await client.action("mistral:processDocument", {
          documentId,
        });
        const processingTime = Date.now() - startTime;

        results.processingTimes.push(processingTime);
        results.documents.push({
          documentId,
          fileName: doc.name,
          processingTime,
          success: ocrResult.success,
        });

        if (ocrResult.success) {
          console.log(`  ✅ Processed in ${processingTime}ms`);
          console.log(
            `  ✅ Extracted: ${ocrResult.extractedText?.length} characters`
          );

          // Verify expected content
          const hasExpectedContent = doc.expectedContent.some((keyword) =>
            ocrResult.extractedText?.includes(keyword)
          );

          if (hasExpectedContent) {
            console.log(`  ✅ Contains expected keywords`);
            results.passedTests++;
          } else {
            console.log(`  ⚠️  Missing expected keywords`);
            results.failedTests++;
          }
        } else {
          console.log(`  ❌ Failed: ${ocrResult.error}`);
          results.failedTests++;
        }
      } catch (error) {
        console.log(`  ❌ Error processing ${doc.name}: ${error.message}`);
        results.failedTests++;
      }
    }

    // Test 2: Performance benchmarking
    console.log("\n⚡ Test 2: Performance benchmarking...");
    const avgProcessingTime =
      results.processingTimes.reduce((a, b) => a + b, 0) /
      results.processingTimes.length;
    const maxProcessingTime = Math.max(...results.processingTimes);
    const minProcessingTime = Math.min(...results.processingTimes);

    console.log(
      `✅ Average processing time: ${avgProcessingTime.toFixed(2)}ms`
    );
    console.log(`✅ Fastest processing: ${minProcessingTime}ms`);
    console.log(`✅ Slowest processing: ${maxProcessingTime}ms`);

    // Performance thresholds
    const performanceThresholds = {
      excellent: 1000, // < 1 second
      good: 3000, // < 3 seconds
      acceptable: 5000, // < 5 seconds
    };

    if (avgProcessingTime < performanceThresholds.excellent) {
      console.log("🏆 Performance: EXCELLENT");
    } else if (avgProcessingTime < performanceThresholds.good) {
      console.log("🥇 Performance: GOOD");
    } else if (avgProcessingTime < performanceThresholds.acceptable) {
      console.log("🥈 Performance: ACCEPTABLE");
    } else {
      console.log("🥉 Performance: NEEDS IMPROVEMENT");
    }

    // Test 3: Chunk analysis
    console.log("\n🧩 Test 3: Chunk analysis...");
    const allChunks = await client.query(
      "enhancedHybridChunks:getChunksByUser",
      { userId }
    );
    console.log(`✅ Total chunks created: ${allChunks.length}`);

    const chunkTypes = allChunks.reduce((acc, chunk) => {
      acc[chunk.chunkType] = (acc[chunk.chunkType] || 0) + 1;
      return acc;
    }, {});

    console.log("✅ Chunk type distribution:");
    Object.entries(chunkTypes).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count}`);
    });

    // Test 4: Search functionality
    console.log("\n🔍 Test 4: Search functionality...");
    const searchTerms = ["IRR", "MOIC", "Portfolio", "Fund"];

    for (const term of searchTerms) {
      const searchResults = await client.query(
        "enhancedHybridChunks:searchChunks",
        {
          userId,
          searchText: term,
        }
      );
      console.log(`✅ Search '${term}': ${searchResults.length} results`);
    }

    // Test 5: Error handling
    console.log("\n🚨 Test 5: Error handling...");
    results.totalTests++;

    try {
      // Test with non-existent document
      const errorResult = await client.action("mistral:processDocument", {
        documentId: "invalid-document-id",
      });

      if (!errorResult.success) {
        console.log("✅ Error handling works correctly");
        results.passedTests++;
      } else {
        console.log("❌ Error handling failed - should have returned error");
        results.failedTests++;
      }
    } catch (error) {
      console.log("✅ Error handling works (exception caught)");
      results.passedTests++;
    }

    // Test 6: Integration readiness
    console.log("\n🔗 Test 6: Integration readiness...");
    results.totalTests++;

    // Check if we have the necessary data for Google ADK agents
    const completedDocuments = results.documents.filter((doc) => doc.success);
    const hasProcessedDocuments = completedDocuments.length > 0;
    const hasChunks = allChunks.length > 0;

    if (hasProcessedDocuments && hasChunks) {
      console.log("✅ Ready for Google ADK integration");
      console.log(
        `✅ ${completedDocuments.length} documents ready for agent processing`
      );
      console.log(`✅ ${allChunks.length} chunks available for analysis`);
      results.passedTests++;
    } else {
      console.log("❌ Not ready for Google ADK integration");
      results.failedTests++;
    }

    // Final results
    console.log("\n📊 Final Test Results");
    console.log("=".repeat(60));
    console.log(`Total Tests: ${results.totalTests}`);
    console.log(`Passed: ${results.passedTests}`);
    console.log(`Failed: ${results.failedTests}`);
    console.log(
      `Success Rate: ${((results.passedTests / results.totalTests) * 100).toFixed(1)}%`
    );

    if (results.passedTests === results.totalTests) {
      console.log(
        "\n🎉 ALL TESTS PASSED! Mistral implementation is ready for production."
      );
    } else {
      console.log(
        "\n⚠️  Some tests failed. Review the implementation before proceeding."
      );
    }

    return {
      success: results.passedTests === results.totalTests,
      results,
    };
  } catch (error) {
    console.error("\n💥 Test suite crashed:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Run the advanced test
if (require.main === module) {
  testMistralOCRAdvanced()
    .then((result) => {
      if (result.success) {
        console.log("\n✅ Advanced Mistral test PASSED");
        process.exit(0);
      } else {
        console.log("\n❌ Advanced Mistral test FAILED");
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("\n💥 Advanced test suite crashed:", error);
      process.exit(1);
    });
}

module.exports = { testMistralOCRAdvanced };
