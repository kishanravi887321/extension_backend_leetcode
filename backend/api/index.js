import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { router as userRoutes } from "../src/routes/user.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection caching for serverless
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URL);
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("DB connection failed:", error.message);
    throw error;
  }
};

// Connect to DB before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

// Routes
app.get("/api", (req, res) => {
  res.json({ message: "Backend API is running on Vercel!" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/users", userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
