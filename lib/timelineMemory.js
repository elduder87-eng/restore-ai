// lib/timelineMemory.js

import { redis } from "./redis";
import { getCurrentUser } from "./user";

/**
 * Store long-term timeline memories
 */
export async function saveTimelineMemory(entry) {
  const { userId } = getCurrentUser();

  await redis.rpush(
    `timeline:${userId}`,
    JSON.stringify({
      entry,
      timestamp: Date.now(),
    })
  );
}

/**
 * Retrieve timeline memories
 */
export async function getTimelineMemory() {
  const { userId } = getCurrentUser();

  const data = await redis.lrange(`timeline:${userId}`, 0, -1);

  return data.map((item) => JSON.parse(item));
}
