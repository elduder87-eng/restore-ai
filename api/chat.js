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

    const { message, conversation = [], userId = "student_1" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // -----------------------------
    // LOAD MEMORY
    // -----------------------------
    const memoryKey = `memory:${userId}`;
    let memory = await redis.get(memoryKey);

    if (!memory) memory = {};

    // -----------------------------
    // SIMPLE IDENTITY DETECTION
    // -----------------------------
    const nameMatch = message.match(/my name is (\w+)/i);
    if (nameMatch) {
      memory.name = nameMatch[1];
      await redis.set(memoryKey, memory);
    }

    // -----------------------------
    // BUILD SYSTEM PROMPT
    // -----------------------------
    let systemPrompt = `
You are Restore AI — a supportive teaching assistant.
Speak clearly and help students learn through curiosity.
`;

    if (memory.name) {
      systemPrompt += ` The student's name is ${memory.name}.`;
    }

    // -----------------------------
    // OPENAI CALL
    // -----------------------------
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversation,
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({ reply });

  } catch (error) {
    console.error("CHAT ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
}
