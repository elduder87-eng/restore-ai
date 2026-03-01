import OpenAI from "openai";
import { saveMemory, getMemories } from "@/lib/memory";
import { extractIdentity } from "@/lib/extractIdentity";
import { buildPersonality } from "@/lib/personality";
import { curiosityEngine } from "@/lib/curiosity";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    // SAFE MEMORY LOAD
    let memories = [];
    try {
      memories = await getMemories(userId);
    } catch (e) {
      console.log("Memory load failed:", e);
    }

    // SAFE IDENTITY EXTRACTION
    try {
      await extractIdentity(userId, message);
    } catch (e) {
      console.log("Identity extraction failed:", e);
    }

    // SAFE MEMORY SAVE
    try {
      await saveMemory(userId, message);
    } catch (e) {
      console.log("Memory save failed:", e);
    }

    // BUILD PERSONALITY
    let personality = "";
    try {
      personality = await buildPersonality(userId);
    } catch (e) {
      console.log("Personality build failed:", e);
    }

    // CURIOSITY ENGINE
    let curiosity = "";
    try {
      curiosity = await curiosityEngine(userId, message);
    } catch (e) {
      console.log("Curiosity failed:", e);
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore AI — a hybrid teacher and companion.

${personality}

Known memories:
${memories.join("\n")}

Curiosity suggestions:
${curiosity}

Rules:
- Follow user's direction
- Teach when needed
- Stay natural and calm
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return Response.json({
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
