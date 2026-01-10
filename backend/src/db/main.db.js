// import { MongoClient,ServerApiVersion } from "mongodb";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import {fileURLToPath} from "url";

const filename= fileURLToPath(import.meta.url);
const dirname= path.dirname(filename);

dotenv.config({path:path.resolve(dirname,"../../../.env")});

// Replace the placeholder with your Atlas connection string
const uri = process.env.MONGO_URL;

console.log("MongoDB URI:", uri);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
