// lib/timelineMemory.js

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Save conversation event
export async function saveTimelineEvent(userId, role, message) {
  if (!userId || !message) return;

  const event = {
    role,
    message,
    timestamp: Date.now(),
    topic: detectTopic(message),
  };

  await redis.lpush(`timeline:${userId}`, JSON.stringify(event));

  // keep last 50 messages only
  await redis.ltrim(`timeline:${userId}`, 0, 49);
}

// Get recent timeline
export async function getTimeline(userId) {
  const items = await redis.lrange(`timeline:${userId}`, 0, 10);

  return items.map((item) => JSON.parse(item));
}


// VERY SIMPLE topic detection (we improve later)
function detectTopic(text) {
  const lower = text.toLowerCase();

  if (lower.includes("physics") || lower.includes("gravity"))
    return "physics";

  if (lower.includes("math") || lower.includes("algebra"))
    return "math";

  if (lower.includes("biology"))
    return "biology";

  if (lower.includes("history"))
    return "history";

  return "general";
}
