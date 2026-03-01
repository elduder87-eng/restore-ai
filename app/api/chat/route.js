// app/api/chat/route.js

import OpenAI from "openai";

import { saveMemory, loadMemory } from "@/lib/memory";
import { saveStudentMemory } from "@/lib/studentMemory";
import {
  analyzeConversation,
  guidanceLevel,
} from "@/lib/conversationState";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    // ✅ Analyze conversation signals
    const signals = analyzeConversation(message);
    const guidance = guidanceLevel(signals);

    // ✅ Load memory
    const memories = await loadMemory();

    const memoryContext = memories
      .map((m) => `User previously said: ${m.message}`)
      .join("\n");

    // ✅ OpenAI Response
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore — a hybrid teacher and supportive learning companion.

Core Rules:
- Follow the user's conversational direction.
- Do NOT abruptly redirect topics.
- Offer gentle optional exploration only.
- Education leads, personality supports.
- Guidance must feel natural and invisible.

Guidance Style: ${guidance}

Past Memory:
${memoryContext}
`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    // ✅ Save memories safely
    await saveMemory(message);
    await saveStudentMemory(message);

    return Response.json({ reply });
  } catch (error) {
    console.error("Chat Route Error:", error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
