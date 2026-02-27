// app/lib/memory.js

// In-memory store (temporary memory)
const memoryStore = {};

// ==========================
// UPDATE MEMORY
// ==========================
export function updateMemory(sessionId, message) {
  if (!memoryStore[sessionId]) {
    memoryStore[sessionId] = {
      name: null,
      interests: [],
    };
  }

  const lower = message.toLowerCase();

  // Detect name
  if (lower.includes("my name is")) {
    const name = message.split("is")[1]?.trim();
    if (name) {
      memoryStore[sessionId].name = name;
    }
  }

  // Detect interests
  if (lower.includes("i love")) {
    const interest = message.split("love")[1]?.trim();
    if (interest) {
      memoryStore[sessionId].interests.push(interest);
    }
  }
}

// ==========================
// BUILD MEMORY PROMPT
// ==========================
export function buildMemoryPrompt(sessionId) {
  const memory = memoryStore[sessionId];

  if (!memory) return "No known information about the user yet.";

  let context = "Known information about the user:\n";

  if (memory.name) {
    context += `Name: ${memory.name}\n`;
  }

  if (memory.interests.length > 0) {
    context += `Interests: ${memory.interests.join(", ")}\n`;
  }

  return context;
}
