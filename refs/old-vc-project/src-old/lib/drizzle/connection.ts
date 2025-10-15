import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Use Supabase connection string
const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// For Supabase, we need to use the service role key for server-side operations
// The anon key is only for client-side operations
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ACCESS_TOKEN;

// For Supabase, we need to use the direct database connection string
// The service role key is used for API access, not database connection
// We need to use the actual database password or connection string
const connectionString = process.env.DATABASE_URL;

// Check if we have a real database connection
const isMockDatabase =
  !connectionString ||
  connectionString.includes("mock") ||
  connectionString.includes("localhost") ||
  connectionString.includes("[YOUR_DB_PASSWORD]");

let client: any;
let db: any;

if (isMockDatabase) {
  console.warn("Using mock database connection for development");
  // Create a mock database client
  client = {
    query: async () => ({ rows: [] }),
    transaction: async (callback: any) => callback(client),
    end: async () => {},
  };
  db = {
    insert: () => ({
      values: () => ({
        returning: async () => [
          {
            id: "mock-document-id",
            userId: "mock-user-id",
            name: "mock-document",
            type: "fund_report",
            status: "uploaded",
            uploadedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      }),
    }),
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => [],
        }),
      }),
    }),
    update: () => ({
      set: () => ({
        where: async () => [],
      }),
    }),
    delete: () => ({
      where: async () => [],
    }),
  };
} else {
  // Use real database connection
  console.log("Using real Supabase database connection");
  client = postgres(connectionString, { prepare: false });
  db = drizzle(client);
}

export { db };
