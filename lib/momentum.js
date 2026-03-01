// lib/momentum.js

import { redis } from "./redis";
import { getCurrentUser } from "./user";

const MOMENTUM_KEY = "momentum";

/**
 * Update conversational momentum
 */
export async function updateMomentum(message = "") {
  const { userId } = getCurrentUser();

  const text = message.toLowerCase();

  let learning = 0;
  let curiosity = 0;
  let personal = 0;

  // Learning signals
  if (
    text.includes("explain") ||
    text.includes("how") ||
    text.includes("why") ||
    text.includes("?")
  ) {
    learning += 1;
  }

  // Curiosity signals
  if (
    text.includes("wonder") ||
    text.includes("what if") ||
    text.includes("interesting")
  ) {
    curiosity += 1;
  }

  // Personal signals
  if (
    text.includes("i feel") ||
    text.includes("i like") ||
    text.includes("i enjoy")
  ) {
    personal += 1;
  }

  const key = `${MOMENTUM_KEY}:${userId}`;

  let existing = await redis.get(key);

  if (!existing) {
    existing = { learning: 0, curiosity: 0, personal: 0 };
  } else if (typeof existing === "string") {
    existing = JSON.parse(existing);
  }

  const updated = {
    learning: existing.learning + learning,
    curiosity: existing.curiosity + curiosity,
    personal: existing.personal + personal,
  };

  await redis.set(key, JSON.stringify(updated));

  return updated;
}

/**
 * Retrieve momentum state
 */
export async function getMomentum() {
  const { userId } = getCurrentUser();

  const data = await redis.get(`${MOMENTUM_KEY}:${userId}`);

  if (!data) {
    return { learning: 0, curiosity: 0, personal: 0 };
  }

  return typeof data === "string"
    ? JSON.parse(data)
    : data;
}
