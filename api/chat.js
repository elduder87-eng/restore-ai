import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const userId = "default-user";

    // get stored name
    const name = await redis.get(`user:${userId}:name`);

    // learn name
    if (message.toLowerCase().includes("my name is")) {
      const newName = message.split("my name is")[1].trim();
      await redis.set(`user:${userId}:name`, newName);

      return res.json({
        reply: `Nice to meet you, ${newName}. I'll remember that.`,
      });
    }

    if (name) {
      return res.json({
        reply: `Welcome back, ${name}. I'm here to help you learn.`,
      });
    }

    res.json({
      reply: "I'm here to help you learn.",
    });
  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ reply: "Server error." });
  }
}
