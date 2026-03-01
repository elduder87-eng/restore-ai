import { getMemory, addInterest } from "@/lib/memory";
import {
  updateLearning,
  summarizeLearning
} from "@/lib/learning";

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message || "";

    const userId = "default-user";
    const lower = message.toLowerCase();

    const memory = getMemory(userId);

    // -----------------------------
    // MEMORY DETECTION
    // -----------------------------
    if (lower.includes("i enjoy") || lower.includes("i like")) {
      const interest = message
        .replace(/i enjoy|i like/gi, "")
        .trim()
        .toLowerCase();

      if (interest) {
        addInterest(userId, interest);
      }
    }

    // -----------------------------
    // LEARNING STATE DETECTION
    // -----------------------------
    let detectedTopic = null;
    let learningStage = null;

    if (lower.includes("i enjoy") || lower.includes("i like")) {
      detectedTopic = message.replace(/i enjoy|i like/gi, "").trim();
      learningStage = "curious";
    }

    if (lower.startsWith("explain")) {
      detectedTopic = message.replace(/explain/gi, "").trim();
      learningStage = "learning";
    }

    if (
      lower.includes("so that means") ||
      lower.includes("does that mean")
    ) {
      detectedTopic = "current topic";
      learningStage = "understanding";
    }

    if (
      lower.includes("that connects") ||
      lower.includes("that relates")
    ) {
      detectedTopic = "current topic";
      learningStage = "reflecting";
    }

    if (detectedTopic && learningStage) {
      updateLearning(userId, detectedTopic, learningStage);
    }

    // -----------------------------
    // PROGRESS REQUEST
    // -----------------------------
    if (
      lower.includes("how am i doing") ||
      lower.includes("my progress")
    ) {
      const progress = summarizeLearning(userId);

      const summary =
        Object.keys(progress).length === 0
          ? "You're just getting started!"
          : Object.entries(progress)
              .map(
                ([topic, data]) => `${topic}: ${data.stage}`
              )
              .join("\n");

      return Response.json({
        reply: "Here’s your learning progress:\n" + summary
      });
    }

    // -----------------------------
    // MEMORY RECALL
    // -----------------------------
    if (lower.includes("what do you remember")) {
      if (memory.interests.length === 0) {
        return Response.json({
          reply: "I'm still getting to know you!"
        });
      }

      return Response.json({
        reply:
          "I remember that you're interested in " +
          memory.interests.join(", ") +
          "."
      });
    }

    // -----------------------------
    // SIMPLE TEACHER RESPONSE
    // -----------------------------
    let reply = "Tell me more!";

    if (lower.includes("hello")) {
      reply = "Hello! How can I help you learn today?";
    } else if (lower.includes("astronomy")) {
      reply =
        "Astronomy explores stars, planets, galaxies, and the universe.";
    } else if (lower.includes("biology")) {
      reply =
        "Biology studies living organisms — from tiny cells to entire ecosystems.";
    } else if (lower.includes("gravity")) {
      reply =
        "Gravity is a force that pulls objects toward each other. Massive objects like Earth pull things toward them.";
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
