import OpenAI from "openai";
import {
  getMemory,
  saveMemory,
  updateMemoryFromMessage,
  buildMemorySummary,
} from "@/lib/memory";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    // Load memory
    let memory = getMemory();

    // Update memory
    memory = updateMemoryFromMessage(message, memory);

    // Save memory
    saveMemory(memory);

    const memorySummary = buildMemorySummary(memory);

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore AI — an adaptive learning companion.

Rules:
- Be encouraging and educational.
- Adapt to learner interests.
- Keep responses clear and conversational.

Learner Memory:
${memorySummary}
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
