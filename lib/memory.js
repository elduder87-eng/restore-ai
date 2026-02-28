import { redis } from "./redis";

const MEMORY_KEY = (userId) => `memory:${userId}`;

export async function loadMemory(userId) {
  const data = await redis.get(MEMORY_KEY(userId));
  return data ? JSON.parse(data) : {};
}

export async function saveMemory(userId, memory) {
  await redis.set(
    MEMORY_KEY(userId),
    JSON.stringify(memory)
  );
}

export async function updateMemory(userId, message) {
  const memory = await loadMemory(userId);

  const text = message.toLowerCase();

  if (text.includes("favorite color is")) {
    memory.favorite_color = message.split("is").pop().trim();
  }

  if (text.includes("favorite food is")) {
    memory.favorite_food = message.split("is").pop().trim();
  }

  if (text.includes("favorite movie is")) {
    memory.favorite_movie = message.split("is").pop().trim();
  }

  await saveMemory(userId, memory);

  return memory;
}
