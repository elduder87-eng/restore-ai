import OpenAI from "openai";
import { loadMemory, addToMemory } from "@/lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    // =========================
    // LOAD MEMORY
    // =========================
    const memory = await loadMemory(userId);

    // =========================
    // BUILD MESSAGE STACK
    // =========================
    const messages = [
      {
        role: "system",
        content:
          "You are Restore AI, a helpful personal teacher that remembers facts about the user.",
      },

      // ✅ MEMORY INSERTED HERE
      ...memory,

      // newest user message
      {
        role: "user",
        content: message,
      },
    ];

    // =========================
    // CALL OPENAI
    // =========================
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    const reply = completion.choices[0].message.content;

    // =========================
    // SAVE MEMORY
    // =========================
    await addToMemory(userId, {
      role: "user",
      content: message,
    });

    await addToMemory(userId, {
      role: "assistant",
      content: reply,
    });

    return Response.json({ reply });
  } catch (error) {
    console.error(error);
    return Response.json({
      reply: "Something went wrong.",
    });
  }
}
