// app/lib/memory.js

import { Redis } from "@upstash/redis";

// Create REST-based Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Save memory
export async function saveMemory(userId, key, value) {
  try {
    await redis.hset(`memory:${userId}`, {
      [key]: value,
    });
  } catch (err) {
    console.error("Memory save error:", err);
  }
}

// Get memory
export async function getMemory(userId) {
  try {
    const data = await redis.hgetall(`memory:${userId}`);
    return data || {};
  } catch (err) {
    console.error("Memory fetch error:", err);
    return {};
  }
}
