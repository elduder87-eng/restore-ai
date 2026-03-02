import OpenAI from "openai";
import { saveMemory, getMemoryContext } from "@/lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const lastUserMessage =
      messages[messages.length - 1]?.content || "";

    // Save memory
    await saveMemory(lastUserMessage);

    // Load memory
    const memoryContext = await getMemoryContext();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore AI — an adaptive learning teacher.

Adjust explanations using the user's interests.
Connect new topics to what they already enjoy learning.
Be encouraging, educational, and conversational.

${memoryContext}
`
        },
        ...messages
      ]
    });

    return Response.json({
      message: completion.choices[0].message.content
    });

  } catch (error) {
    console.error(error);

    return Response.json({
      message:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment."
    });
  }
}
