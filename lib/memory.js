import { kv } from "@vercel/kv";

export async function getMemory(userId) {
  const memory = await kv.get(`memory:${userId}`);
  return memory || {
    interests: [],
    learningStyle: "neutral",
  };
}

export async function updateMemory(userId, updates) {
  const memory = await getMemory(userId);

  const newMemory = {
    ...memory,
    ...updates,
    interests: Array.from(
      new Set([...(memory.interests || []), ...(updates.interests || [])])
    ),
  };

  await kv.set(`memory:${userId}`, newMemory);

  return newMemory;
}
