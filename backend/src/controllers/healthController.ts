import { Request, Response } from "express";
import { Server } from "http";
import { prisma } from "../prisma.js";

/**
 * Enhanced Health Check Controller
 * Verifies database responsiveness, server uptime, and memory usage.
 */
export async function getHealthCheck(_req: Request, res: Response): Promise<void> {
  const startDb = Date.now();
  let dbStatus = "connected";
  let dbLatencyMs = 0;
  let dbError: string | null = null;

  try {
    // Probe database connectivity
    if (typeof (prisma as unknown as { $queryRawUnsafe?: unknown }).$queryRawUnsafe === "function") {
      await prisma.$queryRawUnsafe("SELECT 1");
    } else if (typeof prisma.storeSettings?.count === "function") {
      await prisma.storeSettings.count();
    }
    dbLatencyMs = Date.now() - startDb;
  } catch (err) {
    dbStatus = "disconnected";
    dbLatencyMs = Date.now() - startDb;
    dbError = err instanceof Error ? err.message : "Database connection failed";
  }

  const isHealthy = dbStatus === "connected";
  const statusCode = isHealthy ? 200 : 503;

  const mem = process.memoryUsage();
  const formatMb = (bytes: number) => `${Math.round((bytes / 1024 / 1024) * 100) / 100} MB`;

  res.status(statusCode).json({
    status: isHealthy ? "healthy" : "degraded",
    service: "Jabour Phone API",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
      ...(dbError ? { error: dbError } : {})
    },
    system: {
      nodeVersion: process.version,
      memory: {
        heapUsed: formatMb(mem.heapUsed),
        heapTotal: formatMb(mem.heapTotal),
        rss: formatMb(mem.rss)
      }
    },
    environment: process.env.NODE_ENV || "development"
  });
}

/**
 * Lightweight Ping Endpoint for uptime monitors (UptimeRobot, BetterStack, Pingdom)
 * and load balancer health checks. Returns 200 OK without database overhead.
 */
export function getPing(_req: Request, res: Response): void {
  res.status(200).json({ status: "ok", service: "Jabour Phone API", timestamp: new Date().toISOString() });
}

/**
 * Configures graceful shutdown listeners for SIGTERM and SIGINT
 */
export function setupGracefulShutdown(server: Server): void {
  const shutdown = async (signal: string) => {
    console.log(`\n[Graceful Shutdown] Received ${signal}. Closing HTTP server...`);

    // Stop accepting new connections
    server.close(async (err) => {
      if (err) {
        console.error("[Graceful Shutdown] Error closing HTTP server:", err);
        process.exit(1);
      }

      console.log("[Graceful Shutdown] HTTP server closed. Disconnecting database...");
      try {
        await prisma.$disconnect();
        console.log("[Graceful Shutdown] Database disconnected cleanly.");
        process.exit(0);
      } catch (dbErr) {
        console.error("[Graceful Shutdown] Error disconnecting Prisma:", dbErr);
        process.exit(1);
      }
    });

    // Force terminate after 10-second timeout if hanging
    setTimeout(() => {
      console.error("[Graceful Shutdown] Forced shutdown timed out after 10 seconds.");
      process.exit(1);
    }, 10000).unref();
  };

  // Register signal listeners (skip in test runner to prevent premature exit)
  if (process.env.NODE_ENV !== "test") {
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  }
}
