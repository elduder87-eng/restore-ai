import OpenAI from "openai";
import { Redis } from "@upstash/redis";

export const runtime = "edge";

// OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Upstash Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user"; // later we upgrade to real users

    // ✅ GET MEMORY
    let memories = await redis.get(`memory:${userId}`);

    if (!memories) memories = [];

    // ✅ SAVE NEW INTERESTS AUTOMATICALLY
    const lower = message.toLowerCase();

    if (
      lower.includes("i enjoy") ||
      lower.includes("i like") ||
      lower.includes("i love")
    ) {
      memories.push(message);

      // store updated memory
      await redis.set(`memory:${userId}`, memories);
    }

    // ✅ BUILD MEMORY CONTEXT
    const memoryContext =
      memories.length > 0
        ? `User facts: ${memories.join(", ")}`
        : "No stored memories yet.";

    // ✅ AI RESPONSE
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Restore AI, a personalized teacher.
Use stored memories to tailor responses.

${memoryContext}`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    return new Response(
      JSON.stringify({ reply }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({ reply: "Something went wrong." }),
      { status: 500 }
    );
  }
}
