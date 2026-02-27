import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function saveMemory(userId, memory) {
  await redis.set(`memory:${userId}`, memory);
}

export async function loadMemory(userId) {
  const memory = await redis.get(`memory:${userId}`);
  return memory || {};
}
