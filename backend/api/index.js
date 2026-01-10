import mongoose from "mongoose";
import cors from "cors";
import app from "../src/app.js";

// Add CORS for Vercel
app.use(cors());

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

// Connect to DB before handling requests (insert at beginning)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
