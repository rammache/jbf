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
import { getHealthCheck, setupGracefulShutdown } from "./controllers/healthController.js";

dotenv.config();

// Ensure JWT secret is valid
getJwtSecret();

const uploadsDir = path.resolve(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const app = express();
const PORT = process.env.PORT || 5000;

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

// API Health Check (root and /api mounted)
app.get("/health", getHealthCheck);
app.get("/api/health", getHealthCheck);

// API Routes
app.use("/api", apiRoutes);

// 404 Route Not Found
app.use(notFoundHandler);

// Centralized Error Handling
app.use(errorHandler);

let server: ReturnType<typeof app.listen> | null = null;
if (process.env.NODE_ENV !== "test") {
  server = app.listen(PORT, () => {
    console.log(`Jabour Phone Express Server running on http://localhost:${PORT}`);
  });
  setupGracefulShutdown(server);
}

export default app;
