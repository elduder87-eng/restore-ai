import { kv } from "@vercel/kv";

export async function saveMemory(userId, message) {
  const key = `memory:${userId}`;

  let memory = await kv.get(key);

  if (!memory) {
    memory = {
      interests: []
    };
  }

  const text = message.toLowerCase();

  if (text.includes("astronomy") && !memory.interests.includes("astronomy")) {
    memory.interests.push("astronomy");
  }

  if (text.includes("biology") && !memory.interests.includes("biology")) {
    memory.interests.push("biology");
  }

  await kv.set(key, memory);
  return memory;
}

export async function getMemory(userId) {
  return await kv.get(`memory:${userId}`);
}
