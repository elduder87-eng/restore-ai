import { kv } from "@vercel/kv";

/*
  LEARNING PROFILE ENGINE
  Behavioral modeling + Structured identity tracking + Resurfacing control
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
      profile.identity[field] = {
        values: {},
      };
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
  Resurfacing Decision Engine
*/

export function shouldResurface(profile, message) {
  if (!profile?.identity) return null;

  const lowerMessage = message.toLowerCase();
  const now = Date.now();

  for (const field in profile.identity) {
    const values = profile.identity[field].values;

    for (const value in values) {
      const confidence = values[value];

      // Confidence threshold
      if (confidence < 0.7) continue;

      // Relevance check (very lightweight)
      if (!lowerMessage.includes(field) && !lowerMessage.includes(value)) continue;

      // Cooldown check (60 seconds)
      const lastTime = profile.resurfacing_log?.[value] || 0;
      if (now - lastTime < 60000) continue;

      // Update cooldown
      profile.resurfacing_log[value] = now;

      return {
        field,
        value,
        confidence
      };
    }
  }

  return null;
}
