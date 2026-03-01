import { getMemory, saveInterest } from "../../../lib/memory";

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message || "";

    const userId = "default-user";

    const memory = getMemory(userId);

    const lower = message.toLowerCase();

    // Detect interests
    if (lower.includes("i like")) {
      const interest = lower.replace("i like", "").trim();
      if (interest) saveInterest(userId, interest);
    }

    if (lower.includes("i enjoy")) {
      const interest = lower.replace("i enjoy", "").trim();
      if (interest) saveInterest(userId, interest);
    }

    // Memory recall
    if (lower.includes("what do you remember")) {
      if (memory.interests.length === 0) {
        return Response.json({
          reply: "I'm still getting to know you!"
        });
      }

      return Response.json({
        reply: `I remember that you're interested in ${memory.interests.join(", ")}.`
      });
    }

    // Simple teaching responses
    let reply = "Tell me more!";

    if (lower.includes("astronomy")) {
      reply =
        "Astronomy explores stars, planets, galaxies, and the universe itself. What part interests you most?";
    }

    if (lower.includes("biology")) {
      reply =
        "Biology studies living organisms — from tiny cells to entire ecosystems.";
    }

    if (lower.includes("gravity")) {
      reply =
        "Gravity is a force that pulls objects toward each other. Earth's gravity keeps us on the ground and planets in orbit.";
    }

    return Response.json({ reply });

  } catch (error) {
    console.error("CHAT ERROR:", error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment."
    });
  }
}
