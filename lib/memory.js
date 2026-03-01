// lib/memory.js

import { Redis } from "@upstash/redis";

// --------------------
// REDIS CONNECTION
// --------------------

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// --------------------
// CONVERSATION MEMORY
// --------------------

export async function saveMessage(userId, message) {
  const key = `chat:${userId}`;

  await redis.rpush(key, JSON.stringify(message));

  // keep last 20 messages only
  await redis.ltrim(key, -20, -1);
}

export async function getMessages(userId) {
  const key = `chat:${userId}`;

  const messages = await redis.lrange(key, 0, -1);

  if (!messages) return [];

  return messages.map((m) => JSON.parse(m));
}

// --------------------
// LEARNING STYLE MEMORY
// --------------------

export async function saveLearningStyle(userId, style) {
  await redis.set(
    `learningStyle:${userId}`,
    JSON.stringify(style)
  );
}

export async function getLearningStyle(userId) {
  const data = await redis.get(`learningStyle:${userId}`);

  return data ? JSON.parse(data) : {};
}
