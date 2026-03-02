import OpenAI from "openai";
import { redis } from "@/lib/redis";
import { shouldRemember } from "@/lib/memoryJudge";
import { updateLearningProfile } from "@/lib/learningProfile";
import { scoreMemory } from "@/lib/memoryScore";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    // ✅ Multi-user support
    const userId =
      req.headers.get("x-user-id") || "default-user";

    const memoryKey = `memory:${userId}`;

    // ✅ SAFE memory read (fixes WRONGTYPE error)
    let memories = [];
    try {
      memories = await redis.lrange(memoryKey, 0, -1);
    } catch {
      memories = [];
    }

    const memoryContext = memories.join("\n");

    // ===== AI RESPONSE =====
    const completion =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are Restore AI.

Known user memories:
${memoryContext}

Use memories naturally when helpful.
`
          },
          {
            role: "user",
            content: message
          }
        ]
      });

    const reply =
      completion.choices[0].message.content;

    // ===== INTELLIGENT MEMORY =====
    const remember = await shouldRemember(
      openai,
      message
    );

    if (remember) {
      await redis.rpush(memoryKey, message);

      // learning profile example topic
      await updateLearningProfile(
        redis,
        userId,
        "general"
      );

      await scoreMemory(
        redis,
        userId,
        message
      );
    }

    return Response.json({ reply });
  } catch (err) {
    console.error(err);
    return Response.json({
      reply: "Something went wrong."
    });
  }
}
