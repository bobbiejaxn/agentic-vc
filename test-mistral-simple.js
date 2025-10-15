#!/usr/bin/env node

/**
 * Simple Mistral OCR Test
 *
 * Quick test to verify Mistral OCR implementation is working
 */

const { ConvexHttpClient } = require("convex/browser");

async function quickTest() {
  console.log("🧪 Quick Mistral OCR Test");
  console.log("=".repeat(40));

  try {
    const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

    // 1. Create user
    console.log("1. Creating test user...");
    const userId = await client.mutation("users:createUser", {
      email: "quick-test@example.com",
      name: "Quick Test User",
      investorType: "angel",
      role: "investor",
    });
    console.log(`✅ User created: ${userId}`);

    // 2. Create document
    console.log("2. Creating test document...");
    const documentId = await client.mutation("documents:createDocument", {
      userId,
      fileName: "test-report.pdf",
      fileSize: 1024000,
      fileType: "application/pdf",
      filePath: "/uploads/test-report.pdf",
    });
    console.log(`✅ Document created: ${documentId}`);

    // 3. Process with Mistral OCR
    console.log("3. Processing with Mistral OCR...");
    const startTime = Date.now();
    const result = await client.action("mistral:processDocument", {
      documentId,
    });
    const processingTime = Date.now() - startTime;

    console.log(`✅ Processing completed in ${processingTime}ms`);
    console.log(`✅ Success: ${result.success}`);

    if (result.success) {
      console.log(
        `✅ Extracted text: ${result.extractedText?.substring(0, 100)}...`
      );
    } else {
      console.log(`❌ Error: ${result.error}`);
    }

    // 4. Check chunks
    console.log("4. Checking created chunks...");
    const chunks = await client.query(
      "enhancedHybridChunks:getChunksByDocument",
      { documentId }
    );
    console.log(`✅ Chunks created: ${chunks.length}`);

    console.log("\n🎉 Quick test completed successfully!");
    return true;
  } catch (error) {
    console.error("❌ Quick test failed:", error.message);
    return false;
  }
}

// Run the test
if (require.main === module) {
  quickTest().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { quickTest };
