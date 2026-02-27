import OpenAI from "openai";

import {
  saveMessage,
  extractFacts,
  buildMemoryPrompt,
  getMemory
} from "@/lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const sessionId = "teacher-mode"; // later becomes real user id

    // learn from message
    extractFacts(sessionId, message);

    // save user message
    saveMessage(sessionId, "user", message);

    const memory = getMemory(sessionId);

    const memoryContext = buildMemoryPrompt(sessionId);

    const messages = [
      {
        role: "system",
        content: `You are Restore AI operating in Teacher Mode.

Use known user information when helpful.

${memoryContext}`
      },
      ...memory.history.map(m => ({
        role: m.role,
        content: m.content
      }))
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    const reply = completion.choices[0].message.content;

    // save AI reply
    saveMessage(sessionId, "assistant", reply);

    return Response.json({ reply });

  } catch (error) {
    console.error(error);
    return Response.json(
      { reply: "Server connection failed." },
      { status: 500 }
    );
  }
}
