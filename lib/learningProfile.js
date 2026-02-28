import { redis } from "./redis";

const PROFILE_KEY = "restore:learningProfile";

export async function getLearningProfile() {
  try {
    const profile = await redis.get(PROFILE_KEY);

    return (
      profile || {
        prefersSimple: false,
        prefersDepth: false,
        likesExamples: false,
      }
    );
  } catch (err) {
    console.error("Learning profile load error:", err);

    return {
      prefersSimple: false,
      prefersDepth: false,
      likesExamples: false,
    };
  }
}

export async function updateLearningProfile(message) {
  try {
    const profile = await getLearningProfile();

    const text = message.toLowerCase();

    if (text.includes("simple")) profile.prefersSimple = true;
    if (text.includes("deep")) profile.prefersDepth = true;
    if (text.includes("example")) profile.likesExamples = true;

    await redis.set(PROFILE_KEY, profile);
  } catch (err) {
    console.error("Learning profile update error:", err);
  }
}
