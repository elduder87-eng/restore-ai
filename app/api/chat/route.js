import OpenAI from "openai";

import { saveMemory, loadMemory } from "@/lib/memory";
import { saveStudentMemory } from "@/lib/studentMemory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    // ✅ Load past memory
    const memories = await loadMemory();

    const memoryContext = memories
      .map((m) => `User previously said: ${m.message}`)
      .join("\n");

    // ✅ AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore AI — a hybrid teacher + supportive companion.

Use past memories naturally when relevant.

Past memory:
${memoryContext}
`,
        },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    // ✅ SAVE MEMORY (THIS WAS MISSING)
    await saveMemory(message);
    await saveStudentMemory(message);

    return Response.json({ reply });
  } catch (error) {
    console.error(error);
    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
