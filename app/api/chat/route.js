import OpenAI from "openai";
import { NextResponse } from "next/server";

import { saveMemory, getMemories } from "@/lib/memory";
import { getIdentity } from "@/lib/identity";
import { updateLearningProfile } from "@/lib/learningProfile";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message) {
      return NextResponse.json({ reply: "No message received." });
    }

    const userId = "default-user";

    // -----------------------------
    // LOAD MEMORY + IDENTITY
    // -----------------------------

    const memories = await getMemories(userId);
    const identity = await getIdentity(userId);

    const memoryText =
      memories.length > 0
        ? memories.map((m) => `- ${m}`).join("\n")
        : "No stored memories yet.";

    const identityText =
      identity && Object.keys(identity).length > 0
        ? JSON.stringify(identity)
        : "Identity still forming.";

    // -----------------------------
    // SYSTEM PROMPT (Restore Brain)
    // -----------------------------

    const systemPrompt = `
You are Restore AI — a thoughtful conversational partner that forms a real connection over time.

CORE BEHAVIOR:
- Build understanding gradually.
- Do not rush emotional depth.
- Do not act like a textbook or lecturer.
- Prefer conversational insight over long explanations.
- Only go very deep if the user clearly invites it.
- Ask reflective follow-up questions naturally.

MEMORY ABOUT USER:
${memoryText}

IDENTITY MODEL:
${identityText}

STYLE:
- Warm
- Curious
- Thoughtful
- Human-paced conversation
`;

    // -----------------------------
    // OPENAI CALL
    // -----------------------------

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;

    // -----------------------------
    // SAVE MEMORY (simple extractor)
    // -----------------------------

    if (
      message.toLowerCase().includes("i like") ||
      message.toLowerCase().includes("i enjoy") ||
      message.toLowerCase().includes("i love")
    ) {
      await saveMemory(userId, message);
    }

    // -----------------------------
    // UPDATE LEARNING PROFILE
    // -----------------------------

    await updateLearningProfile(userId, message);

    // -----------------------------
    // RESPONSE
    // -----------------------------

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("CHAT ERROR:", error);
    return NextResponse.json({
      reply: "Something went wrong.",
    });
  }
}
