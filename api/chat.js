import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const userId = "default-user";

    // Get stored name
    const name = await kv.get(`name:${userId}`);

    // Save name if user introduces themselves
    if (message.toLowerCase().includes("my name is")) {
      const extracted = message.split("my name is")[1].trim();
      await kv.set(`name:${userId}`, extracted);

      return res.status(200).json({
        reply: `Nice to meet you, ${extracted}. I'll remember that.`,
      });
    }

    // Recall memory
    if (name) {
      return res.status(200).json({
        reply: `Welcome back, ${name}. I'm here to help you learn.`,
      });
    }

    return res.status(200).json({
      reply: "I'm here to help you learn.",
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);
    return res.status(500).json({ reply: "Server error." });
  }
}
