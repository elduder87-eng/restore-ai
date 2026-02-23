import { saveMemory, getMemory } from "/lib/studentMemory.js";
import { detectInsight } from "/lib/insights.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ reply: "Method not allowed" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "No message provided." });
    }

    const userId = "default-user";

    // ======================
    // MEMORY DETECTION
    // ======================

    const insight = detectInsight(message);

    if (insight) {
      await saveMemory(userId, insight.key, insight.value);

      return res.json({
        reply: `Got it — I'll remember that ${insight.key} is ${insight.value}.`
      });
    }

    // ======================
    // MEMORY RECALL
    // ======================

    if (message.toLowerCase().includes("favorite color")) {
      const color = await getMemory(userId, "favorite color");

      if (color) {
        return res.json({
          reply: `Your favorite color is ${color}.`
        });
      }
    }

    // ======================
    // TEACHER MODE RESPONSES
    // ======================

    const lower = message.toLowerCase();

    if (lower.includes("gravity")) {
      return res.json({
        reply:
          "Gravity is a force that pulls objects toward each other. Earth's mass pulls objects toward its center, which is why things fall downward."
      });
    }

    if (lower.includes("photosynthesis")) {
      return res.json({
        reply:
          "Photosynthesis is how plants make food using sunlight, water, and carbon dioxide. They turn light energy into sugar and release oxygen."
      });
    }

    if (lower.includes("hello")) {
      return res.json({
        reply: "Hello! What would you like to learn about today?"
      });
    }

    return res.json({
      reply:
        "Here is a clear explanation: learning works best when ideas are broken into simple steps and connected to things you already understand."
    });

  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({
      reply: "Server error. Please try again."
    });
  }
}
