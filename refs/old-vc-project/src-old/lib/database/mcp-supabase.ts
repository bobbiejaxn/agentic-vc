/**
 * MCP Supabase Database Service
 * Uses the MCP Supabase connection for database operations
 * This is a fallback when direct database connection fails
 */

import { mcp_supabase_execute_sql } from "@/lib/mcp/supabase";

export class MCPSupabaseService {
  private static projectId = "eerbpznanmheerbxjvck";

  /**
   * Execute a SQL query using MCP Supabase
   */
  static async executeQuery(query: string): Promise<any[]> {
    try {
      const result = await mcp_supabase_execute_sql(this.projectId, query);
      return result;
    } catch (error) {
      console.error("MCP Supabase query error:", error);
      throw error;
    }
  }

  /**
   * Insert a document
   */
  static async insertDocument(documentData: {
    userId: string;
    portfolioId?: string;
    name: string;
    type: string;
    status: string;
    filePath?: string;
    fileSize?: string;
    mimeType?: string;
    extractedData?: any;
    processingError?: string;
  }): Promise<{ id: string }> {
    const query = `
      INSERT INTO documents (
        user_id, portfolio_id, name, type, status, file_path, 
        file_size, mime_type, extracted_data, processing_error
      ) VALUES (
        '${documentData.userId}',
        ${documentData.portfolioId ? `'${documentData.portfolioId}'` : "NULL"},
        '${documentData.name.replace(/'/g, "''")}',
        '${documentData.type}',
        '${documentData.status}',
        ${documentData.filePath ? `'${documentData.filePath}'` : "NULL"},
        ${documentData.fileSize ? `'${documentData.fileSize}'` : "NULL"},
        ${documentData.mimeType ? `'${documentData.mimeType}'` : "NULL"},
        ${
          documentData.extractedData
            ? `'${JSON.stringify(documentData.extractedData).replace(
                /'/g,
                "''"
              )}'::jsonb`
            : "NULL"
        },
        ${
          documentData.processingError
            ? `'${documentData.processingError.replace(/'/g, "''")}'`
            : "NULL"
        }
      ) RETURNING id;
    `;

    const result = await this.executeQuery(query);
    return { id: result[0].id };
  }

  /**
   * Update document status
   */
  static async updateDocumentStatus(
    documentId: string,
    status: string,
    extractedData?: any,
    processingError?: string
  ): Promise<void> {
    const query = `
      UPDATE documents 
      SET status = '${status}',
          ${
            extractedData
              ? `extracted_data = '${JSON.stringify(extractedData).replace(
                  /'/g,
                  "''"
                )}'::jsonb,`
              : ""
          }
          ${
            processingError
              ? `processing_error = '${processingError.replace(/'/g, "''")}',`
              : ""
          }
          processed_at = NOW(),
          updated_at = NOW()
      WHERE id = '${documentId}';
    `;

    await this.executeQuery(query);
  }

  /**
   * Get user documents
   */
  static async getUserDocuments(userId: string): Promise<any[]> {
    const query = `
      SELECT * FROM documents 
      WHERE user_id = '${userId}' 
      ORDER BY uploaded_at DESC;
    `;

    return await this.executeQuery(query);
  }

  /**
   * Get document by ID
   */
  static async getDocumentById(documentId: string): Promise<any> {
    const query = `
      SELECT * FROM documents 
      WHERE id = '${documentId}';
    `;

    const result = await this.executeQuery(query);
    return result[0] || null;
  }

  /**
   * Ensure user exists
   */
  static async ensureUserExists(userId: string): Promise<any> {
    const query = `
      SELECT * FROM users 
      WHERE id = '${userId}';
    `;

    const result = await this.executeQuery(query);
    if (result.length === 0) {
      // Create user if doesn't exist
      const insertQuery = `
        INSERT INTO users (id, email, full_name, role) 
        VALUES ('${userId}', 'dev-user@example.com', 'Dev User', 'angel')
        RETURNING *;
      `;
      const newUser = await this.executeQuery(insertQuery);
      return newUser[0];
    }
    return result[0];
  }

  /**
   * Ensure default portfolio exists
   */
  static async ensureDefaultPortfolio(userId: string): Promise<any> {
    const query = `
      SELECT * FROM portfolios 
      WHERE user_id = '${userId}' 
      LIMIT 1;
    `;

    const result = await this.executeQuery(query);
    if (result.length === 0) {
      // Create default portfolio if doesn't exist
      const insertQuery = `
        INSERT INTO portfolios (user_id, name, description) 
        VALUES ('${userId}', 'Default Portfolio', 'Default portfolio for user')
        RETURNING *;
      `;
      const newPortfolio = await this.executeQuery(insertQuery);
      return newPortfolio[0];
    }
    return result[0];
  }
}
