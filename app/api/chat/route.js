import OpenAI from "openai";
import { Redis } from "@upstash/redis";

export const runtime = "nodejs"; // IMPORTANT: fixes Redis crash

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Upstash Redis setup
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    // ---------- GET MEMORY ----------
    let memory = await redis.get(`memory:${userId}`);

    if (!memory) {
      memory = [];
    }

    // ---------- SIMPLE MEMORY RULE ----------
    // store interests automatically
    if (
      message.toLowerCase().includes("i enjoy") ||
      message.toLowerCase().includes("i like") ||
      message.toLowerCase().includes("i love")
    ) {
      memory.push(message);
      await redis.set(`memory:${userId}`, memory);
    }

    // ---------- BUILD SYSTEM CONTEXT ----------
    const memoryContext =
      memory.length > 0
        ? `Things I remember about the user: ${memory.join(", ")}`
        : "I do not yet know anything about the user.";

    // ---------- OPENAI RESPONSE ----------
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Restore AI, a friendly teacher AI.
Use simple explanations.
${memoryContext}`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    // ---------- RETURN RESPONSE ----------
    return Response.json({ reply });
  } catch (error) {
    console.error("API ERROR:", error);
    return Response.json({
      reply: "Something went wrong.",
    });
  }
}
