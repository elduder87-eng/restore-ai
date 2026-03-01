// lib/memory.js

import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function getMemory(userId) {
  const memory = await redis.get(`memory:${userId}`);
  return memory || {};
}

export async function saveMemory(userId, data) {
  await redis.set(`memory:${userId}`, data);
}
