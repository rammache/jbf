import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import apiRoutes from "./routes/api.js";
import { getJwtSecret } from "./utils/jwt.js";

dotenv.config();

getJwtSecret();

const uploadsDir = path.resolve(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Serve uploaded assets statically
app.use("/uploads", express.static(uploadsDir));

// API health check
app.get("/health", (_req, res) => {
  res.json({ status: "healthy", service: "Jabour Phone API", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Jabour Phone Express Server running on http://localhost:${PORT}`);
});
