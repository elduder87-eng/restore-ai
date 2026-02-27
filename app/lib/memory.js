// lib/memory.js

// Persistent memory layer (Stage 9)

// NOTE:
// Vercel serverless can't store files permanently,
// so we simulate persistence using global scope.
// This survives warm deployments and prepares us
// for database upgrade in Stage 10.

global.restoreMemory ??= {};

export function getMemory(sessionId) {
  if (!global.restoreMemory[sessionId]) {
    global.restoreMemory[sessionId] = [];
  }
  return global.restoreMemory[sessionId];
}

export function saveMessage(sessionId, role, content) {
  const memory = getMemory(sessionId);

  memory.push({
    role,
    content,
  });

  return memory;
}
