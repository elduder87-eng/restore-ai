import { redis } from "./redis";

/*
  Identity Engine
  Builds a summary of who the user is
  based on stored memories.
*/

export async function buildIdentity(userId = "default") {
  try {
    const memories = await redis.lrange(
      `memory:${userId}`,
      0,
      -1
    );

    if (!memories || memories.length === 0) {
      return "No identity formed yet.";
    }

    // Combine memories into readable context
    const combined = memories.join(". ");

    // Simple identity synthesis (v1)
    const identity = `
User profile based on memory:
${combined}

General traits:
- Shares personal preferences
- Engages conversationally
- Building ongoing relationship with AI
`;

    // Save identity snapshot
    await redis.set(`identity:${userId}`, identity);

    return identity;
  } catch (error) {
    console.error("Identity build error:", error);
    return "Identity unavailable.";
  }
}

export async function loadIdentity(userId = "default") {
  try {
    const identity = await redis.get(`identity:${userId}`);
    return identity || "No identity stored.";
  } catch (error) {
    console.error("Identity load error:", error);
    return "Identity unavailable.";
  }
}
