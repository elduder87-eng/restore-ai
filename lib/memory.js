// lib/memory.js

// ----------------------------
// In-memory store (server safe)
// ----------------------------

let MEMORY = {
  identity: {
    interests: [],
  },
  curiosity: {},
  learningPath: {},
};

// ----------------------------
// Get Memory
// ----------------------------
export function getMemory() {
  return MEMORY;
}

// ----------------------------
// Save Memory
// ----------------------------
export function saveMemory(newMemory) {
  MEMORY = newMemory;
}

// ----------------------------
// Update Memory From Message
// ----------------------------
export function updateMemoryFromMessage(message, memory) {
  const text = message.toLowerCase();

  if (text.includes("astronomy")) {
    if (!memory.identity.interests.includes("astronomy")) {
      memory.identity.interests.push("astronomy");
    }
  }

  if (text.includes("biology")) {
    if (!memory.identity.interests.includes("biology")) {
      memory.identity.interests.push("biology");
    }
  }

  return memory;
}

// ----------------------------
// Build Progress Summary
// ----------------------------
export function buildMemorySummary(memory) {
  const interests =
    memory.identity.interests.length > 0
      ? memory.identity.interests.join(", ")
      : "starting your journey";

  return `Here’s your learning progress — Interests: ${interests}.`;
}
