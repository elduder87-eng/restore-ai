import { saveMemory, getMemory } from "../lib/studentMemory";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ reply: "Method not allowed" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "No message provided." });
    }

    const userId = "default-user"; // simple user identity for now

    const lowerMessage = message.toLowerCase();

    // =============================
    // MEMORY SAVE
    // =============================
    if (lowerMessage.includes("my favorite color is")) {
      const color = message.split("is")[1]?.trim();

      if (color) {
        await saveMemory(userId, "favoriteColor", color);
        return res.json({
          reply: `Got it — I'll remember that your favorite color is ${color}.`,
        });
      }
    }

    // =============================
    // MEMORY RECALL
    // =============================
    if (lowerMessage.includes("what is my favorite color")) {
      const color = await getMemory(userId, "favoriteColor");

      if (color) {
        return res.json({
          reply: `Your favorite color is ${color}.`,
        });
      } else {
        return res.json({
          reply: "You haven't told me your favorite color yet.",
        });
      }
    }

    // =============================
    // TEACHER MODE RESPONSES
    // =============================
    if (lowerMessage.includes("hello")) {
      return res.json({
        reply: "Hello! What would you like to learn about today?",
      });
    }

    if (lowerMessage.includes("gravity")) {
      return res.json({
        reply:
          "Gravity is a force that pulls objects toward each other. Earth's mass pulls objects toward its center, which is why things fall downward.",
      });
    }

    if (lowerMessage.includes("photosynthesis")) {
      return res.json({
        reply:
          "Photosynthesis is how plants make food using sunlight, water, and carbon dioxide. They turn light energy into sugar for growth and release oxygen into the air.",
      });
    }

    if (lowerMessage.includes("stop asking questions")) {
      return res.json({
        reply:
          "Understood. I will focus on clear explanations instead of questions.",
      });
    }

    // =============================
    // DEFAULT RESPONSE
    // =============================
    return res.json({
      reply:
        "Here is a clear explanation: learning works best when ideas connect to understanding.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      reply: "Server error. Please try again.",
    });
  }
}
