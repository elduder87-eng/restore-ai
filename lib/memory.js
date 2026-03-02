// lib/memory.js

let memory = {
  interests: [],
  progress: {}
};

export function getMemory() {
  return memory;
}

function cleanWord(word) {
  return word.replace(/[.,!?]/g, "").trim();
}

export function updateMemory(message) {
  const text = message.toLowerCase();

  // -------- INTEREST DETECTION --------
  if (text.includes("i enjoy") || text.includes("i like")) {
    const words = text.split(" ");
    const interest = cleanWord(words[words.length - 1]);

    if (interest && !memory.interests.includes(interest)) {
      memory.interests.push(interest);
    }
  }

  // -------- PROGRESS TRACKING --------
  if (text.includes("gravity"))
    memory.progress.gravity = "learning";

  if (text.includes("astronomy"))
    memory.progress.astronomy = "curious";

  if (text.includes("biology"))
    memory.progress.biology = "learning";
}

export function buildProgressSummary(memory) {
  const topics = Object.keys(memory.progress);

  if (topics.length === 0)
    return "We're just getting started.";

  return `Here’s your learning progress: ${topics
    .map(t => `${t}: ${memory.progress[t]}`)
    .join(", ")}`;
}
