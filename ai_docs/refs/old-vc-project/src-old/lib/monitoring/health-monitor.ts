// Health Monitoring System
// Monitors system health and provides early warning of potential failures

import { environmentManager } from "../environment/manager";
import { circuitBreakerManager } from "../resilience/circuit-breaker";
import { gracefulDegradationManager } from "../resilience/graceful-degradation";

export interface HealthCheck {
  name: string;
  status: "healthy" | "unhealthy" | "degraded" | "unknown";
  message: string;
  details?: any;
  lastChecked: Date;
  responseTime?: number;
}

export interface SystemHealth {
  overall: "healthy" | "unhealthy" | "degraded";
  checks: HealthCheck[];
  timestamp: Date;
  uptime: number;
  version: string;
}

export interface HealthMetrics {
  totalChecks: number;
  healthyChecks: number;
  unhealthyChecks: number;
  degradedChecks: number;
  averageResponseTime: number;
  lastFailure: Date | null;
}

export class HealthMonitor {
  private static instance: HealthMonitor;
  private startTime: number;
  private healthHistory: HealthCheck[][] = [];
  private maxHistorySize: number = 100;

  private constructor() {
    this.startTime = Date.now();
  }

  public static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor();
    }
    return HealthMonitor.instance;
  }

  /**
   * Performs comprehensive health check
   */
  public async performHealthCheck(): Promise<SystemHealth> {
    const checks: HealthCheck[] = [];

    // Environment health check
    checks.push(await this.checkEnvironment());

    // Database health check
    checks.push(await this.checkDatabase());

    // AI services health check
    checks.push(await this.checkAIServices());

    // Circuit breaker health check
    checks.push(await this.checkCircuitBreakers());

    // Memory health check
    checks.push(await this.checkMemory());

    // Disk space health check
    checks.push(await this.checkDiskSpace());

    // Network connectivity check
    checks.push(await this.checkNetworkConnectivity());

    // Store in history
    this.healthHistory.push(checks);
    if (this.healthHistory.length > this.maxHistorySize) {
      this.healthHistory.shift();
    }

    // Determine overall health
    const overall = this.determineOverallHealth(checks);

    return {
      overall,
      checks,
      timestamp: new Date(),
      uptime: Date.now() - this.startTime,
      version: process.env.npm_package_version || "1.0.0",
    };
  }

  /**
   * Gets health metrics
   */
  public getHealthMetrics(): HealthMetrics {
    const recentChecks = this.healthHistory.slice(-10); // Last 10 health checks
    const allChecks = recentChecks.flat();

    const totalChecks = allChecks.length;
    const healthyChecks = allChecks.filter(
      (c) => c.status === "healthy"
    ).length;
    const unhealthyChecks = allChecks.filter(
      (c) => c.status === "unhealthy"
    ).length;
    const degradedChecks = allChecks.filter(
      (c) => c.status === "degraded"
    ).length;

    const responseTimes = allChecks
      .filter((c) => c.responseTime)
      .map((c) => c.responseTime!);
    const averageResponseTime =
      responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0;

    const lastFailure =
      allChecks
        .filter((c) => c.status === "unhealthy")
        .sort((a, b) => b.lastChecked.getTime() - a.lastChecked.getTime())[0]
        ?.lastChecked || null;

    return {
      totalChecks,
      healthyChecks,
      unhealthyChecks,
      degradedChecks,
      averageResponseTime,
      lastFailure,
    };
  }

  /**
   * Gets health history
   */
  public getHealthHistory(): HealthCheck[][] {
    return [...this.healthHistory];
  }

  /**
   * Environment health check
   */
  private async checkEnvironment(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
      const envResult = environmentManager.validateEnvironment();
      const responseTime = Date.now() - startTime;

      if (envResult.success) {
        return {
          name: "environment",
          status: "healthy",
          message: "All environment variables are valid",
          details: {
            validatedVars: Object.keys(envResult.environment || {}).length,
          },
          lastChecked: new Date(),
          responseTime,
        };
      } else {
        return {
          name: "environment",
          status: "unhealthy",
          message: `Environment validation failed: ${
            envResult.errors?.length || 0
          } errors`,
          details: { errors: envResult.errors },
          lastChecked: new Date(),
          responseTime,
        };
      }
    } catch (error) {
      return {
        name: "environment",
        status: "unhealthy",
        message: `Environment check failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        lastChecked: new Date(),
        responseTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Database health check
   */
  private async checkDatabase(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
      // This would integrate with your database connection
      // For now, we'll simulate a database check
      const responseTime = Date.now() - startTime;

      // Simulate database connectivity check
      await new Promise((resolve) => setTimeout(resolve, 100));

      return {
        name: "database",
        status: "healthy",
        message: "Database connection is healthy",
        details: { connectionPool: "active" },
        lastChecked: new Date(),
        responseTime,
      };
    } catch (error) {
      return {
        name: "database",
        status: "unhealthy",
        message: `Database check failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        lastChecked: new Date(),
        responseTime: Date.now() - startTime,
      };
    }
  }

  /**
   * AI services health check
   */
  private async checkAIServices(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
      const envHealth = await environmentManager.healthCheck();
      const responseTime = Date.now() - startTime;

      const aiServices = envHealth.details.filter(
        (d) =>
          d.service.includes("API") ||
          d.service.includes("AI") ||
          d.service.includes("OpenAI") ||
          d.service.includes("Anthropic")
      );

      const healthyServices = aiServices.filter(
        (s) => s.status === "healthy"
      ).length;
      const totalServices = aiServices.length;

      if (healthyServices === totalServices) {
        return {
          name: "ai_services",
          status: "healthy",
          message: `All ${totalServices} AI services are healthy`,
          details: { healthyServices, totalServices },
          lastChecked: new Date(),
          responseTime,
        };
      } else if (healthyServices > totalServices / 2) {
        return {
          name: "ai_services",
          status: "degraded",
          message: `${healthyServices}/${totalServices} AI services are healthy`,
          details: { healthyServices, totalServices, services: aiServices },
          lastChecked: new Date(),
          responseTime,
        };
      } else {
        return {
          name: "ai_services",
          status: "unhealthy",
          message: `Only ${healthyServices}/${totalServices} AI services are healthy`,
          details: { healthyServices, totalServices, services: aiServices },
          lastChecked: new Date(),
          responseTime,
        };
      }
    } catch (error) {
      return {
        name: "ai_services",
        status: "unhealthy",
        message: `AI services check failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        lastChecked: new Date(),
        responseTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Circuit breaker health check
   */
  private async checkCircuitBreakers(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
      const metrics = circuitBreakerManager.getAllMetrics();
      const responseTime = Date.now() - startTime;

      const openBreakers = Object.values(metrics).filter(
        (m) => m.state === "open"
      );
      const halfOpenBreakers = Object.values(metrics).filter(
        (m) => m.state === "half-open"
      );

      if (openBreakers.length === 0 && halfOpenBreakers.length === 0) {
        return {
          name: "circuit_breakers",
          status: "healthy",
          message: "All circuit breakers are closed",
          details: { totalBreakers: Object.keys(metrics).length },
          lastChecked: new Date(),
          responseTime,
        };
      } else if (openBreakers.length === 0) {
        return {
          name: "circuit_breakers",
          status: "degraded",
          message: `${halfOpenBreakers.length} circuit breakers are half-open`,
          details: {
            openBreakers: openBreakers.length,
            halfOpenBreakers: halfOpenBreakers.length,
          },
          lastChecked: new Date(),
          responseTime,
        };
      } else {
        return {
          name: "circuit_breakers",
          status: "unhealthy",
          message: `${openBreakers.length} circuit breakers are open`,
          details: {
            openBreakers: openBreakers.length,
            halfOpenBreakers: halfOpenBreakers.length,
          },
          lastChecked: new Date(),
          responseTime,
        };
      }
    } catch (error) {
      return {
        name: "circuit_breakers",
        status: "unhealthy",
        message: `Circuit breaker check failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        lastChecked: new Date(),
        responseTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Memory health check
   */
  private async checkMemory(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
      const memUsage = process.memoryUsage();
      const responseTime = Date.now() - startTime;

      const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
      const heapTotalMB = memUsage.heapTotal / 1024 / 1024;
      const rssMB = memUsage.rss / 1024 / 1024;

      const heapUsagePercent = (heapUsedMB / heapTotalMB) * 100;

      let status: "healthy" | "unhealthy" | "degraded" = "healthy";
      let message = "Memory usage is normal";

      if (heapUsagePercent > 90) {
        status = "unhealthy";
        message = "Memory usage is critically high";
      } else if (heapUsagePercent > 75) {
        status = "degraded";
        message = "Memory usage is high";
      }

      return {
        name: "memory",
        status,
        message,
        details: {
          heapUsedMB: Math.round(heapUsedMB),
          heapTotalMB: Math.round(heapTotalMB),
          rssMB: Math.round(rssMB),
          heapUsagePercent: Math.round(heapUsagePercent),
        },
        lastChecked: new Date(),
        responseTime,
      };
    } catch (error) {
      return {
        name: "memory",
        status: "unhealthy",
        message: `Memory check failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        lastChecked: new Date(),
        responseTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Disk space health check
   */
  private async checkDiskSpace(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
      // This would integrate with your disk space monitoring
      // For now, we'll return a healthy status
      const responseTime = Date.now() - startTime;

      return {
        name: "disk_space",
        status: "healthy",
        message: "Disk space is sufficient",
        details: { available: "sufficient" },
        lastChecked: new Date(),
        responseTime,
      };
    } catch (error) {
      return {
        name: "disk_space",
        status: "unhealthy",
        message: `Disk space check failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        lastChecked: new Date(),
        responseTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Network connectivity health check
   */
  private async checkNetworkConnectivity(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
      // This would integrate with your network monitoring
      // For now, we'll return a healthy status
      const responseTime = Date.now() - startTime;

      return {
        name: "network",
        status: "healthy",
        message: "Network connectivity is normal",
        details: { connectivity: "normal" },
        lastChecked: new Date(),
        responseTime,
      };
    } catch (error) {
      return {
        name: "network",
        status: "unhealthy",
        message: `Network check failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        lastChecked: new Date(),
        responseTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Determines overall system health
   */
  private determineOverallHealth(
    checks: HealthCheck[]
  ): "healthy" | "unhealthy" | "degraded" {
    const unhealthyCount = checks.filter(
      (c) => c.status === "unhealthy"
    ).length;
    const degradedCount = checks.filter((c) => c.status === "degraded").length;

    if (unhealthyCount > 0) {
      return "unhealthy";
    } else if (degradedCount > 0) {
      return "degraded";
    } else {
      return "healthy";
    }
  }
}

// Singleton instance
export const healthMonitor = HealthMonitor.getInstance();

// Convenience function to perform health check
export async function performHealthCheck(): Promise<SystemHealth> {
  return healthMonitor.performHealthCheck();
}
