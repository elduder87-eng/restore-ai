import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const USER_ID = "default-user";

export async function rememberFact(message) {
  const lower = message.toLowerCase();

  // favorite color memory
  if (lower.includes("favorite color is")) {
    const color = message.split("favorite color is")[1]?.trim();

    if (color) {
      await redis.set(`${USER_ID}:favoriteColor`, color);
      return `Got it — I'll remember that your favorite color is ${color}.`;
    }
  }

  return null;
}

export async function recallMemory(message) {
  const lower = message.toLowerCase();

  if (lower.includes("my favorite color")) {
    const color = await redis.get(`${USER_ID}:favoriteColor`);

    if (color) {
      return `Your favorite color is ${color}.`;
    } else {
      return "I don't know your favorite color yet.";
    }
  }

  return null;
}
