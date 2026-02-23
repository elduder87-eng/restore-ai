import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function saveMemory(sessionId, fact) {
  if (!sessionId || !fact) return;

  await redis.rpush(`memory:${sessionId}`, fact);
}

export async function getMemory(sessionId) {
  if (!sessionId) return [];

  const memory = await redis.lrange(`memory:${sessionId}`, 0, -1);
  return memory || [];
}
