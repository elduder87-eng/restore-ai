import fs from "fs/promises";
import path from "path";

const memoryPath = path.join(process.cwd(), "memory", "identity.json");

/* -------------------------
   LOAD MEMORY
------------------------- */
export async function loadMemory() {
  try {
    const data = await fs.readFile(memoryPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return {
      identity: {
        interests: [],
      },
    };
  }
}

/* -------------------------
   SAVE MEMORY
------------------------- */
export async function saveMemory(memory) {
  await fs.writeFile(memoryPath, JSON.stringify(memory, null, 2));
}

/* -------------------------
   UPDATE MEMORY FROM MESSAGE
------------------------- */
export function updateMemoryFromMessage(message, memory) {
  const text = message.toLowerCase();

  if (!memory.identity) {
    memory.identity = { interests: [] };
  }

  if (!memory.identity.interests) {
    memory.identity.interests = [];
  }

  /* Detect interest statements */
  const interestTriggers = [
    "i like",
    "i enjoy",
    "i love",
    "i am interested in",
    "i'm interested in",
  ];

  for (const trigger of interestTriggers) {
    if (text.includes(trigger)) {
      const subject = text.split(trigger)[1]?.trim();

      if (subject && subject.length < 40) {
        if (!memory.identity.interests.includes(subject)) {
          memory.identity.interests.push(subject);
        }
      }
    }
  }

  return memory;
}
