// Simple in-memory storage (Step 6 version)
// Later we upgrade to database memory

let memoryStore = {};

export async function getStudentMemory(studentId) {
  return memoryStore[studentId] || "";
}

export async function saveStudentMemory(studentId, memory) {
  memoryStore[studentId] = memory;
}
