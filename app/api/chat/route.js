import OpenAI from "openai";
import { NextResponse } from "next/server";

import {
  getMemory,
  saveMemory,
  updateMemoryFromMessage,
  buildMemorySummary,
} from "@/lib/memory/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    // -----------------------------
    // Load memory
    // -----------------------------
    let memory = await getMemory();

    // Update memory from user input
    memory = updateMemoryFromMessage(memory, message);

    // Save updated memory
    await saveMemory(memory);

    const memorySummary = buildMemorySummary(memory);

    // -----------------------------
    // Special commands
    // -----------------------------
    const lower = message.toLowerCase();

    if (lower.includes("what do you remember")) {
      return NextResponse.json({
        reply:
          memory.interests.length > 0
            ? `I remember that you're interested in ${memory.interests.join(
                ", "
              )}.`
            : "I'm still learning about you!",
      });
    }

    if (lower.includes("how am i doing")) {
      const interests =
        memory.interests.length > 0
          ? memory.interests
              .map((i) => `${i}: growing interest`)
              .join(", ")
          : "starting journey";

      return NextResponse.json({
        reply: `Here’s your learning progress — ${interests}.`,
      });
    }

    // -----------------------------
    // AI Response
    // -----------------------------
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore AI — a calm, encouraging learning guide.

Student Memory:
${memorySummary}

Rules:
- Teach clearly and simply.
- Encourage curiosity.
- Build on remembered interests.
- Keep answers educational and supportive.
`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    return
