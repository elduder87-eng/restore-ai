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

    /* =========================
       SAFE MEMORY LOADING
    ========================= */

    let memories = [];
    let learningProfile = "";

    try {
      const rawMemories = await getMemories();

      memories = Array.isArray(rawMemories)
        ? rawMemories.map((m) =>
            typeof m === "string"
              ? m
              : m?.text || JSON.stringify(m)
          )
        : [];
    } catch (err) {
      console.log("Memory load skipped:", err.message);
    }

    try {
      learningProfile = await getLearningProfile();
    } catch (err) {
      console.log("Learning profile skipped");
    }

    /* =========================
       SAFE IDENTITY SAVE
    ========================= */

    try {
      const identity = extractIdentity(message);
      if (identity) {
        await addMemory(identity);
      }
    } catch (err) {
      console.log("Identity save skipped");
    }

    /* =========================
       SYSTEM PROMPT
    ========================= */

    const systemPrompt = `
You are Restore AI — a hybrid teacher and thoughtful companion.

Learning comes first.
Connection develops through learning.

STYLE:
- Clear explanations
- Calm pacing
- Friendly but intelligent
- Never overly long unless asked

Known memories:
${memories.join("\n") || "none yet"}

Learning profile:
${learningProfile || "forming"}
`;

    /* =========================
       OPENAI CALL
    ========================= */

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

    return Response.json({ reply });
  } catch (error) {
    console.error("CHAT FAILURE:", error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
