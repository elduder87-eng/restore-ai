import OpenAI from "openai";
import { kv } from "@vercel/kv";
import { extractMemory } from "@/lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    // Load memory
    let memory = (await kv.get(userId)) || {};

    // Extract new memory automatically
    const newMemory = extractMemory(message);

    // Merge memories
    memory = { ...memory, ...newMemory };

    // Save updated memory
    await kv.set(userId, memory);

    // Build memory context
    const memoryContext = `
User Memory:
Name: ${memory.name || "unknown"}
Preference: ${memory.preference || "unknown"}
Goal: ${memory.goal || "unknown"}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Restore AI.
Use stored memory naturally in conversation.
${memoryContext}`,
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
      { reply: "Server connection failed." },
      { status: 500 }
    );
  }
}
