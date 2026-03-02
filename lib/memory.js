import { kv } from "@vercel/kv";

/*
  Restore AI — Persistent Memory Layer
  -----------------------------------
  Stores long-term learner identity using Vercel KV.
*/

const USER_PREFIX = "user";

/* ===============================
   SAVE MEMORY
=================================*/
export async function saveMemory(userId, key, value) {
  try {
    if (!userId || !key) return;

    await kv.hset(`${USER_PREFIX}:${userId}`, {
      [key]: value,
    });

    console.log("✅ Memory saved:", key);
  } catch (error) {
    console.error("❌ Memory save error:", error);
  }
}

/* ===============================
   LOAD MEMORY
=================================*/
export async function loadMemory(userId) {
  try {
    if (!userId) return {};

    const memory = await kv.hgetall(`${USER_PREFIX}:${userId}`);

    console.log("📚 Memory loaded:", memory);

    return memory || {};
  } catch (error) {
    console.error("❌ Memory load error:", error);
    return {};
  }
}
