import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

function getMemoryKey(userId) {
  return `restore:memory:${userId}`;
}

export async function addMessage(userId, role, content) {
  const key = getMemoryKey(userId);

  try {
    await redis.rpush(
      key,
      JSON.stringify({ role, content })
    );

    // Keep only last 10 messages
    await redis.ltrim(key, -10, -1);

  } catch (error) {
    console.error("Memory write failed:", error);
  }
}

export async function getRecentMessages(userId) {
  const key = getMemoryKey(userId);

  try {
    const messages = await redis.lrange(key, 0, -1);

    return messages.map((m) => {
      if (typeof m === "string") {
        try {
          return JSON.parse(m);
        } catch {
          return { role: "system", content: m };
        }
      }
      return m;
    });

  } catch (error) {
    console.error("Memory read failed:", error);
    return [];
  }
}
