import { redis } from "./redis";

const MEMORY_KEY = "restore:memory";

export async function saveMemory(userId, memory) {
  if (!memory) return;

  await redis.rpush(`${MEMORY_KEY}:${userId}`, memory);
}

export async function getMemories(userId) {
  const memories =
    (await redis.lrange(`${MEMORY_KEY}:${userId}`, 0, -1)) || [];

  return memories;
}
