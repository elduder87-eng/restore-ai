// lib/memory.js

// Simple in-memory store (later becomes database/Redis)
const memoryStore = {};

// Get or create user memory
export function getMemory(userId) {
  if (!memoryStore[userId]) {
    memoryStore[userId] = {
      interests: [],
      facts: []
    };
  }

  return memoryStore[userId];
}

// Save an interest safely (no duplicates)
export function saveInterest(userId, interest) {
  const memory = getMemory(userId);

  const normalized = interest.trim().toLowerCase();

  if (!memory.interests.includes(normalized)) {
    memory.interests.push(normalized);
  }
}
