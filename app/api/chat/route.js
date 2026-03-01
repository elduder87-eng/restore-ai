// app/api/chat/route.js

import OpenAI from "openai";

import { saveMemory, loadMemory } from "@/lib/memory";
import { saveStudentMemory } from "@/lib/studentMemory";
import {
  analyzeConversation,
  guidanceLevel,
} from "@/lib/conversationState";
import {
  updateMomentum,
  getMomentum,
} from "@/lib/momentum";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    // ✅ Analyze conversation
    const signals = analyzeConversation(message);
    const guidance = guidanceLevel(signals);

    // ✅ Update momentum
    await updateMomentum(message);
    const momentum = await getMomentum();

    // ✅ Load memory
    const memories = await loadMemory();

    const memoryContext = memories
      .map((m) => `User previously said: ${m.message}`)
      .join("\n");

    // ✅ Generate AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore — a hybrid teacher and supportive learning companion.

Core Principles:
- The user leads the conversation.
- Offer guidance invisibly.
- Education leads, personality supports.
- Never abruptly redirect topics.

Guidance Style: ${guidance}

Conversation Momentum:
Learning: ${momentum.learning}
Curiosity: ${momentum.curiosity}
Personal: ${momentum.personal}

Increase depth naturally as momentum grows.

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

    // ✅ Save memories
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
