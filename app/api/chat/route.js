import OpenAI from "openai";
import { saveMemory, getMemories } from "@/lib/memory";
import { saveLearningSignal, getLearningProfile } from "@/lib/learningMemory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const userMessage = body.message;

    if (!userMessage) {
      return Response.json({ reply: "No message received." });
    }

    /* =============================
       SAVE LEARNING SIGNAL
    ============================= */

    await saveLearningSignal(userMessage);

    /* =============================
       LOAD MEMORY
    ============================= */

    const memories = await getMemories();
    const learningProfile = await getLearningProfile();

    /* =============================
       SYSTEM PROMPT
    ============================= */

    const systemPrompt = `
You are Restore AI — a hybrid teacher and thoughtful companion.

Personality:
- Warm, intelligent, calm
- Encouraging but not overly casual
- Educational first, connection second
- Never robotic

Learning style detected:
${learningProfile.join(", ") || "unknown"}

Known user memories:
${memories.join("\n") || "none yet"}

Adapt explanations naturally to match the user's learning style.
Keep responses human and engaging.
`;

    /* =============================
       OPENAI CALL
    ============================= */

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "I'm thinking… try again.";

    /* =============================
       SAVE MEMORY (simple capture)
    ============================= */

    if (userMessage.length < 200) {
      await saveMemory(userMessage);
    }

    return Response.json({ reply });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
