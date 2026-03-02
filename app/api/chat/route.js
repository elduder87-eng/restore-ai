import OpenAI from "openai";
import {
  getMemory,
  saveMemory,
  updateMemoryFromMessage,
  buildMemorySummary
} from "../../../lib/memory";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    // =====================
    // LOAD MEMORY
    // =====================
    let memory = getMemory();

    // =====================
    // UPDATE MEMORY
    // =====================
    memory = updateMemoryFromMessage(message, memory);
    saveMemory(memory);

    const memorySummary = buildMemorySummary(memory);

    // =====================
    // AI RESPONSE
    // =====================
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore AI — a supportive adaptive teacher.

Learner Profile:
${memorySummary}

Respond naturally and help learning progress.
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    return Response.json({ reply });

  } catch (error) {
    console.error("CHAT ERROR:", error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
