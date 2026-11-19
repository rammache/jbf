import { Request, Response, NextFunction } from "express";
import cors, { CorsOptions } from "cors";

/**
 * Production-ready security headers middleware (Helmet equivalent)
 */
export function securityHeaders() {
  return (_req: Request, res: Response, next: NextFunction): void => {
    // Hide server technology
    res.removeHeader("X-Powered-By");

    // Clickjacking protection
    res.setHeader("X-Frame-Options", "DENY");

    // MIME sniffing protection
    res.setHeader("X-Content-Type-Options", "nosniff");

    // XSS filter protection (legacy browsers)
    res.setHeader("X-XSS-Protection", "0");

    // Strict Transport Security (HSTS)
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

    // Referrer policy
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

    // Content Security Policy
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; img-src 'self' data: https: blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' http: https:; font-src 'self' data:; object-src 'none'; base-uri 'self';"
    );

    // Cross-Origin headers
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

    next();
  };
}

/**
 * CORS Allowlist configuration
 */
export function getCorsOptions(): CorsOptions {
  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://localhost:5000"
  ];

  if (process.env.CORS_ORIGIN) {
    const custom = process.env.CORS_ORIGIN.split(",").map((s) => s.trim());
    allowedOrigins.push(...custom);
  }

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (such as mobile apps or curl / same-origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // In production reject unallowed origins; in development warn
      if (process.env.NODE_ENV === "production") {
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
      }

      // Development permissive fallback
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  };
}

/**
 * Structured HTTP request logger middleware
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;

    // Skip verbose logs during automated unit testing
    if (process.env.NODE_ENV === "test") {
      return;
    }

    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${method} ${originalUrl} ${statusCode} - ${duration}ms (IP: ${ip})`);
  });

  next();
}
