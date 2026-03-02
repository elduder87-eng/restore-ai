// lib/memory.js

// Temporary in-memory store (Vercel safe)
let MEMORY = {
  identity: {
    interests: [],
  },
};

export async function loadMemory() {
  return MEMORY;
}

export async function saveMemory(newMemory) {
  MEMORY = newMemory;
}

export function updateMemoryFromMessage(message, memory) {
  const text = message.toLowerCase();

  if (text.includes("i enjoy") || text.includes("i like")) {
    const interest = message
      .replace(/i enjoy|i like/gi, "")
      .trim()
      .toLowerCase();

    if (
      interest &&
      !memory.identity.interests.includes(interest)
    ) {
      memory.identity.interests.push(interest);
    }
  }

  return memory;
}
