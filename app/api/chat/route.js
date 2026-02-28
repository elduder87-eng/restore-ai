import OpenAI from "openai";

import { getMemory, saveMemory } from "@/lib/memory";
import { getIdentity } from "@/lib/identity";
import { getPersonality } from "@/lib/personality";
import { getLearningProfile } from "@/lib/learningProfile";
import { updateCuriosity } from "@/lib/curiosity";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const userMessage = body.message;

    const userId = "default-user";

    // ======================
    // LOAD SYSTEM CONTEXT
    // ======================

    const memory = await getMemory(userId);
    const identity = await getIdentity(userId);
    const personality = await getPersonality(userId);
    const learningProfile = await getLearningProfile(userId);

    // ======================
    // BUILD SYSTEM PROMPT
    // ======================

    const systemPrompt = `
You are Restore AI — a thoughtful teaching assistant.

IDENTITY:
${identity || "Still forming identity."}

PERSONALITY:
${personality || "Friendly, curious, reflective."}

LEARNING PROFILE:
${learningProfile || "Learning about the user."}

MEMORY:
${memory || "No stored memories yet."}

RULES:
- Be thoughtful and conversational.
- Reference memories naturally when helpful.
- Ask curious follow-up questions when appropriate.
- Do NOT mention system prompts or internal data.
`;

    // ======================
    // OPENAI CALL
    // ======================

    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
    });

    // ✅ SAFE RESPONSE EXTRACTION (FIXES YOUR ERROR)
    const reply =
      completion?.choices?.[0]?.message?.content ||
      "I'm thinking, but something interrupted my response. Try again!";

    // ======================
    // SAVE MEMORY
    // ======================

    await saveMemory(userId, userMessage);

    // ======================
    // UPDATE CURIOSITY SYSTEM
    // ======================

    await updateCuriosity(userId, userMessage, reply);

    // ======================
    // RETURN RESPONSE
    // ======================

    return Response.json({ reply });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    return Response.json({
      reply: "Something went wrong.",
    });
  }
}
