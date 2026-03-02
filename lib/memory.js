// lib/memory.js

let memoryStore = {};

export function getMemory(userId = "default") {
  if (!memoryStore[userId]) {
    memoryStore[userId] = {
      interests: [],
      topics: {},
      learningState: "exploring",
      confidence: 0.5,
      interactionCount: 0
    };
  }
  return memoryStore[userId];
}

export function updateMemory(userId = "default", message) {
  const mem = getMemory(userId);

  const text = message.toLowerCase();

  mem.interactionCount++;

  // Detect interests
  const interests = ["astronomy","biology","psychology","physics","music","language"];
  interests.forEach(i => {
    if (text.includes(i) && !mem.interests.includes(i)) {
      mem.interests.push(i);
    }
  });

  // Topic tracking
  if (text.includes("explain")) {
    mem.learningState = "learning";
    mem.confidence -= 0.05;
  }

  if (text.includes("so that means") || text.includes("does that mean")) {
    mem.learningState = "connecting";
    mem.confidence += 0.1;
  }

  if (text.includes("how am i doing")) {
    mem.learningState = "reflecting";
  }

  // Clamp confidence
  mem.confidence = Math.max(0, Math.min(1, mem.confidence));

  return mem;
}
