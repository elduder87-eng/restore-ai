import { redis } from "./redis";

const ADAPT_KEY = "restore:adaptation";

/*
Progressive personality adaptation
Slow accumulation of behavioral signals
*/

export async function getAdaptationProfile(userId = "default-user") {
  const data = await redis.hgetall(`${ADAPT_KEY}:${userId}`);
  return data || {};
}

export async function updateAdaptationProfile(userId, signals = {}) {
  const key = `${ADAPT_KEY}:${userId}`;

  const updates = {};

  for (const [trait, value] of Object.entries(signals)) {
    const current = Number(
      (await redis.hget(key, trait)) || 0
    );

    // slow growth factor
    const next = current + value * 0.15;

    // clamp between 0–10
    updates[trait] = Math.max(0, Math.min(10, next));
  }

  if (Object.keys(updates).length > 0) {
    await redis.hset(key, updates);
  }

  return updates;
}
