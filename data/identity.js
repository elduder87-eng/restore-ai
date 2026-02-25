// data/identity.js

import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// Create memory key per user
function memoryKey(userId) {
  return `identity:${userId}`;
}

// Get identity memory
export async function getIdentity(userId) {
  const data = await redis.get(memoryKey(userId));
  return data || {
    name: null,
    interests: [],
    learning_goals: [],
    strengths: [],
    struggles: []
  };
}

// Save identity memory
export async function saveIdentity(userId, identity) {
  await redis.set(memoryKey(userId), identity);
}
