import OpenAI from "openai";
import { Redis } from "@upstash/redis";

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

    const userId = "default-user";
    const memoryKey = `memory:${userId}`;

    // ✅ Read memory list correctly
    const pastMemories = await redis.lrange(memoryKey, 0, -1);

    const memoryContext =
      pastMemories.length > 0
        ? `User facts:\n${pastMemories.join("\n")}`
        : "";

    // ✅ NEW OpenAI API (this fixes crash)
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You are Restore, a helpful adaptive learning AI. Remember user facts when provided.",
        },
        {
          role: "system",
          content: memoryContext,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = response.output_text;

    // ✅ Save message into memory list
    await redis.rpush(memoryKey, message);

    return Response.json({ reply });
  } catch (error) {
    console.error("API ERROR:", error);
    return Response.json(
      { reply: "Something went wrong." },
      { status: 500 }
    );
  }
}
