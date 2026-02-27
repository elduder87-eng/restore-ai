import OpenAI from "openai";
import { kv } from "@vercel/kv";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    // ---- LOAD MEMORY ----
    let memory = await kv.get(`memory:${userId}`);

    if (!memory) {
      memory = {};
    }

    // ---- STORE NAME IF GIVEN ----
    const nameMatch = message.match(/my name is (.+)/i);

    if (nameMatch) {
      memory.name = nameMatch[1];
      await kv.set(`memory:${userId}`, memory);
    }

    // ---- BUILD SYSTEM CONTEXT ----
    let systemContext = "You are Restore AI in Teacher Mode.";

    if (memory.name) {
      systemContext += ` The user's name is ${memory.name}.`;
    }

    // ---- OPENAI CALL ----
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemContext,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ reply: "Server error." }),
      { status: 500 }
    );
  }
}
