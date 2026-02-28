import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const IDENTITY_KEY = "restore:identity";

/*
Identity Structure
*/
const defaultIdentity = {
  traits: [],
  interests: [],
  communication_style: "neutral",
};

/*
Get Identity
*/
export async function getIdentity() {
  const data = await redis.get(IDENTITY_KEY);

  if (!data) {
    await redis.set(IDENTITY_KEY, defaultIdentity);
    return defaultIdentity;
  }

  return data;
}

/*
Save Identity
*/
export async function saveIdentity(identity) {
  await redis.set(IDENTITY_KEY, identity);
}

/*
Update Identity From Message
(Simple inference engine)
*/
export async function updateIdentityFromMessage(message) {
  const identity = await getIdentity();
  const text = message.toLowerCase();

  // Interest detection
  if (text.includes("philosophy") || text.includes("philosophical")) {
    if (!identity.interests.includes("philosophy")) {
      identity.interests.push("philosophy");
    }
  }

  if (text.includes("movie") || text.includes("film")) {
    if (!identity.interests.includes("film")) {
      identity.interests.push("film");
    }
  }

  // Communication style inference
  if (
    text.includes("meaning") ||
    text.includes("existence") ||
    text.includes("why") ||
    text.includes("consciousness")
  ) {
    identity.communication_style = "reflective";
  }

  await saveIdentity(identity);
}
