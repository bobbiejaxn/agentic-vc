import { createClient } from "@supabase/supabase-js";
import { OpenAI } from "openai";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

export class VectorSearchService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Generate embedding for text content
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error("Error generating embedding:", error);
      throw new Error("Failed to generate embedding");
    }
  }

  /**
   * Store document with embedding
   */
  async storeDocumentWithEmbedding(
    documentId: string,
    content: string,
    metadata: any
  ): Promise<void> {
    try {
      const embedding = await this.generateEmbedding(content);

      const { error } = await supabase
        .from("documents")
        .update({
          embedding: JSON.stringify(embedding),
          content_hash: this.generateContentHash(content),
          updated_at: new Date().toISOString(),
        })
        .eq("id", documentId);

      if (error) {
        throw new Error(`Failed to store embedding: ${error.message}`);
      }
    } catch (error) {
      console.error("Error storing document with embedding:", error);
      throw error;
    }
  }

  /**
   * Search for similar documents
   */
  async searchSimilarDocuments(
    query: string,
    similarityThreshold: number = 0.7,
    maxResults: number = 10
  ): Promise<
    Array<{
      id: string;
      name: string;
      type: string;
      similarity: number;
      extractedData: any;
    }>
  > {
    try {
      // First try vector search if database functions are available
      try {
        const queryEmbedding = await this.generateEmbedding(query);

        // Use Supabase RPC to call the similarity search function
        const { data, error } = await supabase.rpc("search_similar_documents", {
          query_embedding: queryEmbedding,
          similarity_threshold: similarityThreshold,
          max_results: maxResults,
        });

        if (!error && data) {
          return data;
        }
      } catch (vectorError) {
        console.warn("Vector search not available, using text search fallback");
      }

      // Fallback to text search
      return this.fallbackTextSearch(query, maxResults);
    } catch (error) {
      console.error("Error in vector search:", error);
      // Fallback to text search
      return this.fallbackTextSearch(query, maxResults);
    }
  }

  /**
   * Fallback text search when vector search is not available
   */
  private async fallbackTextSearch(
    query: string,
    maxResults: number
  ): Promise<
    Array<{
      id: string;
      name: string;
      type: string;
      similarity: number;
      extractedData: any;
    }>
  > {
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("id, name, type, extracted_data")
        .or(
          `name.ilike.%${query}%,extracted_data->>companyName.ilike.%${query}%`
        )
        .limit(maxResults);

      if (error) {
        throw new Error(`Text search failed: ${error.message}`);
      }

      return (data || []).map((doc) => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        similarity: 0.5, // Default similarity for text search
        extractedData: doc.extracted_data,
      }));
    } catch (error) {
      console.error("Fallback text search error:", error);
      return [];
    }
  }

  /**
   * Get document recommendations based on content similarity
   */
  async getDocumentRecommendations(
    documentId: string,
    maxResults: number = 5
  ): Promise<
    Array<{
      id: string;
      name: string;
      type: string;
      similarity: number;
      reason: string;
    }>
  > {
    try {
      // Get the source document
      const { data: sourceDoc, error: sourceError } = await supabase
        .from("documents")
        .select("name, type, extracted_data")
        .eq("id", documentId)
        .single();

      if (sourceError || !sourceDoc) {
        throw new Error("Source document not found");
      }

      // Create a search query based on the document content
      const searchQuery = this.buildSearchQueryFromDocument(sourceDoc);

      // Find similar documents
      const similarDocs = await this.searchSimilarDocuments(
        searchQuery,
        0.6, // Lower threshold for recommendations
        maxResults + 1 // +1 to exclude the source document
      );

      // Filter out the source document and add reasoning
      return similarDocs
        .filter((doc) => doc.id !== documentId)
        .slice(0, maxResults)
        .map((doc) => ({
          ...doc,
          reason: this.generateRecommendationReason(sourceDoc, doc),
        }));
    } catch (error) {
      console.error("Error getting document recommendations:", error);
      return [];
    }
  }

  /**
   * Build search query from document content
   */
  private buildSearchQueryFromDocument(doc: any): string {
    const companyName = doc.extracted_data?.companyName || "";
    const sector = doc.extracted_data?.industrySector || "";
    const stage = doc.extracted_data?.investmentStage || "";

    return `${companyName} ${sector} ${stage}`.trim();
  }

  /**
   * Generate recommendation reason
   */
  private generateRecommendationReason(sourceDoc: any, targetDoc: any): string {
    const sourceCompany = sourceDoc.extracted_data?.companyName || "";
    const targetCompany = targetDoc.extractedData?.companyName || "";

    if (sourceCompany && targetCompany) {
      return `Similar companies: ${sourceCompany} → ${targetCompany}`;
    }

    return `Similar document type: ${targetDoc.type}`;
  }

  /**
   * Generate content hash for deduplication
   */
  private generateContentHash(content: string): string {
    // Simple hash function for content deduplication
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  /**
   * Health check for vector search service
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Test embedding generation
      await this.generateEmbedding("test");

      // Test database connection
      const { error } = await supabase.from("documents").select("id").limit(1);

      return !error;
    } catch (error) {
      console.error("Vector search health check failed:", error);
      return false;
    }
  }
}
