// lib/memory.js

import { redis } from "./redis";
import { getCurrentUser } from "./user";

/**
 * Save conversation memory
 */
export async function saveMemory(message) {
  const { userId } = getCurrentUser();

  await redis.rpush(
    `memory:${userId}`,
    JSON.stringify({
      message,
      timestamp: Date.now(),
    })
  );

  // keep memory size reasonable
  await redis.ltrim(`memory:${userId}`, -50, -1);
}

/**
 * Load conversation memory
 */
export async function loadMemory() {
  const { userId } = getCurrentUser();

  const memories = await redis.lrange(`memory:${userId}`, 0, -1);

  return memories.map((m) => JSON.parse(m));
}
