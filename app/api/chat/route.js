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
    const body = await req.json();
    const userMessage = body.message;

    // ✅ Load memory (NO JSON.parse)
    let memory = (await redis.get("memory")) || [];

    // Store user info if they reveal preferences
    if (userMessage.toLowerCase().includes("favorite")) {
      memory.push(userMessage);
      await redis.set("memory", memory);
    }

    const memoryText =
      memory.length > 0
        ? `Here is what you remember about the user:\n${memory.join("\n")}`
        : "You have no stored memories yet.";

    // AI Response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Restore AI in Teacher Mode.

You remember facts about the user across conversations.
Use stored memories naturally when answering.

${memoryText}`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    return Response.json({ reply });
  } catch (error) {
    console.error(error);
    return Response.json(
      { reply: "Something went wrong." },
      { status: 500 }
    );
  }
}
