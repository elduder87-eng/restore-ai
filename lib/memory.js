const memory = {};

export function saveMemory(userId, key, value) {
  if (!memory[userId]) memory[userId] = {};
  memory[userId][key] = value;
}

export function getMemory(userId, key) {
  return memory[userId]?.[key];
}
