import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message } = req.body;

    const userId = "default-user";

    // Get stored name
    const name = await kv.get(`user:${userId}:name`);

    // Learn user's name
    if (message.toLowerCase().includes("my name is")) {
      const newName = message.split("my name is")[1].trim();

      await kv.set(`user:${userId}:name`, newName);

      return res.json({
        reply: `Nice to meet you, ${newName}. I'll remember that.`,
      });
    }

    // Greeting with memory
    if (name) {
      return res.json({
        reply: `Welcome back, ${name}. I'm here to help you learn.`,
      });
    }

    return res.json({
      reply: "I'm here to help you learn.",
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
}
