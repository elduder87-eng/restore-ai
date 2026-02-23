import { Redis } from "@upstash/redis";

// Create Redis client using Vercel environment variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Save memory
export async function saveMemory(userId, key, value) {
  try {
    await redis.hset(`student:${userId}`, {
      [key]: value,
    });
  } catch (err) {
    console.error("Memory save error:", err);
  }
}

// Get memory
export async function getMemory(userId, key) {
  try {
    const data = await redis.hget(`student:${userId}`, key);
    return data;
  } catch (err) {
    console.error("Memory fetch error:", err);
    return null;
  }
}
