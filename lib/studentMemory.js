// lib/studentMemory.js

import { redis } from "./redis";
import { getCurrentUser } from "./user";

/**
 * Stores learning-related memories
 */
export async function saveStudentMemory(memory) {
  const { userId } = getCurrentUser();

  await redis.rpush(
    `student:${userId}`,
    JSON.stringify({
      memory,
      timestamp: Date.now(),
    })
  );

  await redis.ltrim(`student:${userId}`, -100, -1);
}

/**
 * Loads learning memories
 */
export async function loadStudentMemory() {
  const { userId } = getCurrentUser();

  const memories = await redis.lrange(`student:${userId}`, 0, -1);

  return memories.map((m) => JSON.parse(m));
}
