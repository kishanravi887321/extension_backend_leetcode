import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables before anything else
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// MongoDB connection caching for serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // If we have a cached connection that's ready, use it
  if (cached.conn && mongoose.connection.readyState === 1) {
    console.log("Using existing database connection");
    return cached.conn;
  }

  // If a connection is in progress, wait for it
  if (cached.promise) {
    console.log("Waiting for existing connection promise");
    cached.conn = await cached.promise;
    return cached.conn;
  }

  try {
    mongoose.set('bufferCommands', false); // Disable buffering for serverless
    
    cached.promise = mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    cached.conn = await cached.promise;
    console.log("MongoDB connected successfully");
    return cached.conn;
  } catch (error) {
    console.error("DB connection failed:", error.message);
    cached.promise = null; // Reset promise so next request can retry
    cached.conn = null;
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
  'https://leetcode.com',
  'https://www.leetcode.com',
  'https://www.interviewbit.com',
  'https://interviewbit.com',
  'http://cp.saksin.online'
];

// Helper to check if origin is allowed (including browser extensions)
const isOriginAllowed = (origin) => {
  // No origin = browser extension, mobile app, curl, or same-origin request
  if (!origin) return true;
  
  // Check exact matches
  if (allowedOrigins.includes(origin)) return true;
  
  // Check if it's a leetcode subdomain
  if (origin.endsWith('.leetcode.com')) return true;
  
  // Allow browser extension origins (chrome-extension://, moz-extension://, safari-extension://)
  if (origin.startsWith('chrome-extension://') || 
      origin.startsWith('moz-extension://') || 
      origin.startsWith('safari-extension://')) {
    return true;
  }
  
  return false;
};

// Helper to set CORS headers manually (Nuclear option for Vercel)
const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin;
  
  if (isOriginAllowed(origin)) {
    // If no origin, use wildcard (for extensions/curl)
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  }
};

// Wrap the app with DB connection middleware
const handler = async (req, res) => {
  // 1. ALWAYS set CORS headers first for ALL requests
  setCorsHeaders(req, res);
  
  // 2. Handle CORS Preflight - FAST EXIT
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 3. Connect to DB
    await connectDB();
    
    // 4. Forward to Express App
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
