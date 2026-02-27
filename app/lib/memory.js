// app/lib/memory.js

// ===============================
// In-Memory Store (temporary DB)
// ===============================

const memoryStore = {};

// ===============================
// Get or Create Session Memory
// ===============================

export function getMemory(sessionId) {
  if (!memoryStore[sessionId]) {
    memoryStore[sessionId] = {
      facts: {
        name: null,
        interests: []
      }
    };
  }

  return memoryStore[sessionId];
}

// ===============================
// Update Memory From User Message
// ===============================

export function updateMemory(sessionId, message) {
  const memory = getMemory(sessionId);
  const text = message.toLowerCase();

  // ---- Name Detection ----
  const nameMatch = message.match(/my name is (\w+)/i);
  if (nameMatch) {
    memory.facts.name = nameMatch[1];
  }

  // ---- Interest Detection ----
  const interestMatch = message.match(/i love (.+)/i);
  if (interestMatch) {
    const interest = interestMatch[1].trim();

    if (!memory.facts.interests.includes(interest)) {
      memory.facts.interests.push(interest);
    }
  }
}

// ===============================
// Build Memory Context for AI
// ===============================

export function buildMemoryPrompt(sessionId) {
  const data = memoryStore[sessionId];

  if (!data) return "";

  let memoryText = "Known information about the user:\n";

  if (data.facts.name) {
    memoryText += `Name: ${data.facts.name}\n`;
  }

  if (data.facts.interests.length > 0) {
    memoryText += `Interests: ${data.facts.interests.join(", ")}\n`;
  }

  return memoryText;
}
