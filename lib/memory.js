// lib/memory.js

import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const MEMORY_KEY = "restore:memory";

export async function saveMemory(text) {
  if (!text) return;

  await redis.rpush(MEMORY_KEY, text);
}

export async function getMemories() {
  const memories = await redis.lrange(MEMORY_KEY, 0, -1);
  return memories || [];
}
