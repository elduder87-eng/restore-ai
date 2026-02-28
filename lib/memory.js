import { redis } from "./redis";

const MEMORY_KEY = "restore:memory:";

/**
 * Save new memory
 */
export async function saveMemory(userId, text) {
  if (!text) return;

  const key = MEMORY_KEY + userId;

  const existing = await redis.get(key);

  let memories = [];

  if (existing) {
    memories = JSON.parse(existing);
  }

  memories.push(text);

  // keep last 20 memories
  memories = memories.slice(-20);

  await redis.set(key, JSON.stringify(memories));
}

/**
 * Load memory
 */
export async function loadMemory(userId) {
  const key = MEMORY_KEY + userId;

  const data = await redis.get(key);

  if (!data) return "";

  const memories = JSON.parse(data);

  return memories.join("\n");
}
