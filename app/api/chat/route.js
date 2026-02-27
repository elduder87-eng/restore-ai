import OpenAI from "openai";
import {
  saveMessage,
  extractFacts,
  buildMemoryPrompt,
  getMemory
} from "../../lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message, sessionId } = await req.json();

    // ----- MEMORY -----
    saveMessage(sessionId, "user", message);
    extractFacts(sessionId, message);

    const memoryContext = buildMemoryPrompt(sessionId);
    const memory = getMemory(sessionId);

    // ----- AI CALL -----
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore AI running in Teacher Mode.

Use the known user information when relevant.

${memoryContext}
`
        },
        ...memory.history,
      ],
    });

    const reply = completion.choices[0].message.content;

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
