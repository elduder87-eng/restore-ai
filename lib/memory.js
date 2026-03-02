import fs from "fs";
import path from "path";

const memoryDir = path.join(process.cwd(), "memory");

function readJSON(file) {
  const filePath = path.join(memoryDir, file);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
  }

  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJSON(file, data) {
  const filePath = path.join(memoryDir, file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ========================
// GET MEMORY
// ========================

export function getMemory() {
  return {
    identity: readJSON("identity.json"),
    curiosity: readJSON("curiosity.json"),
    learningPath: readJSON("learningPath.json"),
  };
}

// ========================
// SAVE MEMORY
// ========================

export function saveMemory(memory) {
  writeJSON("identity.json", memory.identity);
  writeJSON("curiosity.json", memory.curiosity);
  writeJSON("learningPath.json", memory.learningPath);
}

// ========================
// UPDATE MEMORY
// ========================

export function updateMemoryFromMessage(message, memory) {
  const text = message.toLowerCase();

  if (text.includes("i enjoy") || text.includes("i like")) {
    const topic = text
      .replace("i enjoy", "")
      .replace("i like", "")
      .trim();

    if (!memory.identity.interests) {
      memory.identity.interests = [];
    }

    if (!memory.identity.interests.includes(topic)) {
      memory.identity.interests.push(topic);
    }
  }

  if (!memory.learningPath.history) {
    memory.learningPath.history = [];
  }

  memory.learningPath.history.push({
    message,
    timestamp: Date.now(),
  });

  return memory;
}

// ========================
// MEMORY SUMMARY
// ========================

export function buildMemorySummary(memory) {
  const interests = memory.identity.interests || [];

  if (interests.length === 0) {
    return "The learner is just beginning.";
  }

  return `The learner is interested in: ${interests.join(", ")}.`;
}
