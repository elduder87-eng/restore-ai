// lib/redis.js

import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// ALWAYS store JSON safely
export async function setJSON(key, value) {
  await redis.set(key, JSON.stringify(value));
}

export async function getJSON(key) {
  const data = await redis.get(key);

  if (!data) return null;

  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch {
    return null;
  }
}
