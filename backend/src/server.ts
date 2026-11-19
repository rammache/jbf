import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import apiRoutes from "./routes/api.js";
import { getJwtSecret } from "./utils/jwt.js";

dotenv.config();

getJwtSecret();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// API health check
app.get("/health", (_req, res) => {
  res.json({ status: "healthy", service: "Jabour Phone API", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Jabour Phone Express Server running on http://localhost:${PORT}`);
});
