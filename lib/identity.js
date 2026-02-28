import { redis } from "./redis";
import { loadMemory } from "./memory";

export async function buildIdentity(userId) {
  const memories = await loadMemory(userId);

  if (!memories.length) return;

  // Simple identity synthesis
  const profile = {
    interests: [],
    traits: [],
  };

  memories.forEach((m) => {
    const text = m.toLowerCase();

    if (text.includes("favorite movie"))
      profile.interests.push("films");

    if (text.includes("favorite food"))
      profile.interests.push("food");

    if (text.includes("favorite color"))
      profile.traits.push("expressive preferences");

    if (text.includes("i like"))
      profile.traits.push("open about interests");
  });

  const identitySummary = `
User Identity Summary:
Interests: ${[...new Set(profile.interests)].join(", ") || "unknown"}
Traits: ${[...new Set(profile.traits)].join(", ") || "developing"}
`;

  await redis.set(`identity:${userId}`, identitySummary);
}

export async function loadIdentity(userId) {
  return (await redis.get(`identity:${userId}`)) || "No identity formed yet.";
}
