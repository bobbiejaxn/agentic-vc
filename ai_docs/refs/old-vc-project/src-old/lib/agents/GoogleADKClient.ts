/**
 * Google ADK Client - Communicates with Python Google ADK service
 * This bridges your Node.js app with the Python Google ADK implementation
 */
export class GoogleADKClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl =
      process.env.GOOGLE_ADK_SERVICE_URL || "http://localhost:8000";
    this.apiKey = process.env.GOOGLE_ADK_API_KEY || "dev-key";
  }

  /**
   * Process document through Google ADK pipeline
   */
  async processDocument(document: {
    id: string;
    content: string;
    fileName: string;
    type: string;
    structuredData?: any;
  }): Promise<{
    structuredData: any;
    marketIntelligence: any;
    portfolioAnalysis: any;
    recommendations: any;
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/vc-intelligence/process`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            document: {
              id: document.id,
              content: document.content,
              fileName: document.fileName,
              type: document.type,
              structuredData: document.structuredData,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Google ADK service error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Google ADK communication error:", error);
      throw error;
    }
  }

  /**
   * Get market intelligence through Google ADK
   */
  async getMarketIntelligence(query: {
    companyName?: string;
    sector?: string;
    geography?: string;
  }): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/vc-intelligence/market`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({ query }),
        }
      );

      if (!response.ok) {
        throw new Error(`Google ADK service error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Google ADK communication error:", error);
      throw error;
    }
  }

  /**
   * Analyze portfolio through Google ADK
   */
  async analyzePortfolio(portfolioId: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/vc-intelligence/portfolio`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({ portfolioId }),
        }
      );

      if (!response.ok) {
        throw new Error(`Google ADK service error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Google ADK communication error:", error);
      throw error;
    }
  }

  /**
   * Health check for Google ADK service
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error("Google ADK health check failed:", error);
      return false;
    }
  }
}
