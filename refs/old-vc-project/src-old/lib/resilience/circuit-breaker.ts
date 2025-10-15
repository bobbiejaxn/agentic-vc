// Circuit Breaker Pattern Implementation
// Prevents catastrophic failures by implementing automatic failure detection and recovery

export interface CircuitBreakerConfig {
  failureThreshold: number; // Number of failures before opening circuit
  recoveryTimeout: number; // Time in ms before attempting recovery
  monitoringPeriod: number; // Time in ms for monitoring window
  halfOpenMaxCalls: number; // Max calls allowed in half-open state
}

export interface CircuitBreakerState {
  state: "closed" | "open" | "half-open";
  failureCount: number;
  lastFailureTime: number;
  nextAttemptTime: number;
  successCount: number;
  totalCalls: number;
}

export interface CircuitBreakerMetrics {
  state: string;
  failureCount: number;
  successCount: number;
  totalCalls: number;
  failureRate: number;
  lastFailureTime: Date | null;
  nextAttemptTime: Date | null;
}

export class CircuitBreaker {
  private config: CircuitBreakerConfig;
  private state: CircuitBreakerState;
  private callHistory: Array<{ timestamp: number; success: boolean }> = [];

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = {
      failureThreshold: config.failureThreshold || 5,
      recoveryTimeout: config.recoveryTimeout || 60000, // 1 minute
      monitoringPeriod: config.monitoringPeriod || 300000, // 5 minutes
      halfOpenMaxCalls: config.halfOpenMaxCalls || 3,
    };

    this.state = {
      state: "closed",
      failureCount: 0,
      lastFailureTime: 0,
      nextAttemptTime: 0,
      successCount: 0,
      totalCalls: 0,
    };
  }

  /**
   * Executes a function with circuit breaker protection
   */
  public async execute<T>(
    operation: () => Promise<T>,
    fallback?: () => Promise<T>
  ): Promise<T> {
    // Check if circuit is open
    if (this.state.state === "open") {
      if (Date.now() < this.state.nextAttemptTime) {
        throw new Error("Circuit breaker is open");
      }
      // Transition to half-open
      this.state.state = "half-open";
      this.state.successCount = 0;
    }

    // Check half-open call limit
    if (
      this.state.state === "half-open" &&
      this.state.successCount >= this.config.halfOpenMaxCalls
    ) {
      throw new Error("Circuit breaker half-open call limit exceeded");
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();

      // Try fallback if available
      if (fallback) {
        try {
          return await fallback();
        } catch (fallbackError) {
          throw new Error(
            `Primary operation failed: ${error.message}. Fallback also failed: ${fallbackError.message}`
          );
        }
      }

      throw error;
    }
  }

  /**
   * Records a successful operation
   */
  private onSuccess(): void {
    this.state.successCount++;
    this.state.totalCalls++;
    this.recordCall(true);

    // If in half-open state and we have enough successes, close the circuit
    if (
      this.state.state === "half-open" &&
      this.state.successCount >= this.config.halfOpenMaxCalls
    ) {
      this.state.state = "closed";
      this.state.failureCount = 0;
    }
  }

  /**
   * Records a failed operation
   */
  private onFailure(): void {
    this.state.failureCount++;
    this.state.totalCalls++;
    this.state.lastFailureTime = Date.now();
    this.recordCall(false);

    // Check if we should open the circuit
    if (this.state.failureCount >= this.config.failureThreshold) {
      this.state.state = "open";
      this.state.nextAttemptTime = Date.now() + this.config.recoveryTimeout;
    }
  }

  /**
   * Records a call in the history for monitoring
   */
  private recordCall(success: boolean): void {
    const now = Date.now();
    this.callHistory.push({ timestamp: now, success });

    // Remove old entries outside monitoring period
    const cutoff = now - this.config.monitoringPeriod;
    this.callHistory = this.callHistory.filter(
      (call) => call.timestamp > cutoff
    );
  }

  /**
   * Gets current circuit breaker metrics
   */
  public getMetrics(): CircuitBreakerMetrics {
    const recentCalls = this.callHistory.filter(
      (call) => call.timestamp > Date.now() - this.config.monitoringPeriod
    );

    const failures = recentCalls.filter((call) => !call.success).length;
    const total = recentCalls.length;
    const failureRate = total > 0 ? (failures / total) * 100 : 0;

    return {
      state: this.state.state,
      failureCount: this.state.failureCount,
      successCount: this.state.successCount,
      totalCalls: this.state.totalCalls,
      failureRate,
      lastFailureTime: this.state.lastFailureTime
        ? new Date(this.state.lastFailureTime)
        : null,
      nextAttemptTime: this.state.nextAttemptTime
        ? new Date(this.state.nextAttemptTime)
        : null,
    };
  }

  /**
   * Manually resets the circuit breaker
   */
  public reset(): void {
    this.state = {
      state: "closed",
      failureCount: 0,
      lastFailureTime: 0,
      nextAttemptTime: 0,
      successCount: 0,
      totalCalls: 0,
    };
    this.callHistory = [];
  }

  /**
   * Gets the current state
   */
  public getState(): CircuitBreakerState {
    return { ...this.state };
  }
}

// Circuit breaker manager for multiple services
export class CircuitBreakerManager {
  private static instance: CircuitBreakerManager;
  private breakers: Map<string, CircuitBreaker> = new Map();

  private constructor() {}

  public static getInstance(): CircuitBreakerManager {
    if (!CircuitBreakerManager.instance) {
      CircuitBreakerManager.instance = new CircuitBreakerManager();
    }
    return CircuitBreakerManager.instance;
  }

  /**
   * Gets or creates a circuit breaker for a service
   */
  public getBreaker(
    serviceName: string,
    config?: Partial<CircuitBreakerConfig>
  ): CircuitBreaker {
    if (!this.breakers.has(serviceName)) {
      this.breakers.set(serviceName, new CircuitBreaker(config));
    }
    return this.breakers.get(serviceName)!;
  }

  /**
   * Gets metrics for all circuit breakers
   */
  public getAllMetrics(): Record<string, CircuitBreakerMetrics> {
    const metrics: Record<string, CircuitBreakerMetrics> = {};
    for (const [serviceName, breaker] of this.breakers) {
      metrics[serviceName] = breaker.getMetrics();
    }
    return metrics;
  }

  /**
   * Resets all circuit breakers
   */
  public resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.reset();
    }
  }

  /**
   * Resets a specific circuit breaker
   */
  public reset(serviceName: string): void {
    const breaker = this.breakers.get(serviceName);
    if (breaker) {
      breaker.reset();
    }
  }
}

// Singleton instance
export const circuitBreakerManager = CircuitBreakerManager.getInstance();

// Convenience function to get a circuit breaker
export function getCircuitBreaker(
  serviceName: string,
  config?: Partial<CircuitBreakerConfig>
): CircuitBreaker {
  return circuitBreakerManager.getBreaker(serviceName, config);
}
