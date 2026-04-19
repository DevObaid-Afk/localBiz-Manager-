import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDatabase } from "../config/db.js";
import authRoutes from "../routes/authRoutes.js";
import productRoutes from "../routes/productRoutes.js";
import saleRoutes from "../routes/saleRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "LocalBiz Manager API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);

app.use((req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal server error",
  });
});

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`LocalBiz Manager API running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed", error);
    process.exit(1);
  });
