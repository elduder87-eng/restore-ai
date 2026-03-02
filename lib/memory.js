import fs from "fs";
import path from "path";

const memoryPath = path.join(process.cwd(), "memory");

const files = {
  identity: "identity.json",
  curiosity: "curiosity.json",
  learningPath: "learningPath.json",
};

function ensureFilesExist() {
  if (!fs.existsSync(memoryPath)) {
    fs.mkdirSync(memoryPath);
  }

  Object.values(files).forEach((file) => {
    const fullPath = path.join(memoryPath, file);
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, JSON.stringify({}));
    }
  });
}

export function getMemory() {
  try {
    ensureFilesExist();

    return {
      identity: JSON.parse(
        fs.readFileSync(path.join(memoryPath, files.identity))
      ),
      curiosity: JSON.parse(
        fs.readFileSync(path.join(memoryPath, files.curiosity))
      ),
      learningPath: JSON.parse(
        fs.readFileSync(path.join(memoryPath, files.learningPath))
      ),
    };
  } catch {
    return {
      identity: {},
      curiosity: {},
      learningPath: {},
    };
  }
}

export function saveMemory(memory) {
  try {
    fs.writeFileSync(
      path.join(memoryPath, files.identity),
      JSON.stringify(memory.identity, null, 2)
    );

    fs.writeFileSync(
      path.join(memoryPath, files.curiosity),
      JSON.stringify(memory.curiosity, null, 2)
    );

    fs.writeFileSync(
      path.join(memoryPath, files.learningPath),
      JSON.stringify(memory.learningPath, null, 2)
    );
  } catch {}
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
    memory.identity.interests?.join(", ") || "none yet";

  return `Interests: ${interests}`;
}
