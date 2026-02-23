import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ reply: "Method not allowed" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "No message provided." });
    }

    const sessionId = "default-user";

    // -------------------------
    // LOAD MEMORY
    // -------------------------
    let memory = await redis.get(`memory:${sessionId}`);
    if (!memory) memory = [];

    // Save user message
    memory.push({ role: "user", content: message });

    // Keep memory small
    memory = memory.slice(-10);

    // -------------------------
    // SYSTEM PROMPT
    // -------------------------
    const systemPrompt = {
      role: "system",
      content: `
You are Restore AI — a calm educational assistant.

Rules:
- Prefer clear explanations.
- If user asks for simple explanation → explain directly.
- Avoid excessive questioning.
- Be encouraging and easy to understand.
- Remember personal facts the user shares.
      `,
    };

    // -------------------------
    // OPENAI CALL
    // -------------------------
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [systemPrompt, ...memory],
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "I’m having trouble responding right now.";

    // Save assistant reply
    memory.push({ role: "assistant", content: reply });

    await redis.set(`memory:${sessionId}`, memory);

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("CHAT ERROR:", error);
    return res
      .status(500)
      .json({ reply: "Server error. Please try again." });
  }
}
