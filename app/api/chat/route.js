import OpenAI from "openai";
import { Redis } from "@upstash/redis";
import { buildPersonality } from "@/lib/personality";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const MEMORY_KEY = "restore-memory";

    // ---------- Load Memories ----------
    const memories = (await redis.lrange(MEMORY_KEY, 0, -1)) || [];

    // ---------- Store new memory ----------
    if (
      message.toLowerCase().includes("favorite") ||
      message.toLowerCase().includes("i enjoy") ||
      message.toLowerCase().includes("i like")
    ) {
      await redis.rpush(MEMORY_KEY, message);
    }

    // ---------- Build Personality ----------
    const personalityPrompt = buildPersonality(memories);

    // ---------- Create AI Response ----------
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore AI — a thoughtful assistant that remembers the user.

Known Memories:
${memories.join("\n")}

${personalityPrompt}
          `,
        },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    return Response.json({ reply });
  } catch (error) {
    console.error(error);
    return Response.json(
      { reply: "Something went wrong." },
      { status: 200 }
    );
  }
}
