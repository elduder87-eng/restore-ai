import OpenAI from "openai";
import { NextResponse } from "next/server";

import { loadMemory, saveMemory } from "@/lib/memory";
import { updateMemoryFromMessage } from "@/lib/memory";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message || "";

    /* -------------------------
       LOAD MEMORY
    ------------------------- */

    let memory = await loadMemory();

    /* -------------------------
       UPDATE MEMORY FROM MESSAGE
    ------------------------- */

    memory = updateMemoryFromMessage(message, memory);

    await saveMemory(memory);

    /* -------------------------
       BUILD MEMORY CONTEXT
    ------------------------- */

    let memoryContext = "";

    if (memory.identity?.interests?.length > 0) {
      memoryContext += `
Known learner interests:
${memory.identity.interests.map(i => "- " + i).join("\n")}
`;
    }

    /* -------------------------
       SYSTEM PROMPT
    ------------------------- */

    const systemPrompt = `
You are Restore AI, an adaptive AI teacher.

IMPORTANT RULES:
- You DO have long-term memory about this learner.
- Never say conversations reset.
- Never say you lack memory.
- Use remembered interests naturally in conversation.

${memoryContext}

Be warm, encouraging, and educational.
Keep responses concise but thoughtful.
`;

    /* -------------------------
       AI RESPONSE
    ------------------------- */

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    return NextResponse.json({ reply });

  } catch (error) {
    console.error(error);

    return NextResponse.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
