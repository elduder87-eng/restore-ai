import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // ---------- MEMORY ----------
    const sessionId = "default-user";

    let history = await redis.get(sessionId);
    if (!history) history = [];

    history.push({ role: "user", content: message });

    // ---------- OPENAI ----------
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are Restore AI, a calm teacher that explains concepts clearly and simply.",
          },
          ...history,
        ],
      }),
    });

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry — I couldn't generate a reply.";

    history.push({ role: "assistant", content: reply });

    // keep last 10 messages
    await redis.set(sessionId, history.slice(-10));

    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
