import OpenAI from "openai";
import { saveMemory, getMemories } from "../../lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    // Get stored memories
    const memories = await getMemories();

    // Build memory context
    const memoryContext =
      memories.length > 0
        ? `Known information about the user:\n${memories.join("\n")}`
        : "No stored user information yet.";

    // Ask AI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Restore AI in Teacher Mode.
You remember useful facts about the user when provided.
Use stored memories when answering questions about the user.

${memoryContext}`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    // Simple memory rule (Stage 9)
    if (message.toLowerCase().includes("my name is")) {
      await saveMemory(message);
    }

    return Response.json({ reply });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
