import { redis } from "./redis";

/*
  Learning Memory System
  ----------------------
  Stores HOW the user learns, not WHAT they say.
*/

const KEY = "restore:learning-style";

/* ---------------- SAVE ---------------- */

export async function saveLearningSignal(message) {
  if (!message) return;

  const text = message.toLowerCase();

  let signals = [];

  // curiosity signals
  if (
    text.includes("why") ||
    text.includes("how") ||
    text.includes("what if")
  ) {
    signals.push("curiosity-driven");
  }

  // explanation preference
  if (
    text.includes("explain") ||
    text.includes("teach") ||
    text.includes("help me understand")
  ) {
    signals.push("explanation-seeking");
  }

  // analogy preference
  if (
    text.includes("like i'm") ||
    text.includes("example") ||
    text.includes("analogy")
  ) {
    signals.push("analogy-friendly");
  }

  // reflective thinking
  if (
    text.includes("meaning") ||
    text.includes("purpose") ||
    text.includes("think about")
  ) {
    signals.push("reflective");
  }

  if (signals.length === 0) return;

  const existing = (await redis.get(KEY)) || [];

  const updated = [...new Set([...existing, ...signals])];

  await redis.set(KEY, updated);
}

/* ---------------- LOAD ---------------- */

export async function getLearningProfile() {
  const data = await redis.get(KEY);
  return data || [];
}
