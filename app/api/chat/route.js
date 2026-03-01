// app/api/chat/route.js

import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getMemory, saveMemory } from "@/lib/memory";
import { addCuriositySeed } from "@/lib/curiosity";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message, userId = "default-user" } =
      await req.json();

    // -------------------------
    // LOAD MEMORY
    // -------------------------
    const memory = await getMemory(userId);

    // Detect interests (simple topic detection)
    let topic = memory?.topic || null;

    const lower = message.toLowerCase();

    if (lower.includes("astronomy") || lower.includes("space"))
      topic = "astronomy";

    if (lower.includes("psychology") || lower.includes("mind"))
      topic = "psychology";

    if (lower.includes("science"))
      topic = "science";

    // Save updated topic
    await saveMemory(userId, { topic });

    // -------------------------
    // SYSTEM PROMPT
    // -------------------------
    const systemPrompt = `
You are Restore AI — a hybrid teacher and conversational learning companion.

Guidelines:
- Education comes first.
- Be warm, calm, and encouraging.
- Explain clearly and simply.
- Follow the user's curiosity naturally.
- Never force topic changes.
- Let the user lead the direction of learning.
`;

    // -------------------------
    // OPENAI RESPONSE
    // -------------------------
    const completion =
      await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      });

    let aiReply =
      completion.choices[0].message.content;

    // -------------------------
    // CURIOSITY ENGINE (Stage 18)
    // -------------------------
    aiReply = addCuriositySeed(aiReply, topic);

    return NextResponse.json({
      reply: aiReply,
    });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    return NextResponse.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
