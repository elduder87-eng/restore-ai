let memoryStore = [];

export async function saveMemory(text) {
  memoryStore.push(text);
}

export async function getMemories() {
  return memoryStore;
}
