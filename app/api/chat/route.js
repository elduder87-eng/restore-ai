import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Redis } from "@upstash/redis";

// ---------- OpenAI ----------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ---------- Redis ----------
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// ---------- POST ----------
export async function POST(req) {
  try {
    const { message } = await req.json();

    // =============================
    // LOAD MEMORY SAFELY
    // =============================
    let pastMemories = await redis.get("memory");

    // 🔥 CRASH FIX
    if (!Array.isArray(pastMemories)) {
      pastMemories = [];
    }

    const memoryText =
      pastMemories.length > 0
        ? `Here is what you remember about the user:\n${pastMemories.join(
            "\n"
          )}`
        : "You do not yet have memories about this user.";

    // =============================
    // AI RESPONSE
    // =============================
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore, a friendly AI teacher.

Goals:
- Explain clearly and simply
- Adapt to user interests
- Encourage curiosity
- Speak naturally and warmly

${memoryText}
`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    // =============================
    // SIMPLE MEMORY DETECTION
    // =============================
    const lower = message.toLowerCase();

    if (
      lower.includes("i like") ||
      lower.includes("i enjoy") ||
      lower.includes("i love") ||
      lower.includes("i prefer")
    ) {
      pastMemories.push(message);

      // keep memory small + clean
      pastMemories = pastMemories.slice(-20);

      await redis.set("memory", pastMemories);
    }

    // =============================
    // SUCCESS RESPONSE
    // =============================
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json({
      reply: "Something went wrong.",
    });
  }
}
