import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables before anything else
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// MongoDB connection caching for serverless
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("Using existing database connection");
    return;
  }

  try {
    mongoose.set('bufferCommands', false); // Disable buffering for serverless
    
    const db = await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("DB connection failed:", error.message);
    isConnected = false;
    throw error;
  }
};

// Import app AFTER setting up dotenv
import app from "../src/app.js";

// Wrap the app with DB connection middleware
const handler = async (req, res) => {
  // Handle CORS preflight without DB connection
  if (req.method === 'OPTIONS') {
    return app(req, res);
  }

  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({ 
      message: "Database connection failed", 
      error: error.message 
    });
  }
};

export default handler;
