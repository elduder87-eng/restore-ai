// lib/memory.js

let memory = {
  interests: [],
  topics: [],
  progress: {}
};

export function getMemory() {
  return memory;
}

export function updateMemory(message) {
  const text = message.toLowerCase();

  // Detect interests
  if (text.includes("i enjoy") || text.includes("i like")) {
    const words = text.split(" ");
    const interest = words.slice(-1)[0];

    if (!memory.interests.includes(interest)) {
      memory.interests.push(interest);
    }
  }

  // Track topics
  if (text.includes("gravity")) {
    memory.topics.push("gravity");
    memory.progress.gravity = "learning";
  }

  if (text.includes("biology")) {
    memory.topics.push("biology");
    memory.progress.biology = "learning";
  }

  if (text.includes("astronomy")) {
    memory.topics.push("astronomy");
    memory.progress.astronomy = "curious";
  }
}

export function buildProgressSummary(memory) {
  const topics = Object.keys(memory.progress);

  if (topics.length === 0)
    return "We're just getting started.";

  return `Here’s your learning progress: ${topics
    .map(t => `${t}: ${memory.progress[t]}`)
    .join(", ")}`;
}
