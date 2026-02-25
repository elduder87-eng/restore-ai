// api/chat.js

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

    const { message, sessionId = "default" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // Get memory
    const memory = (await redis.get(sessionId)) || [];

    const messages = [
      {
        role: "system",
        content:
          "You are Restore AI, a supportive teacher helping users learn step-by-step.",
      },
      ...memory,
      { role: "user", content: message },
    ];

    // OpenAI request
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    const reply = completion.choices[0].message.content;

    // Save memory
    const updatedMemory = [
      ...memory,
      { role: "user", content: message },
      { role: "assistant", content: reply },
    ].slice(-20);

    await redis.set(sessionId, updatedMemory);

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("CHAT ERROR:", error);
    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
}
