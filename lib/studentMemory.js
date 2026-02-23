import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function saveMemory(userId, key, value) {
  await redis.hset(`student:${userId}`, {
    [key]: value,
  });
}

export async function getMemory(userId, key) {
  const data = await redis.hget(`student:${userId}`, key);
  return data;
}
