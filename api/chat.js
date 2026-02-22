import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // ---- MEMORY STORAGE ----
    const historyKey = "restore:chat-history";

    // Save user message
    await redis.rpush(historyKey, `User: ${message}`);

    // Get last 10 messages
    const history = await redis.lrange(historyKey, -10, -1);

    // ---- SIMPLE RESPONSE ENGINE (temporary brain) ----
    let reply;

    if (message.toLowerCase().includes("gravity")) {
      reply =
        "Gravity is the force that pulls objects with mass toward each other. On Earth, gravity pulls everything toward the planet's center, which is why objects fall downward.";
    } else if (message.toLowerCase().includes("hello")) {
      reply = "Hello! What would you like to learn about today?";
    } else {
      reply =
        "Here is a clear explanation: learning happens when new information connects to things you already understand.";
    }

    // Save AI reply
    await redis.rpush(historyKey, `Restore AI: ${reply}`);

    return res.status(200).json({
      reply,
      memory: history,
    });
  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
