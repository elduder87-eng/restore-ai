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

  if (!memory.interests.includes(interest)) {
    memory.interests.push(interest);
  }
}
