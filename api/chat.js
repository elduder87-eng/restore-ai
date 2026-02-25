import OpenAI from "openai";
import { Redis } from "@upstash/redis";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ error: "Missing data" });
    }

    // -------------------------
    // Load memory
    // -------------------------
    let memory = await redis.get(`memory:${sessionId}`);

    if (!memory) {
      memory = [];
    }

    // Save user message
    memory.push({
      role: "user",
      content: message,
    });

    // Keep last 10 messages only
    memory = memory.slice(-10);

    // -------------------------
    // AI Response
    // -------------------------
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Restore AI, a friendly adaptive teacher that remembers user interests and helps them learn.",
        },
        ...memory,
      ],
    });

    const reply = completion.choices[0].message.content;

    // Save assistant reply
    memory.push({
      role: "assistant",
      content: reply,
    });

    // Store memory
    await redis.set(`memory:${sessionId}`, memory);

    return res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
}
