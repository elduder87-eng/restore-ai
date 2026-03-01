// lib/memory.js

import { Redis } from "@upstash/redis";
import { detectTopic } from "./topic";

export const redis = Redis.fromEnv();

export async function saveMemory(userId, message) {
  if (!userId || !message) return;

  // Save conversation history
  await redis.rpush(`history:${userId}`, message);

  // Keep last 20 messages
  await redis.ltrim(`history:${userId}`, -20, -1);

  // Detect conversational topic
  const topic = detectTopic(message);

  if (topic) {
    await redis.set(`topic:${userId}`, topic);
  }
}

export async function getHistory(userId) {
  if (!userId) return [];
  return await redis.lrange(`history:${userId}`, 0, -1);
}

export async function getTopic(userId) {
  return await redis.get(`topic:${userId}`);
}
