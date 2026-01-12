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

// Build allowed origins map for faster lookup in serverless handler
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:3000', 
  'https://cpcoders.saksin.online', 
  'http://cpcoders.saksin.online',
  'https://cp.saksin.online',
  'https://leetcode.com', // Strict match
  'https://www.leetcode.com',
  'http://cp.saksin.online'
];

// Helper to set CORS headers manually (Nuclear option for Vercel)
const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin;
  const isAllowed = origin && (allowedOrigins.includes(origin) || origin.endsWith('.leetcode.com'));
  
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  }
};

// Wrap the app with DB connection middleware
const handler = async (req, res) => {
  // 1. Handle CORS Preflight manually - FAST EXIT
  if (req.method === 'OPTIONS') {
    setCorsHeaders(req, res);
    return res.status(200).end();
  }

  try {
    // 2. Connect to DB
    await connectDB();
    
    // 3. Forward to Express App
    return app(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    
    // 4. If DB fails, we MUST still send CORS headers so frontend sees the 500 JSON, not a CORS error
    setCorsHeaders(req, res);
    
    return res.status(500).json({ 
      message: "Database connection failed", 
      error: error.message 
    });
  }
};

export default handler;
