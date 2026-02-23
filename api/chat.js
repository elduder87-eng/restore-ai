import { redis } from "../lib/redis.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ reply: "Method not allowed" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "No message provided." });
    }

    const userId = "default-user";

    // Load memory
    let history = (await redis.get(userId)) || [];

    history.push({
      role: "user",
      content: message,
    });

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
          messages: [
            {
              role: "system",
              content:
                "You are Restore AI, a calm teacher who explains concepts simply and clearly. Avoid unnecessary questions.",
            },
            ...history,
          ],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    history.push({
      role: "assistant",
      content: reply,
    });

    await redis.set(userId, history);

    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Server error." });
  }
}
