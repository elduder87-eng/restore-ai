import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ reply: "Method not allowed." });
    }

    const { message } = req.body || {};

    if (!message) {
      return res.status(200).json({
        reply: "I didn't receive a message.",
      });
    }

    // ---------- MEMORY ----------
    const sessionId = "default-user";

    let history = await redis.get(sessionId);
    if (!Array.isArray(history)) history = [];

    history.push({
      role: "user",
      content: message,
    });

    // ---------- OPENAI CALL ----------
    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
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
                "You are Restore AI, a calm teacher that explains clearly and kindly.",
            },
            ...history,
          ],
        }),
      }
    );

    const data = await openaiResponse.json();

    console.log("OPENAI RESPONSE:", data);

    const reply =
      data?.choices?.[0]?.message?.content ??
      "Sorry — I couldn't generate a response.";

    history.push({
      role: "assistant",
      content: reply,
    });

    await redis.set(sessionId, history.slice(-10));

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    return res.status(200).json({
      reply: "Server error — please try again.",
    });
  }
}
