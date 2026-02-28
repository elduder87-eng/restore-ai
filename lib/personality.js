import { redis } from "./redis";

const PROFILE_KEY = (userId) => `personality:${userId}`;

export async function loadPersonality(userId) {
  const data = await redis.get(PROFILE_KEY(userId));
  return data ? JSON.parse(data) : {};
}

export async function savePersonality(userId, profile) {
  await redis.set(
    PROFILE_KEY(userId),
    JSON.stringify(profile)
  );
}

export async function updatePersonality(userId, message) {
  const profile = await loadPersonality(userId);

  const text = message.toLowerCase();

  if (
    text.includes("why") ||
    text.includes("how") ||
    text.includes("describe") ||
    text.includes("what kind")
  ) {
    profile.depth_preference = "deep";
  }

  if (
    text.includes("think") ||
    text.includes("feel") ||
    text.includes("seem")
  ) {
    profile.conversation_style = "exploratory";
  }

  profile.tone_preference =
    profile.tone_preference || "reflective";

  await savePersonality(userId, profile);

  return profile;
}
