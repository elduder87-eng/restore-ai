import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const USER_ID = "default-user";

export async function saveMemory(text) {
  await redis.rpush(`memory:${USER_ID}`, text);
}

export async function getMemories() {
  const memories = await redis.lrange(`memory:${USER_ID}`, 0, -1);
  return memories || [];
}
