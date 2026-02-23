import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function saveLearningPreference(sessionId, preference) {
  if (!preference) return;

  await redis.sadd(`learning:${sessionId}`, preference);
}

export async function getLearningProfile(sessionId) {
  const prefs = await redis.smembers(`learning:${sessionId}`);
  return prefs || [];
}
