import OpenAI from "openai";
import { getMemory, saveMemory } from "@/lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    // 🧠 Load memory from Upstash
    const memory = await getMemory(userId);

    // System behavior
    const systemPrompt = `
You are Restore AI — a calm, thoughtful teacher AI.

You remember important facts about the user when provided.
Current known memory about the user:
${memory || "No stored memory yet."}

Be natural and conversational.
If the user shares personal facts (name, interests, preferences),
you may remember them for future conversations.
`;

    // 🤖 Ask OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    // 🧠 Simple memory learning
    let updatedMemory = memory || "";

    // remember name
    if (/my name is/i.test(message)) {
      updatedMemory += ` ${message}`;
    }

    // remember interests
    if (/i love|i like|i enjoy/i.test(message)) {
      updatedMemory += ` ${message}`;
    }

    // save memory
    await saveMemory(userId, updatedMemory);

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return new Response(
      JSON.stringify({ reply: "Something went wrong." }),
      { status: 200 }
    );
  }
}
