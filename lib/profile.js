import { kv } from "@vercel/kv";

/*
  LEARNING PROFILE ENGINE
  Behavioral modeling + Confidence scoring + Domain-aware resurfacing
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
      identity: {},
      resurfacing_log: {}
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
  // Identity Merge (Confidence Scoring)
  // -------------------------

  for (const field in extractedIdentity) {
    const value = extractedIdentity[field];
    if (!value) continue;

    if (!profile.identity[field]) {
      profile.identity[field] = { values: {} };
    }

    if (!profile.identity[field].values[value]) {
      profile.identity[field].values[value] = 0.6;
    } else {
      profile.identity[field].values[value] += 0.1;
      if (profile.identity[field].values[value] > 1.0) {
        profile.identity[field].values[value] = 1.0;
      }
    }
  }

  await kv.set(key, profile);
  return profile;
}

export async function getLearningProfile(userId) {
  return await kv.get(`profile:${userId}`);
}

/*
  Domain-Aware Resurfacing Engine
*/

export function shouldResurface(profile, message) {
  if (!profile?.identity) return null;

  const lowerMessage = message.toLowerCase();
  const now = Date.now();

  // Domain clusters
  const foodDomain = [
    "food", "cooking", "recipe", "meal", "dinner",
    "lunch", "ingredients", "kitchen", "cuisine", "dish"
  ];

  const inFoodDomain = foodDomain.some(word =>
    lowerMessage.includes(word)
  );

  for (const field in profile.identity) {
    const values = profile.identity[field].values;

    for (const value in values) {
      const confidence = values[value];

      if (confidence < 0.7) continue;

      const lastTime = profile.resurfacing_log?.[value] || 0;
      if (now - lastTime < 60000) continue;

      let relevant = false;

      // Direct match
      if (lowerMessage.includes(value)) {
        relevant = true;
      }

      // Domain bridge: favorite_food + food domain
      if (field === "favorite_food" && inFoodDomain) {
        relevant = true;
      }

      if (!relevant) continue;

      profile.resurfacing_log[value] = now;

      return { field, value, confidence };
    }
  }

  return null;
}
