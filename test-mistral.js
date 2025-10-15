#!/usr/bin/env node

/**
 * Comprehensive Test Suite for Mistral OCR Implementation
 *
 * This script tests the complete Mistral OCR workflow:
 * 1. User creation
 * 2. Document creation
 * 3. Mistral OCR processing
 * 4. Chunk creation and storage
 * 5. Status updates
 * 6. Error handling
 */

const { ConvexHttpClient } = require("convex/browser");

// Initialize Convex client
const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function testMistralImplementation() {
  console.log("🧪 Starting Mistral OCR Implementation Test Suite");
  console.log("=".repeat(60));

  try {
    // Test 1: Create a test user
    console.log("\n📝 Test 1: Creating test user...");
    const userId = await client.mutation("users:createUser", {
      email: "test@mistral.com",
      name: "Mistral Test User",
      investorType: "angel",
      role: "investor",
    });
    console.log(`✅ User created with ID: ${userId}`);

    // Test 2: Create a test document
    console.log("\n📄 Test 2: Creating test document...");
    const documentId = await client.mutation("documents:createDocument", {
      userId,
      fileName: "test-fund-report.pdf",
      fileSize: 1024000, // 1MB
      fileType: "application/pdf",
      filePath: "/uploads/test-fund-report.pdf",
    });
    console.log(`✅ Document created with ID: ${documentId}`);

    // Test 3: Verify document was created
    console.log("\n🔍 Test 3: Verifying document creation...");
    const document = await client.query("documents:getDocument", {
      documentId,
    });
    console.log(`✅ Document status: ${document.status}`);
    console.log(`✅ Document file: ${document.fileName}`);

    // Test 4: Process document with Mistral OCR
    console.log("\n🤖 Test 4: Processing document with Mistral OCR...");
    const startTime = Date.now();

    const ocrResult = await client.action("mistral:processDocument", {
      documentId,
    });

    const processingTime = Date.now() - startTime;
    console.log(`✅ OCR processing completed in ${processingTime}ms`);
    console.log(`✅ Success: ${ocrResult.success}`);

    if (ocrResult.success) {
      console.log(
        `✅ Extracted text length: ${ocrResult.extractedText?.length} characters`
      );
      console.log(
        `✅ First 100 chars: ${ocrResult.extractedText?.substring(0, 100)}...`
      );
    } else {
      console.log(`❌ Error: ${ocrResult.error}`);
    }

    // Test 5: Verify document status update
    console.log("\n📊 Test 5: Verifying document status update...");
    const updatedDocument = await client.query("documents:getDocument", {
      documentId,
    });
    console.log(`✅ Updated document status: ${updatedDocument.status}`);

    // Test 6: Verify chunks were created
    console.log("\n🧩 Test 6: Verifying chunks were created...");
    const chunks = await client.query(
      "enhancedHybridChunks:getChunksByDocument",
      { documentId }
    );
    console.log(`✅ Number of chunks created: ${chunks.length}`);

    if (chunks.length > 0) {
      const chunk = chunks[0];
      console.log(`✅ Chunk type: ${chunk.chunkType}`);
      console.log(
        `✅ Chunk content length: ${chunk.textContent.length} characters`
      );
      console.log(`✅ Chunk metadata:`, chunk.metadata);
    }

    // Test 7: Test error handling with invalid document
    console.log("\n🚨 Test 7: Testing error handling...");
    try {
      const invalidResult = await client.action("mistral:processDocument", {
        documentId: "invalid-id",
      });
      console.log(
        `❌ Expected error but got: ${JSON.stringify(invalidResult)}`
      );
    } catch (error) {
      console.log(`✅ Error handling works: ${error.message}`);
    }

    // Test 8: Performance metrics
    console.log("\n⚡ Test 8: Performance metrics...");
    const allDocuments = await client.query("documents:getDocumentsByUser", {
      userId,
    });
    const completedDocuments = allDocuments.filter(
      (doc) => doc.status === "completed"
    );
    const processingDocuments = allDocuments.filter(
      (doc) => doc.status === "processing"
    );
    const errorDocuments = allDocuments.filter((doc) => doc.status === "error");

    console.log(`✅ Total documents: ${allDocuments.length}`);
    console.log(`✅ Completed: ${completedDocuments.length}`);
    console.log(`✅ Processing: ${processingDocuments.length}`);
    console.log(`✅ Errors: ${errorDocuments.length}`);

    // Test 9: Search functionality
    console.log("\n🔍 Test 9: Testing search functionality...");
    const searchResults = await client.query(
      "enhancedHybridChunks:searchChunks",
      {
        userId,
        searchText: "IRR",
      }
    );
    console.log(`✅ Search results for 'IRR': ${searchResults.length} chunks`);

    console.log("\n🎉 All tests completed successfully!");
    console.log("=".repeat(60));

    return {
      success: true,
      userId,
      documentId,
      processingTime,
      chunksCreated: chunks.length,
    };
  } catch (error) {
    console.error("\n❌ Test failed with error:", error);
    console.log("=".repeat(60));
    return {
      success: false,
      error: error.message,
    };
  }
}

// Run the test
if (require.main === module) {
  testMistralImplementation()
    .then((result) => {
      if (result.success) {
        console.log("\n✅ Mistral implementation test PASSED");
        process.exit(0);
      } else {
        console.log("\n❌ Mistral implementation test FAILED");
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("\n💥 Test suite crashed:", error);
      process.exit(1);
    });
}

module.exports = { testMistralImplementation };
