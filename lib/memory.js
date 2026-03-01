import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// --------------------
// MEMORY (chat history)
// --------------------

export async function saveMessage(userId, role, content) {
  await redis.rpush(`chat:${userId}`, JSON.stringify({ role, content }));
}

export async function getMessages(userId) {
  const messages = await redis.lrange(`chat:${userId}`, 0, -1);
  return messages.map((m) => JSON.parse(m));
}

// --------------------
// LEARNING STYLE MEMORY
// --------------------

export async function saveLearningStyle(userId, style) {
  await redis.set(`learningStyle:${userId}`, style);
}

export async function getLearningStyle(userId) {
  return (await redis.get(`learningStyle:${userId}`)) || {};
}
