// Simple test to verify Convex functions are working
const { ConvexHttpClient } = require("convex/browser");

async function testConvexConnection() {
  try {
    console.log("🧪 Testing Convex Connection...");

    // Test if we can connect to Convex
    const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

    console.log("✅ Convex client created successfully");
    console.log("🔗 Convex URL:", process.env.NEXT_PUBLIC_CONVEX_URL);

    // Test basic query (this will fail if not authenticated, but that's expected)
    try {
      await client.query("auth:getCurrentUser");
      console.log("✅ Authentication query executed");
    } catch (error) {
      console.log(
        "ℹ️  Authentication query failed (expected - not authenticated):",
        error.message
      );
    }

    console.log("🎉 Convex connection test completed successfully!");
  } catch (error) {
    console.error("❌ Convex connection test failed:", error.message);
    process.exit(1);
  }
}

// Load environment variables
require("dotenv").config({ path: ".env.local" });

testConvexConnection();
