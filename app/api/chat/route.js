// app/api/chat/route.js

import OpenAI from "openai";
import { saveMemory, getMemories } from "@/lib/memory";
import { buildPersonality, buildSystemPrompt } from "@/lib/personality";

export const runtime = "edge";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message) {
      return new Response(
        JSON.stringify({ reply: "No message received." }),
        { status: 400 }
      );
    }

    // ✅ Save memory
    await saveMemory(message);

    // ✅ Load memories
    const memories = await getMemories();

    // ✅ Build personality
    const traits = buildPersonality(memories);
    const systemPrompt = buildSystemPrompt(traits);

    // ✅ AI response
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({ reply: "Something went wrong." }),
      { status: 500 }
    );
  }
}
