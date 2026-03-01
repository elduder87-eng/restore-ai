import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

/*
  MEMORY STRUCTURE

  memory:userId = {
    interests: [],
    traits: [],
    facts: []
  }
*/

export async function loadMemory(userId = "default") {
  try {
    const memory = await redis.get(`memory:${userId}`);

    if (!memory) {
      return {
        interests: [],
        traits: [],
        facts: [],
      };
    }

    return memory;
  } catch (error) {
    console.error("LOAD MEMORY ERROR:", error);
    return {
      interests: [],
      traits: [],
      facts: [],
    };
  }
}

export async function saveMemory(userId = "default", memory) {
  try {
    await redis.set(`memory:${userId}`, memory);
  } catch (error) {
    console.error("SAVE MEMORY ERROR:", error);
  }
}
