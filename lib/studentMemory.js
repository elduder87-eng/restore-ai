import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function saveMemory(userId, key, value) {
  try {
    if (!userId || !key || !value) return;

    await redis.hset(`student:${userId}`, {
      [key]: value,
    });

    console.log("Memory saved:", key, value);
  } catch (err) {
    console.error("Memory save failed:", err);
  }
}

export async function getMemory(userId) {
  try {
    if (!userId) return {};

    const data = await redis.hgetall(`student:${userId}`);
    return data || {};
  } catch (err) {
    console.error("Memory fetch failed:", err);
    return {};
  }
}
