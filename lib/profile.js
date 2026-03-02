import { kv } from "@vercel/kv";

/*
  LEARNING PROFILE ENGINE
  Builds an evolving learner model
*/

export async function updateLearningProfile(userId, message) {
  const key = `profile:${userId}`;

  let profile = await kv.get(key);

  if (!profile) {
    profile = {
      curiosity_level: "medium",
      depth_preference: "balanced",
      engagement_style: "guided",
      topic_connections: []
    };
  }

  const text = message.toLowerCase();

  // curiosity detection
  if (text.includes("?") || text.includes("why") || text.includes("how")) {
    profile.curiosity_level = "high";
  }

  // depth preference detection
  if (text.includes("explain") || text.includes("details")) {
    profile.depth_preference = "deep";
  }

  if (text.includes("simple") || text.includes("easy")) {
    profile.depth_preference = "simple";
  }

  // exploratory behavior
  if (text.includes("also") || text.includes("and")) {
    profile.engagement_style = "exploratory";
  }

  await kv.set(key, profile);

  return profile;
}

export async function getLearningProfile(userId) {
  return await kv.get(`profile:${userId}`);
}
