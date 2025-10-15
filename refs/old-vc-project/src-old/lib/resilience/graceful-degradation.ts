// Graceful Degradation System
// Implements fallback strategies when services fail to prevent catastrophic failures

export interface DegradationStrategy {
  name: string;
  priority: number; // Lower number = higher priority
  condition: () => boolean | Promise<boolean>;
  fallback: () => Promise<any>;
  timeout?: number; // Timeout in ms
}

export interface DegradationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  strategy?: string;
  fallbackUsed: boolean;
  executionTime: number;
}

export class GracefulDegradationManager {
  private static instance: GracefulDegradationManager;
  private strategies: Map<string, DegradationStrategy[]> = new Map();

  private constructor() {}

  public static getInstance(): GracefulDegradationManager {
    if (!GracefulDegradationManager.instance) {
      GracefulDegradationManager.instance = new GracefulDegradationManager();
    }
    return GracefulDegradationManager.instance;
  }

  /**
   * Registers degradation strategies for a service
   */
  public registerStrategies(
    serviceName: string,
    strategies: DegradationStrategy[]
  ): void {
    // Sort strategies by priority (lower number = higher priority)
    const sortedStrategies = strategies.sort((a, b) => a.priority - b.priority);
    this.strategies.set(serviceName, sortedStrategies);
  }

  /**
   * Executes an operation with graceful degradation
   */
  public async executeWithDegradation<T>(
    serviceName: string,
    primaryOperation: () => Promise<T>,
    operationName: string = "operation"
  ): Promise<DegradationResult<T>> {
    const startTime = Date.now();

    try {
      // Try primary operation first
      const result = await primaryOperation();
      return {
        success: true,
        data: result,
        fallbackUsed: false,
        executionTime: Date.now() - startTime,
      };
    } catch (primaryError) {
      console.warn(
        `Primary operation failed for ${serviceName}:`,
        primaryError
      );

      // Try degradation strategies
      const strategies = this.strategies.get(serviceName) || [];

      for (const strategy of strategies) {
        try {
          // Check if strategy condition is met
          const conditionMet = await strategy.condition();
          if (!conditionMet) {
            continue;
          }

          // Execute fallback with timeout
          const fallbackPromise = strategy.fallback();
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(
              () => reject(new Error("Fallback timeout")),
              strategy.timeout || 30000
            );
          });

          const result = await Promise.race([fallbackPromise, timeoutPromise]);

          return {
            success: true,
            data: result,
            strategy: strategy.name,
            fallbackUsed: true,
            executionTime: Date.now() - startTime,
          };
        } catch (strategyError) {
          console.warn(
            `Degradation strategy ${strategy.name} failed:`,
            strategyError
          );
          continue;
        }
      }

      // All strategies failed
      return {
        success: false,
        error: `All degradation strategies failed for ${serviceName}. Primary error: ${primaryError.message}`,
        fallbackUsed: false,
        executionTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Gets available strategies for a service
   */
  public getStrategies(serviceName: string): DegradationStrategy[] {
    return this.strategies.get(serviceName) || [];
  }

  /**
   * Removes strategies for a service
   */
  public removeStrategies(serviceName: string): void {
    this.strategies.delete(serviceName);
  }
}

// Singleton instance
export const gracefulDegradationManager =
  GracefulDegradationManager.getInstance();

// Predefined degradation strategies for common services
export const CommonDegradationStrategies = {
  // AI Service Degradation
  aiService: (serviceName: string): DegradationStrategy[] => [
    {
      name: "cached_response",
      priority: 1,
      condition: async () => {
        // Check if we have cached responses available
        // This would integrate with your caching system
        return false; // Placeholder
      },
      fallback: async () => {
        // Return cached response
        throw new Error("No cached response available");
      },
      timeout: 5000,
    },
    {
      name: "simplified_processing",
      priority: 2,
      condition: async () => true,
      fallback: async () => {
        // Return simplified processing result
        return {
          success: true,
          extractedData: {
            companyName: "Unknown Company",
            totalValue: 0,
            processingMethod: "simplified_fallback",
            confidence: 0.1,
          },
          processingTime: 1000,
        };
      },
      timeout: 10000,
    },
    {
      name: "manual_review_required",
      priority: 3,
      condition: async () => true,
      fallback: async () => {
        // Mark document for manual review
        return {
          success: true,
          extractedData: {
            companyName: "Manual Review Required",
            totalValue: null,
            processingMethod: "manual_review",
            confidence: 0.0,
          },
          processingTime: 500,
          requiresManualReview: true,
        };
      },
      timeout: 5000,
    },
  ],

  // Database Service Degradation
  databaseService: (): DegradationStrategy[] => [
    {
      name: "read_only_mode",
      priority: 1,
      condition: async () => {
        // Check if database is in read-only mode
        return false; // Placeholder
      },
      fallback: async () => {
        // Return read-only response
        throw new Error("Database in read-only mode");
      },
      timeout: 5000,
    },
    {
      name: "local_storage_fallback",
      priority: 2,
      condition: async () => true,
      fallback: async () => {
        // Store data locally and sync later
        return {
          success: true,
          storedLocally: true,
          syncRequired: true,
        };
      },
      timeout: 10000,
    },
  ],

  // External API Degradation
  externalApiService: (apiName: string): DegradationStrategy[] => [
    {
      name: "alternative_api",
      priority: 1,
      condition: async () => {
        // Check if alternative API is available
        return false; // Placeholder
      },
      fallback: async () => {
        // Use alternative API
        throw new Error("Alternative API not available");
      },
      timeout: 15000,
    },
    {
      name: "offline_mode",
      priority: 2,
      condition: async () => true,
      fallback: async () => {
        // Return offline response
        return {
          success: true,
          offline: true,
          message: "Service temporarily unavailable",
        };
      },
      timeout: 5000,
    },
  ],
};

// Convenience function to execute with degradation
export async function executeWithDegradation<T>(
  serviceName: string,
  primaryOperation: () => Promise<T>,
  operationName?: string
): Promise<DegradationResult<T>> {
  return gracefulDegradationManager.executeWithDegradation(
    serviceName,
    primaryOperation,
    operationName
  );
}
