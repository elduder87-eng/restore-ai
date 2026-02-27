// app/api/chat/route.js

import OpenAI from "openai";
import {
  updateMemory,
  buildMemoryPrompt
} from "../../lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message, sessionId } = await req.json();

    // ==========================
    // 1. UPDATE MEMORY
    // ==========================
    updateMemory(sessionId, message);

    // ==========================
    // 2. BUILD MEMORY CONTEXT
    // ==========================
    const memoryContext = buildMemoryPrompt(sessionId);

    // ==========================
    // 3. CREATE AI RESPONSE
    // ==========================
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore AI operating in Teacher Mode.

Use known information about the user when relevant.

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
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
