// Simple in-memory store (Stage 20)

const memoryStore = {};

export function getMemory(userId) {
  if (!memoryStore[userId]) {
    memoryStore[userId] = {
      interests: []
    };
  }

  return memoryStore[userId];
}

export function saveInterest(userId, interest) {
  const memory = getMemory(userId);

  const clean = interest.toLowerCase();

  if (!memory.interests.includes(clean)) {
    memory.interests.push(clean);
  }
}
