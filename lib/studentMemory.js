import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function saveMemory(sessionId, memory) {
  if (!memory) return;
  await redis.sadd(`memory:${sessionId}`, memory);
}

export async function getMemories(sessionId) {
  const memories = await redis.smembers(`memory:${sessionId}`);
  return memories || [];
}
