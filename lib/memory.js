import { kv } from "@vercel/kv";

const MEMORY_KEY = "restore-user-memory";

export async function saveMemory(message) {
  const lower = message.toLowerCase();

  let interest = null;

  if (lower.includes("i enjoy") || lower.includes("i like")) {
    interest = message
      .replace(/i enjoy|i like/gi, "")
      .trim();
  }

  if (!interest) return;

  const existing = (await kv.get(MEMORY_KEY)) || [];

  if (!existing.includes(interest)) {
    existing.push(interest);
    await kv.set(MEMORY_KEY, existing);
  }
}

export async function getMemoryContext() {
  const memories = (await kv.get(MEMORY_KEY)) || [];

  if (memories.length === 0) return "";

  return `User interests: ${memories.join(", ")}`;
}
