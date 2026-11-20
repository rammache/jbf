import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import apiRoutes from "./routes/api.js";
import { getJwtSecret } from "./utils/jwt.js";
import { securityHeaders, getCorsOptions, requestLogger } from "./middleware/security.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { getHealthCheck, getPing, setupGracefulShutdown } from "./controllers/healthController.js";
import { getUploadsDir } from "./middleware/upload.js";

dotenv.config();

// Ensure JWT secret is valid
try {
  getJwtSecret();
} catch (err) {
  console.error("JWT Secret Error:", err);
}

const uploadsDir = getUploadsDir();
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  } catch (_err) {
    // Gracefully handle read-only environments
  }

  export const app = express();
  const PORT = process.env.PORT || 5000;

  // Enable trust proxy for reverse proxies (Nginx, Caddy, Cloudflare, Railway, Render)
  app.set("trust proxy", 1);

  // Security & Header Policies
  app.use(securityHeaders());
  app.use(cors(getCorsOptions()));

  // Request logging
  app.use(requestLogger);

  // Body Parsing with strict size limits
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cookieParser());

  // Serve uploaded assets statically
  app.use("/uploads", express.static(uploadsDir));

  // API Health Check & Lightweight Ping (root and /api mounted)
  app.get("/health", getHealthCheck);
  app.get("/api/health", getHealthCheck);
  app.get("/health/ping", getPing);
  app.get("/api/health/ping", getPing);

  // Root welcome & API status endpoint
  app.get("/", (_req, res, next) => {
    if (shouldServeFrontend && fs.existsSync(frontendDist)) {
      return next();
    }
    res.json({
      success: true,
      name: "Jabour Phone REST API",
      status: "online",
      message: "Jabour Phone Backend is active on Vercel.",
      endpoints: {
        health: "/api/health",
        products: "/api/products",
        categories: "/api/categories",
        orders: "/api/orders",
        auth: "/api/auth/me"
      }
    });
  });

  // API Routes
  app.use("/api", apiRoutes);

  // Single-domain unified deployment: serve frontend static build if enabled or present
  const frontendDist = process.env.FRONTEND_DIST_PATH
    ? path.resolve(process.env.FRONTEND_DIST_PATH)
    : path.resolve(__dirname, "../../frontend/dist");

  const shouldServeFrontend =
    process.env.SERVE_FRONTEND === "true" ||
    (process.env.NODE_ENV === "production" && fs.existsSync(frontendDist));

  if (shouldServeFrontend && fs.existsSync(frontendDist)) {
    // Serve static assets from frontend build
    app.use(express.static(frontendDist));

    // SPA history fallback: serve index.html for browser routes that don't match API
    app.get("*", (req, res, next) => {
      if (
        req.path.startsWith("/api") ||
        req.path.startsWith("/health") ||
        req.path.startsWith("/uploads")
      ) {
        return next();
      }
      res.sendFile(path.join(frontendDist, "index.html"));
    });
  }

  // 404 Route Not Found for unhandled API and resource endpoints
  app.use(notFoundHandler);

  // Centralized Error Handling
  app.use(errorHandler);

  let server: ReturnType<typeof app.listen> | null = null;
    if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
      server = app.listen(PORT, () => {
        console.log(`Jabour Phone Express Server running on http://localhost:${PORT}`);
      });
      setupGracefulShutdown(server);
    }

    export default app;
