import OpenAI from "openai";

import { getMemory, saveMemory } from "@/lib/memory";
import {
  getLearningProfile,
  updateLearningProfile,
} from "@/lib/learningProfile";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    // -----------------------------
    // 1. Read user message
    // -----------------------------
    const { message } = await req.json();

    if (!message) {
      return Response.json({ reply: "No message provided." });
    }

    // -----------------------------
    // 2. Update learning profile
    // -----------------------------
    await updateLearningProfile(message);

    // -----------------------------
    // 3. Load memory + learning
    // -----------------------------
    const memory = await getMemory();
    const learningProfile = await getLearningProfile();

    // -----------------------------
    // 4. Build messages
    // -----------------------------
    const messages = [
      {
        role: "system",
        content: `
You are Restore AI — an adaptive teacher.

User memory:
${JSON.stringify(memory)}

Learning profile:
${JSON.stringify(learningProfile)}

Behavior rules:
- prefersSimple → explain clearly and simply
- prefersDepth → include deeper reasoning
- likesExamples → include examples naturally
`,
      },
      ...memory.history,
      {
        role: "user",
        content: message,
      },
    ];

    // -----------------------------
    // 5. OpenAI response
    // -----------------------------
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "I couldn't generate a response.";

    // -----------------------------
    // 6. Save conversation memory
    // -----------------------------
    await saveMemory(message, reply);

    // -----------------------------
    // 7. Return response
    // -----------------------------
    return Response.json({ reply });
  } catch (error) {
    console.error("Chat route error:", error);

    return Response.json({
      reply: "Something went wrong.",
    });
  }
}
