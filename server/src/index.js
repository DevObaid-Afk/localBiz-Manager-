import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDatabase } from "../config/db.js";
import authRoutes from "../routes/authRoutes.js";
import gameRoutes from "../routes/gameRoutes.js";
import leaderboardRoutes from "../routes/leaderboardRoutes.js";
import profileRoutes from "../routes/profileRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://guess-it-five.vercel.app",
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/profile", profileRoutes);

app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal server error",
  });
});

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Guess It API running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed", error);
    process.exit(1);
  });
