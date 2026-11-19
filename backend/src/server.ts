import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/api.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// API health check
app.get("/health", (_req, res) => {
  res.json({ status: "healthy", service: "Electro API", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`⚡ Electro Express Server running on http://localhost:${PORT}`);
});
