import { kv } from "@vercel/kv";

/*
  LEARNING PROFILE ENGINE
  Builds an evolving learner model
  + Structured identity tracking
*/

export async function updateLearningProfile(userId, message, extractedIdentity = {}) {
  const key = `profile:${userId}`;

  let profile = await kv.get(key);

  if (!profile) {
    profile = {
      curiosity_level: "medium",
      depth_preference: "balanced",
      engagement_style: "guided",
      topic_connections: [],
      identity: {}
    };
  }

  const text = message.toLowerCase();

  // -------------------------
  // Behavioral Detection
  // -------------------------

  if (text.includes("?") || text.includes("why") || text.includes("how")) {
    profile.curiosity_level = "high";
  }

  if (text.includes("explain") || text.includes("details")) {
    profile.depth_preference = "deep";
  }

  if (text.includes("simple") || text.includes("easy")) {
    profile.depth_preference = "simple";
  }

  if (text.includes("also") || text.includes("and")) {
    profile.engagement_style = "exploratory";
  }

  // -------------------------
  // Structured Identity Merge
  // -------------------------

  for (const field in extractedIdentity) {
    const newValue = extractedIdentity[field];

    if (!profile.identity[field]) {
      profile.identity[field] = {
        current: newValue,
        history: []
      };
    } else if (profile.identity[field].current !== newValue) {
      profile.identity[field].history.push(
        profile.identity[field].current
      );
      profile.identity[field].current = newValue;
    }
  }

  await kv.set(key, profile);

  return profile;
}

export async function getLearningProfile(userId) {
  return await kv.get(`profile:${userId}`);
}
