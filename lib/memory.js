import { Redis } from "@upstash/redis";

let redis = null;

try {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
} catch (err) {
  console.log("Redis init failed:", err);
}

// SAVE MEMORY (safe)
export async function saveMemory(userId, message) {
  try {
    if (!redis) return;

    await redis.rpush(`memory:${userId}`, message);
  } catch (err) {
    console.log("Memory save error:", err);
  }
}

// GET MEMORY (safe)
export async function getMemory(userId) {
  try {
    if (!redis) return [];

    const memory = await redis.lrange(`memory:${userId}`, 0, -1);
    return memory || [];
  } catch (err) {
    console.log("Memory read error:", err);
    return [];
  }
}
