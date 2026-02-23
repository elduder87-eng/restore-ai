let memoryStore = {};

export async function getStudentMemory(studentId) {
  return memoryStore[studentId] || "";
}

export async function saveStudentMemory(studentId, memory) {
  memoryStore[studentId] = memory;
}
