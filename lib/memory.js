import { redis } from "./redis";

const MEMORY_KEY = "memory";

export async function saveMemory(message) {
  try {
    await redis.lpush(
      MEMORY_KEY,
      JSON.stringify({
        message,
        timestamp: Date.now(),
      })
    );

    await redis.ltrim(MEMORY_KEY, 0, 20);
  } catch (err) {
    console.error("Memory save error:", err);
  }
}

export async function loadMemory() {
  try {
    const memories = await redis.lrange(MEMORY_KEY, 0, 10);

    return memories.map((m) => JSON.parse(m));
  } catch (err) {
    console.error("Memory load error:", err);
    return [];
  }
}
