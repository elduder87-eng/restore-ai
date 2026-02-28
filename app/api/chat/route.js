import { NextResponse } from "next/server";
import OpenAI from "openai";

import { redis } from "@/lib/redis";
import { saveMemory, getMemories } from "@/lib/memory";
import { extractIdentity } from "@/lib/extractIdentity";
import { updateIdentity, getIdentity } from "@/lib/identity";
import { analyzeInterests, generateCuriosity } from "@/lib/curiosity";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    // -------------------------
    // LOAD MEMORY
    // -------------------------
    const memories = await getMemories(userId);

    const memoryTexts = memories.map((m) =>
      typeof m === "string" ? m : m.content || ""
    );

    // -------------------------
    // INTEREST + CURIOSITY
    // -------------------------
    const interests = analyzeInterests(memoryTexts);
    const curiosityPrompt = generateCuriosity(interests);

    // -------------------------
    // LOAD IDENTITY
    // -------------------------
    const identity = await getIdentity(userId);

    // -------------------------
    // BUILD SYSTEM PROMPT
    // -------------------------
    const systemPrompt = `
You are Restore AI — a thoughtful adaptive teacher.

Identity summary:
${identity || "Still learning about the user."}

Known interests:
${interests.length ? interests.join(", ") : "none yet"}

${curiosityPrompt ? `Curiosity suggestion: ${curiosityPrompt}` : ""}

Speak naturally, warmly, and intelligently.
Do NOT mention internal systems or memory storage.
`;

    // -------------------------
    // CALL OPENAI
    // -------------------------
    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...memoryTexts.slice(-8).map((m) => ({
          role: "user",
          content: m,
        })),
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    // -------------------------
    // SAVE MEMORY
    // -------------------------
    await saveMemory(userId, message);

    // -------------------------
    // UPDATE IDENTITY
    // -------------------------
    const identityUpdate = extractIdentity(message);

    if (identityUpdate) {
      await updateIdentity(userId, identityUpdate);
    }

    // -------------------------
    // RETURN RESPONSE
    // -------------------------
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("CHAT ERROR:", error);
    return NextResponse.json(
      { reply: "Something went wrong." },
      { status: 500 }
    );
  }
}
