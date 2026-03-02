import fs from "fs";
import path from "path";

const memoryDir = path.join(process.cwd(), "memory");

const identityPath = path.join(memoryDir, "identity.json");
const curiosityPath = path.join(memoryDir, "curiosity.json");
const learningPath = path.join(memoryDir, "learningPath.json");

/* ---------------------------
   Ensure memory folder exists
---------------------------- */
function ensureMemoryFolder() {
  if (!fs.existsSync(memoryDir)) {
    fs.mkdirSync(memoryDir);
  }
}

/* ---------------------------
   Safe JSON loader
---------------------------- */
function loadJSON(filePath, fallback = {}) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
      return fallback;
    }

    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data || "{}");
  } catch (err) {
    console.error("Memory load error:", err);
    return fallback;
  }
}

/* ---------------------------
   Save JSON safely
---------------------------- */
function saveJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Memory save error:", err);
  }
}

/* ---------------------------
   Load ALL memory
---------------------------- */
export function loadMemory() {
  ensureMemoryFolder();

  return {
    identity: loadJSON(identityPath, { interests: [] }),
    curiosity: loadJSON(curiosityPath, {}),
    learningPath: loadJSON(learningPath, {})
  };
}

/* ---------------------------
   Save ALL memory
---------------------------- */
export function saveMemory(memory) {
  ensureMemoryFolder();

  saveJSON(identityPath, memory.identity || {});
  saveJSON(curiosityPath, memory.curiosity || {});
  saveJSON(learningPath, memory.learningPath || {});
}

/* ---------------------------
   UPDATE MEMORY FROM MESSAGE
   (Stage 25 Intelligence)
---------------------------- */
export function updateMemoryFromMessage(message, memory) {
  if (!message) return memory;

  const text = message.toLowerCase();

  /* ---- Ensure structures exist ---- */
  if (!memory.identity) memory.identity = {};
  if (!memory.identity.interests)
    memory.identity.interests = [];

  /* ---- Detect Interests ---- */
  const interestMatch = text.match(
    /i (like|love|enjoy|am interested in) ([a-zA-Z\s]+)/i
  );

  if (interestMatch) {
    const interest = interestMatch[2].trim();

    // Add only if not already stored
    if (!memory.identity.interests.includes(interest)) {
      memory.identity.interests.push(interest);
    }
  }

  return memory;
}
