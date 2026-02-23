import { saveMemory, getMemory } from "../lib/studentMemory";

export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const userId = "default-user";

    // ---------- MEMORY DETECTION ----------
    let memorySaved = false;

    if (message) {
      const lower = message.toLowerCase();

      if (lower.includes("my favorite color is")) {
        const color = message.split("is")[1]?.trim();

        if (color) {
          await saveMemory(userId, "favorite_color", color);
          memorySaved = true;
        }
      }
    }

    // ---------- MEMORY RESPONSE ----------
    if (memorySaved) {
      return res.status(200).json({
        reply: "Got it — I'll remember that.",
      });
    }

    // ---------- MEMORY RECALL ----------
    if (message.toLowerCase().includes("favorite color")) {
      const memory = await getMemory(userId);

      if (memory?.favorite_color) {
        return res.status(200).json({
          reply: `Your favorite color is ${memory.favorite_color}.`,
        });
      }
    }

    // ---------- NORMAL AI RESPONSE ----------
    return res.status(200).json({
      reply: "Here is a clear explanation: learning works best with understanding.",
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);

    return res.status(200).json({
      reply: "I had trouble remembering that, but I'm still here.",
    });
  }
}
