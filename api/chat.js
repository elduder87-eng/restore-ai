import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const userId = "default-user";

    // ---- LOAD MEMORY ----
    const name = await redis.get(`${userId}:name`);

    // ---- SAVE NAME IF PROVIDED ----
    if (message.toLowerCase().includes("my name is")) {
      const extracted = message.split("my name is")[1].trim();
      await redis.set(`${userId}:name`, extracted);

      return res.status(200).json({
        reply: `Nice to meet you, ${extracted}! I'll remember that.`,
      });
    }

    // ---- NORMAL RESPONSE ----
    if (name) {
      return res.status(200).json({
        reply: `Welcome back, ${name}. I'm here to help you learn.`,
      });
    }

    return res.status(200).json({
      reply: "I'm here to help you learn.",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      reply: "Server error.",
    });
  }
}
