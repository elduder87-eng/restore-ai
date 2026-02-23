import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const USER_ID = "default-user";

export async function saveMemory(key, value) {
  await redis.hset(`memory:${USER_ID}`, {
    [key]: value,
  });
}

export async function getMemory(key) {
  return await redis.hget(`memory:${USER_ID}`, key);
}
