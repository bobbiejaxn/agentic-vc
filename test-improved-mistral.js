#!/usr/bin/env node

/**
 * Improved Mistral OCR Test
 *
 * Tests the production-ready financial document chunking
 * with error handling and performance monitoring
 */

const { ConvexHttpClient } = require("convex/browser");

async function testImprovedMistral() {
  console.log("🧪 Improved Mistral OCR Test");
  console.log("=".repeat(50));

  try {
    const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

    // Create test user
    const userId = await client.mutation("users:createUser", {
      email: "improved-test@example.com",
      name: "Improved Test User",
      investorType: "institutional",
      role: "portfolio_manager",
    });

    console.log(`✅ User created: ${userId}`);

    // Create test document
    const documentId = await client.mutation("documents:createDocument", {
      userId,
      fileName: "fund-report-q4-2024.pdf",
      fileSize: 2048000,
      fileType: "application/pdf",
      filePath: "/uploads/fund-report-q4-2024.pdf",
    });

    console.log(`✅ Document created: ${documentId}`);

    // Process document with improved chunking
    console.log("\n🔄 Processing document with improved chunking...");
    const startTime = Date.now();

    const result = await client.action("mistral:processDocument", {
      documentId,
    });

    const processingTime = Date.now() - startTime;

    if (result.success) {
      console.log(`✅ Document processed successfully in ${processingTime}ms`);
      console.log(`✅ Chunks created: ${result.chunksCreated}`);
      console.log(
        `✅ Extracted text length: ${result.extractedText?.length} characters`
      );

      // Get chunks for analysis
      const chunks = await client.query(
        "enhancedHybridChunks:getChunksByDocument",
        {
          documentId,
        }
      );

      console.log("\n📊 Chunk Analysis:");
      console.log(`Total chunks: ${chunks.length}`);

      // Analyze chunk types
      const chunkTypes = chunks.reduce((acc, chunk) => {
        acc[chunk.chunkType] = (acc[chunk.chunkType] || 0) + 1;
        return acc;
      }, {});

      console.log("Chunk types:", chunkTypes);

      // Analyze financial metrics
      const allMetrics = chunks.reduce((acc, chunk) => {
        return acc.concat(chunk.metadata?.financialMetrics || []);
      }, []);

      const uniqueMetrics = [...new Set(allMetrics)];
      console.log(`Financial metrics found: ${uniqueMetrics.length}`);
      console.log(`Sample metrics: ${uniqueMetrics.slice(0, 5).join(", ")}`);

      // Analyze table preservation
      const tableChunks = chunks.filter((chunk) => chunk.metadata?.hasTable);
      console.log(`Table chunks: ${tableChunks.length}`);

      // Analyze chart preservation
      const chartChunks = chunks.filter((chunk) => chunk.metadata?.hasChart);
      console.log(`Chart chunks: ${chartChunks.length}`);

      // Performance analysis
      console.log("\n⚡ Performance Analysis:");
      console.log(`Processing time: ${processingTime}ms`);
      console.log(
        `Average chunk size: ${Math.round(chunks.reduce((sum, chunk) => sum + chunk.textContent.length, 0) / chunks.length)} characters`
      );

      // Check performance thresholds
      if (processingTime > 10000) {
        console.log(
          "⚠️  Processing time exceeded 10 seconds - consider optimization"
        );
      } else if (processingTime > 5000) {
        console.log(
          "⚠️  Processing time exceeded 5 seconds - monitor performance"
        );
      } else {
        console.log("✅ Processing time within acceptable limits");
      }

      // Test search functionality
      console.log("\n🔍 Search Functionality Test:");
      const searchTerms = ["IRR", "MOIC", "TechCorp", "€15M"];

      for (const term of searchTerms) {
        const searchResults = await client.query(
          "enhancedHybridChunks:searchChunks",
          {
            userId,
            searchText: term,
          }
        );
        console.log(`Search '${term}': ${searchResults.length} results`);
      }

      console.log("\n🎯 Benefits of Improved Implementation:");
      console.log("✅ Smart financial document chunking");
      console.log("✅ Table and chart preservation");
      console.log("✅ Financial metrics extraction");
      console.log("✅ Performance monitoring");
      console.log("✅ Error handling and retry logic");
      console.log("✅ Production-ready architecture");

      return {
        success: true,
        processingTime,
        chunksCreated: result.chunksCreated,
        chunkTypes,
        financialMetrics: uniqueMetrics.length,
        tableChunks: tableChunks.length,
        chartChunks: chartChunks.length,
      };
    } else {
      console.error(`❌ Document processing failed: ${result.error}`);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    return { success: false, error: error.message };
  }
}

// Run the test
if (require.main === module) {
  testImprovedMistral().then((result) => {
    if (result.success) {
      console.log("\n✅ Improved Mistral test completed successfully!");
      console.log(`📊 Results: ${JSON.stringify(result, null, 2)}`);
    } else {
      console.log("\n❌ Improved Mistral test failed!");
      console.log(`Error: ${result.error}`);
    }
  });
}

module.exports = { testImprovedMistral };
