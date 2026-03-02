import OpenAI from "openai";
import { getMemory, updateMemory } from "@/lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message, userId } = await req.json();

    // Update memory first
    await updateMemory(userId, message);

    // Load memory
    const memory = await getMemory(userId);

    const systemPrompt = `
You are Restore AI, a supportive teaching assistant.

User interests: ${memory.interests.join(", ") || "unknown"}.
Learning style: ${memory.learningStyle}.

If learning style is "simple", explain concepts clearly and simply.
Reference remembered interests naturally when relevant.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    return Response.json({ reply });

  } catch (error) {
    console.error(error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
