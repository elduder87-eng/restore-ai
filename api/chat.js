import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  try {
    const { message } = req.body;
    const userId = "default-user";

    const lower = message.toLowerCase();

    // ---- LOAD MEMORY ----
    const savedName = await redis.get(`${userId}:name`);

    let extractedName = null;

    // Detect multiple intro styles
    if (lower.includes("my name is")) {
      extractedName = message.split(/my name is/i)[1].trim();
    }

    if (lower.startsWith("i am ")) {
      extractedName = message.slice(5).trim();
    }

    if (lower.startsWith("i'm ")) {
      extractedName = message.slice(4).trim();
    }

    // ---- SAVE NAME ----
    if (extractedName) {
      await redis.set(`${userId}:name`, extractedName);

      return res.status(200).json({
        reply: `Nice to meet you, ${extractedName}! I'll remember that.`,
      });
    }

    // ---- NORMAL RESPONSE ----
    if (savedName) {
      return res.status(200).json({
        reply: `Welcome back, ${savedName}. I'm here to help you learn.`,
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
