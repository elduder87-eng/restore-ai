import { Redis } from "@upstash/redis";

/*
  Restore AI — Memory Layer
  Connects to Upstash Redis using Vercel environment variables
*/

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

/* -----------------------------
   Save Memory
--------------------------------*/
export async function saveMemory(key, value) {
  try {
    await redis.set(key, value);
  } catch (error) {
    console.error("Memory save error:", error);
  }
}

/* -----------------------------
   Get Memory
--------------------------------*/
export async function getMemory(key) {
  try {
    return await redis.get(key);
  } catch (error) {
    console.error("Memory read error:", error);
    return null;
  }
}

/* -----------------------------
   Delete Memory (optional helper)
--------------------------------*/
export async function deleteMemory(key) {
  try {
    await redis.del(key);
  } catch (error) {
    console.error("Memory delete error:", error);
  }
}
