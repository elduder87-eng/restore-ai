import { kv } from "@vercel/kv";

export async function getMemory(userId) {
  const memory = await kv.get(`memory:${userId}`);
  return memory || {
    interests: [],
    learningStyle: "unknown"
  };
}

export async function updateMemory(userId, message) {
  const memory = await getMemory(userId);

  const text = message.toLowerCase();

  // Interest detection
  if (text.includes("astronomy") && !memory.interests.includes("astronomy")) {
    memory.interests.push("astronomy");
  }

  if (text.includes("biology") && !memory.interests.includes("biology")) {
    memory.interests.push("biology");
  }

  // Learning style detection
  if (
    text.includes("simply") ||
    text.includes("easy") ||
    text.includes("basic explanation")
  ) {
    memory.learningStyle = "simple";
  }

  await kv.set(`memory:${userId}`, memory);

  return memory;
}
