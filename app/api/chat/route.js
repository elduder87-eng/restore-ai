// app/api/chat/route.js

import OpenAI from "openai";
import { updateMemory, buildMemoryPrompt } from "@/app/lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    // Single demo session (later we upgrade this)
    const sessionId = "default-user";

    // ✅ Update memory FIRST
    updateMemory(sessionId, message);

    // ✅ Build memory context
    const memoryContext = buildMemoryPrompt(sessionId);

    // ✅ Inject memory into system prompt
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore AI operating in Teacher Mode.

Use the known information about the user when answering questions about them.

${memoryContext}
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return Response.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
