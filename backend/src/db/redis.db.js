import { Redis } from "@upstash/redis";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Load env from backend/.env regardless of CWD
dotenv.config({ path: path.resolve(dirname, "../../../../.env") });

const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env;

if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
  console.warn(
    "Upstash Redis env vars missing: set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in backend/.env"
  );
}

export const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});

export const cacheSet = async (key, value, ttlSeconds) => {
  try {
    const payload = JSON.stringify(value);
    if (typeof ttlSeconds === "number" && ttlSeconds > 0) {
      await redis.set(key, payload, { ex: ttlSeconds });
      return;
    }

    await redis.set(key, payload);
  } catch (error) {
    console.warn("Redis cacheSet failed:", error?.message || error);
  }
};

export const cacheGet = async (key, ttlSeconds) => {
  try {
    const raw = await redis.get(key);
    if (raw == null) return null;

    if (typeof ttlSeconds === "number" && ttlSeconds > 0) {
      await redis.expire(key, ttlSeconds);
    }

    try {
      return JSON.parse(raw);
    } catch {
      // Fallback for non-JSON payloads
      return raw;
    }
  } catch (error) {
    console.warn("Redis cacheGet failed:", error?.message || error);
    return null;
  }
};

export const cacheDel = async (key) => {
  try {
    return await redis.del(key);
  } catch (error) {
    console.warn("Redis cacheDel failed:", error?.message || error);
    return 0;
  }
};

export default redis;
