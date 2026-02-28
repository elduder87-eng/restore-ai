// /lib/memory.js

import { redis } from "./redis";

/*
  MEMORY FORMAT (new standard)

  [
    { role: "user", content: "Hello" },
    { role: "assistant", content: "Hi!" }
  ]
*/


// ===============================
// LOAD MEMORY
// ===============================
export async function loadMemory(userId) {
  try {
    const data = await redis.get(`memory:${userId}`);

    // nothing saved yet
    if (!data) return [];

    // ✅ Handle OLD plain-text memory safely
    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch {
        // fallback for legacy saves
        return [
          {
            role: "user",
            content: data,
          },
        ];
      }
    }

    // already parsed object
    return data;
  } catch (error) {
    console.error("Memory load error:", error);
    return [];
  }
}


// ===============================
// SAVE MEMORY
// ===============================
export async function saveMemory(userId, memory) {
  try {
    await redis.set(
      `memory:${userId}`,
      JSON.stringify(memory)
    );
  } catch (error) {
    console.error("Memory save error:", error);
  }
}


// ===============================
// ADD MESSAGE TO MEMORY
// ===============================
export async function addToMemory(userId, message) {
  const memory = await loadMemory(userId);

  memory.push(message);

  // optional safety limit (prevents infinite growth)
  const MAX_MEMORY = 20;
  const trimmedMemory = memory.slice(-MAX_MEMORY);

  await saveMemory(userId, trimmedMemory);

  return trimmedMemory;
}
