import { redis } from "./redis";

const PROFILE_KEY = (userId) => `personality:${userId}`;


// Load personality profile
export async function loadPersonality(userId) {
  const data = await redis.get(PROFILE_KEY(userId));
  return data ? JSON.parse(data) : {};
}


// Save personality profile
export async function savePersonality(userId, profile) {
  await redis.set(
    PROFILE_KEY(userId),
    JSON.stringify(profile)
  );
}


// Simple behavior learning
export async function updatePersonality(userId, message) {
  const profile = await loadPersonality(userId);

  const text = message.toLowerCase();

  // Detect deep thinking signals
  if (
    text.includes("why") ||
    text.includes("how") ||
    text.includes("describe") ||
    text.includes("what kind of")
  ) {
    profile.depth_preference = "deep";
  }

  // Detect exploratory style
  if (
    text.includes("think") ||
    text.includes("feel") ||
    text.includes("seem")
  ) {
    profile.conversation_style = "exploratory";
  }

  // Default tone
  profile.tone_preference = profile.tone_preference || "reflective";

  await savePersonality(userId, profile);

  return profile;
}
