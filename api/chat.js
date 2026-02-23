import { saveMemory, getMemory } from "../lib/studentMemory.js";
import { detectInsight } from "../lib/insights.js";

export default async function handler(req, res) {
  try {
    const { message } = req.body;

    // ---------- MEMORY DETECTION ----------
    const insight = detectInsight(message);

    if (insight?.type === "memory") {
      await saveMemory(insight.key, insight.value);

      return res.status(200).json({
        reply: `Got it — I'll remember that your favorite color is ${insight.value}.`,
      });
    }

    // ---------- MEMORY RECALL ----------
    if (message.toLowerCase().includes("what is my favorite color")) {
      const color = await getMemory("favorite_color");

      if (color) {
        return res.status(200).json({
          reply: `Your favorite color is ${color}.`,
        });
      } else {
        return res.status(200).json({
          reply: "I don't know your favorite color yet.",
        });
      }
    }

    // ---------- TEACHER MODE ----------
    if (message.toLowerCase().includes("stop asking questions")) {
      return res.status(200).json({
        reply:
          "Understood. I will focus on clear explanations instead of questions.",
      });
    }

    if (message.toLowerCase().includes("hello")) {
      return res.status(200).json({
        reply: "Hello! What would you like to learn about today?",
      });
    }

    if (message.toLowerCase().includes("gravity")) {
      return res.status(200).json({
        reply:
          "Gravity is a force that pulls objects toward each other. Earth's mass pulls objects toward its center, which is why things fall downward.",
      });
    }

    if (message.toLowerCase().includes("photosynthesis")) {
      return res.status(200).json({
        reply:
          "Photosynthesis is how plants use sunlight, water, and carbon dioxide to make food and release oxygen.",
      });
    }

    // ---------- DEFAULT ----------
    return res.status(200).json({
      reply: "Here is a clear explanation: learning works best with understanding.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      reply: "Server error. Please try again.",
    });
  }
}
