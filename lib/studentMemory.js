import { Redis } from "@upstash/redis";

// Create Redis client safely
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function saveMemory(userId, key, value) {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL) {
      console.log("Redis URL missing");
      return;
    }

    await redis.hset(`student:${userId}`, {
      [key]: value,
    });

    console.log("Memory saved:", key, value);
  } catch (error) {
    console.error("Redis save failed:", error);
  }
}

export async function getMemory(userId) {
  try {
    return await redis.hgetall(`student:${userId}`);
  } catch (error) {
    console.error("Redis read failed:", error);
    return {};
  }
}
