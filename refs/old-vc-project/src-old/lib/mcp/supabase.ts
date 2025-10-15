/**
 * MCP Supabase Client
 * Wrapper for MCP Supabase operations
 */

export async function mcp_supabase_execute_sql(
  projectId: string,
  query: string
): Promise<any[]> {
  // This would normally call the MCP Supabase service
  // For now, we'll use a mock implementation that returns the expected format
  console.log(`MCP Supabase Query: ${query}`);

  // Mock implementation - in a real scenario, this would call the MCP service
  // For now, we'll return empty results to avoid errors
  return [];
}
