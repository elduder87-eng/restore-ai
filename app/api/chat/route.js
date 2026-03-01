import OpenAI from "openai";

import { getMemory, addMemory } from "@/lib/memory";
import { getIdentity } from "@/lib/identity";
import { detectSignals, storeSignals } from "@/lib/signals";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const userMessage = body.message;

    const userId = "default-user";

    /* -----------------------------
       Stage 20 — Learning Signals
    ------------------------------ */
    const signals = detectSignals(userMessage);
    await storeSignals(userId, signals);

    /* -----------------------------
       Memory + Identity
    ------------------------------ */
    const memory = await getMemory(userId);
    const identity = await getIdentity(userId);

    /* -----------------------------
       Build system context
    ------------------------------ */
    const systemMessage = `
You are Restore AI.

You are a calm hybrid between teacher and thoughtful learning companion.

User Identity:
${identity || "None yet"}

User Memory:
${memory.join(", ") || "None yet"}

Guidelines:
- Follow the conversation naturally
- Teach when teaching is needed
- Be conversational when appropriate
- Encourage curiosity gently
`;

    /* -----------------------------
       OpenAI Response
    ------------------------------ */
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
    });

    const reply = completion.choices[0].message.content;

    /* -----------------------------
       Save memory automatically
    ------------------------------ */
    if (
      userMessage.toLowerCase().includes("i like") ||
      userMessage.toLowerCase().includes("i enjoy")
    ) {
      await addMemory(userId, userMessage);
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
