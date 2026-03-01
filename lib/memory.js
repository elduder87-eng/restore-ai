import { kv } from "@vercel/kv";

const MEMORY_KEY = "restore:memory";

export async function getMemory() {
  try {
    const data = await kv.get(MEMORY_KEY);

    if (!data) return [];

    // ensure array
    if (Array.isArray(data)) return data;

    return [];
  } catch (err) {
    console.error("MEMORY READ ERROR:", err);
    return [];
  }
}

export async function saveMemory(messages) {
  try {
    if (!Array.isArray(messages)) return;

    // keep last 20 messages only
    const trimmed = messages.slice(-20);

    await kv.set(MEMORY_KEY, trimmed);
  } catch (err) {
    console.error("MEMORY SAVE ERROR:", err);
  }
}
