// lib/memory.js

import { setJSON, getJSON } from "./redis";

const MEMORY_KEY = "restore:memory:default-user";

export async function saveMemory(message) {
  const memories = (await getJSON(MEMORY_KEY)) || [];

  memories.push({
    message,
    time: Date.now(),
  });

  await setJSON(MEMORY_KEY, memories.slice(-20));
}

export async function getMemories() {
  return (await getJSON(MEMORY_KEY)) || [];
}
