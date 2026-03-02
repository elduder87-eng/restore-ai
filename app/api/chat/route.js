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

    // ✅ Get stored memories (LIST type)
    const pastMemories = await redis.lrange(memoryKey, 0, -1);

    const memoryContext =
      pastMemories.length > 0
        ? `User facts:\n${pastMemories.join("\n")}`
        : "";

    // ✅ OpenAI call
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You are Restore, an adaptive learning AI that remembers user facts.",
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

    // ✅ SAFE text extraction (this fixes crash)
    let reply = "";

    if (response.output_text) {
      reply = response.output_text;
    } else if (response.output?.[0]?.content?.[0]?.text) {
      reply = response.output[0].content[0].text;
    } else {
      reply = "I'm thinking, but couldn't form a response.";
    }

    // ✅ Store new memory
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
