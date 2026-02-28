// app/api/chat/route.js

import OpenAI from "openai";

import { getMemories, addMemory } from "@/lib/memory";
import { getLearningProfile } from "@/lib/learningProfile";
import { extractIdentity } from "@/lib/extractIdentity";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return Response.json({ reply: "No message received." });
    }

    /* ===============================
       LOAD MEMORY + PROFILE
    =============================== */

    const rawMemories = await getMemories();
    const learningProfile = await getLearningProfile();

    // 🔧 MEMORY SAFETY NORMALIZATION (fixes crashes)
    const memories = Array.isArray(rawMemories)
      ? rawMemories.map((m) =>
          typeof m === "string"
            ? m
            : m?.text || JSON.stringify(m)
        )
      : [];

    /* ===============================
       IDENTITY EXTRACTION
    =============================== */

    const identity = extractIdentity(message);

    if (identity) {
      await addMemory(identity);
    }

    /* ===============================
       SYSTEM PROMPT
    =============================== */

    const systemPrompt = `
You are Restore AI — a hybrid teacher and thoughtful conversational partner.

CORE GOAL:
Learning comes FIRST.
Personal connection develops naturally THROUGH learning.

STYLE:
- Clear teacher explanations
- Warm but not overly casual
- Curious and engaging
- Never robotic
- Avoid long lectures unless asked

PACE:
- Do not rush bonding.
- Do not feel like school.
- Teach simply, then invite reflection.

KNOWN USER MEMORIES:
${memories.length ? memories.join("\n") : "none yet"}

LEARNING PROFILE:
${learningProfile || "still forming"}

RULES:
- Explain concepts simply first.
- Then optionally ask ONE reflective question.
- Keep responses natural and human.
`;

    /* ===============================
       OPENAI CALL
    =============================== */

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "I'm not sure how to respond yet.";

    /* ===============================
       RETURN RESPONSE
    =============================== */

    return Response.json({ reply });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
