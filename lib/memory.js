import { kv } from "@vercel/kv";

const MEMORY_KEY = "restore:memory";

/*
  Decide if something is worth remembering
*/
function isMeaningfulMemory(message) {
  const text = message.toLowerCase();

  const signals = [
    "i like",
    "i love",
    "i enjoy",
    "i prefer",
    "i want to learn",
    "i struggle",
    "i find it hard",
    "my goal",
    "i am interested",
    "i care about",
  ];

  return signals.some(signal => text.includes(signal));
}

/*
  Save meaningful memory only
*/
export async function saveMemory(userMessage) {
  try {
    if (!isMeaningfulMemory(userMessage)) {
      return; // skip noise
    }

    const existing =
      (await kv.get(MEMORY_KEY)) || [];

    existing.push({
      text: userMessage,
      time: Date.now(),
    });

    // keep last 20 identity memories
    const trimmed = existing.slice(-20);

    await kv.set(MEMORY_KEY, trimmed);
  } catch (err) {
    console.error("MEMORY SAVE ERROR:", err);
  }
}

/*
  Load memory for AI context
*/
export async function loadMemory() {
  try {
    const memories =
      (await kv.get(MEMORY_KEY)) || [];

    return memories.map(m => m.text).join("\n");
  } catch (err) {
    console.error("MEMORY LOAD ERROR:", err);
    return "";
  }
}
