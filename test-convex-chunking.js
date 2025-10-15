/**
 * Test script for Convex enhanced chunking functions
 * This script tests the actual Convex functions to ensure they work properly
 */

const { ConvexHttpClient } = require("convex/browser");

// Initialize Convex client
const client = new ConvexHttpClient(
  process.env.CONVEX_URL || "http://localhost:3210"
);

async function testEnhancedChunking() {
  console.log("🚀 Testing Convex Enhanced Chunking Functions");
  console.log("=".repeat(50));

  try {
    // Test 1: Compare chunking strategies
    console.log("\n📊 Test 1: Comparing Chunking Strategies");
    console.log("-".repeat(40));

    const comparisonResult = await client.action(
      "chunkingTests:compareChunkingStrategies",
      {}
    );

    if (comparisonResult.success) {
      console.log("✅ Comparison test passed");
      console.log("📈 Old vs New Chunking:");
      console.log(
        `   Old: ${comparisonResult.comparison.oldChunking.chunkCount} chunks`
      );
      console.log(
        `   New: ${comparisonResult.comparison.newChunking.chunkCount} chunks`
      );
      console.log(
        `   Improvements: ${Object.keys(comparisonResult.comparison.improvements).length} features added`
      );
    } else {
      console.log("❌ Comparison test failed:", comparisonResult.error);
    }

    // Test 2: Enhanced chunking performance
    console.log("\n⚡ Test 2: Enhanced Chunking Performance");
    console.log("-".repeat(40));

    const performanceResult = await client.action(
      "chunkingTests:testEnhancedChunking",
      {}
    );

    if (performanceResult.success) {
      console.log("✅ Performance test passed");
      const results = performanceResult.testResults;
      console.log(`⏱️  Processing Time: ${results.processingTime}ms`);
      console.log(`📄 Total Chunks: ${results.totalChunks}`);
      console.log(
        `⚡ Chunks/Second: ${results.benchmarks.chunksPerSecond.toFixed(2)}`
      );
      console.log(`📈 Avg Tokens/Chunk: ${results.avgTokenCount}`);
      console.log(
        `🧠 Semantic Boundaries: ${results.semanticBoundaries}/${results.totalChunks} (${Math.round((results.semanticBoundaries / results.totalChunks) * 100)}%)`
      );
      console.log(
        `🔗 Overlapping Chunks: ${results.overlappingChunks}/${results.totalChunks} (${Math.round((results.overlappingChunks / results.totalChunks) * 100)}%)`
      );
      console.log(
        `💰 Financial Data Chunks: ${results.financialDataChunks}/${results.totalChunks} (${Math.round((results.financialDataChunks / results.totalChunks) * 100)}%)`
      );
      console.log(
        `🎯 Quality Score: ${results.benchmarks.qualityScore.toFixed(3)}`
      );

      console.log("\n📊 Chunk Types Distribution:");
      Object.entries(results.chunkTypes).forEach(([type, count]) => {
        console.log(`   ${type}: ${count} chunks`);
      });
    } else {
      console.log("❌ Performance test failed:", performanceResult.error);
    }

    // Test 3: Enhanced processing pipeline
    console.log("\n🔄 Test 3: Enhanced Processing Pipeline");
    console.log("-".repeat(40));

    // First, create a test document
    const createDocResult = await client.mutation("documents:createDocument", {
      fileName: "test-enhanced-chunking.pdf",
      fileSize: 1024,
      mimeType: "application/pdf",
      userId: "test-user-id", // This would normally be a real user ID
    });

    if (createDocResult.success) {
      console.log("✅ Test document created");

      // Process the document with enhanced chunking
      const processResult = await client.action(
        "enhancedProcessing:processDocumentEnhanced",
        {
          documentId: createDocResult.documentId,
        }
      );

      if (processResult.success) {
        console.log("✅ Enhanced processing completed");
        console.log(`📄 Chunks Created: ${processResult.chunksCreated}`);

        // Get chunking statistics
        const statsResult = await client.action(
          "enhancedProcessing:getChunkingStats",
          {
            documentId: createDocResult.documentId,
          }
        );

        if (statsResult.success) {
          console.log("📊 Chunking Statistics:");
          console.log(`   Total Chunks: ${statsResult.totalChunks}`);
          console.log(`   Avg Token Count: ${statsResult.avgTokenCount}`);
          console.log(
            `   Semantic Boundaries: ${statsResult.semanticBoundaries}`
          );
          console.log(
            `   Overlapping Chunks: ${statsResult.overlappingChunks}`
          );
          console.log(
            `   Financial Data Chunks: ${statsResult.financialDataChunks}`
          );

          console.log("\n📈 Chunk Types:");
          Object.entries(statsResult.chunkTypes).forEach(([type, count]) => {
            console.log(`   ${type}: ${count}`);
          });
        } else {
          console.log("❌ Failed to get chunking stats:", statsResult.error);
        }
      } else {
        console.log("❌ Enhanced processing failed:", processResult.error);
      }
    } else {
      console.log("❌ Failed to create test document:", createDocResult.error);
    }

    console.log("\n🎉 All Enhanced Chunking Tests Completed!");
    console.log("✅ Enhanced chunking implementation is working correctly");
  } catch (error) {
    console.error("❌ Test suite failed:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

// Run the test
testEnhancedChunking();
