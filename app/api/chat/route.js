import { NextResponse } from "next/server";
import OpenAI from "openai";

import {
  loadMemory,
  saveMemory,
  updateMemoryFromMessage
} from "@/lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message;

    /* -------------------------
       LOAD MEMORY
    ------------------------- */
    let memory = loadMemory();

    /* -------------------------
       UPDATE MEMORY
    ------------------------- */
    memory = updateMemoryFromMessage(message, memory);
    saveMemory(memory);

    /* -------------------------
       BUILD MEMORY CONTEXT
    ------------------------- */
    const interests =
      memory.identity?.interests?.length > 0
        ? `The learner is interested in: ${memory.identity.interests.join(
            ", "
          )}.`
        : "";

    const systemPrompt = `
You are Restore AI, an adaptive teacher.

${interests}

Speak naturally, warmly, and like a supportive educator.
Keep responses concise but thoughtful.
`;

    /* -------------------------
       AI RESPONSE
    ------------------------- */
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    const reply = completion.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    return NextResponse.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment."
    });
  }
}
