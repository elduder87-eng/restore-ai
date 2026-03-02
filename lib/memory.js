import fs from "fs";
import path from "path";

const memoryDir = path.join(process.cwd(), "memory");

function ensureMemory() {
  if (!fs.existsSync(memoryDir)) {
    fs.mkdirSync(memoryDir);
  }

  const files = ["identity.json", "curiosity.json", "learningPath.json"];

  files.forEach((file) => {
    const filePath = path.join(memoryDir, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "{}");
    }
  });
}

export function getMemory() {
  ensureMemory();

  try {
    return {
      identity: JSON.parse(
        fs.readFileSync(path.join(memoryDir, "identity.json"))
      ),
      curiosity: JSON.parse(
        fs.readFileSync(path.join(memoryDir, "curiosity.json"))
      ),
      learningPath: JSON.parse(
        fs.readFileSync(path.join(memoryDir, "learningPath.json"))
      ),
    };
  } catch {
    return { identity: {}, curiosity: {}, learningPath: {} };
  }
}

export function saveMemory(memory) {
  fs.writeFileSync(
    path.join(memoryDir, "identity.json"),
    JSON.stringify(memory.identity || {}, null, 2)
  );

  fs.writeFileSync(
    path.join(memoryDir, "curiosity.json"),
    JSON.stringify(memory.curiosity || {}, null, 2)
  );

  fs.writeFileSync(
    path.join(memoryDir, "learningPath.json"),
    JSON.stringify(memory.learningPath || {}, null, 2)
  );
}

export function updateMemoryFromMessage(message, memory) {
  const text = message.toLowerCase();

  if (text.includes("i enjoy") || text.includes("i like")) {
    const interest = text
      .replace("i enjoy", "")
      .replace("i like", "")
      .trim();

    memory.identity.interests ??= [];

    if (!memory.identity.interests.includes(interest)) {
      memory.identity.interests.push(interest);
    }
  }

  return memory;
}

export function buildMemorySummary(memory) {
  const interests =
    memory.identity?.interests?.join(", ") || "none yet";

  return `Interests: ${interests}`;
}
