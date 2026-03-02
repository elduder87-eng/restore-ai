import OpenAI from "openai";
import {
  getMemory,
  saveMemory,
  updateMemoryFromMessage,
  buildMemorySummary,
} from "@/lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    // ----------------------------
    // Load Memory
    // ----------------------------
    let memory = getMemory();

    // Update memory from user input
    memory = updateMemoryFromMessage(message, memory);

    // Save updated memory
    saveMemory(memory);

    // Build memory context
    const memorySummary = buildMemorySummary(memory);

    // ----------------------------
    // AI Response
    // ----------------------------
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore AI, a calm adaptive teacher.

User Memory:
${memorySummary}

Use this memory naturally when answering.
Do NOT explicitly mention "memory".
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
    console.error(error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
