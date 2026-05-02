import app from "./app.js";
import connectDB from "./db/main.db.js";
import redis from "./db/redis.db.js";

const initRedis = async () => {
  try {
    const result = await redis.ping();
    console.log("Redis connected:", result);
  } catch (error) {
    console.error("Redis connection failed:", error?.message || error);
  }
};

const startServer = async () => {
  await connectDB();
  await initRedis();
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
};

startServer();
