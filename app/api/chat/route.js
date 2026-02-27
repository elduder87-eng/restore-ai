import OpenAI from "openai";
import { getMemory, saveMessage } from "@/lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message, sessionId } = await req.json();

    // Load persistent memory
    const history = getMemory(sessionId);

    // Save user message
    saveMessage(sessionId, "user", message);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Restore AI in Teacher Mode. Remember facts users tell you about themselves.",
        },
        ...history,
      ],
    });

    const reply = completion.choices[0].message.content;

    // Save AI reply
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
