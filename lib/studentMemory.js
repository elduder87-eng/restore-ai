const memoryStore = {};

export async function saveMemory(userId, key, value) {
  if (!memoryStore[userId]) {
    memoryStore[userId] = {};
  }

  memoryStore[userId][key] = value;
}

export async function getMemory(userId, key) {
  return memoryStore[userId]?.[key] || null;
}
