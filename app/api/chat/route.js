import OpenAI from "openai";
import { saveMemory, getMemories } from "../../lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    // Save important info automatically
    if (
      message.toLowerCase().includes("my name is") ||
      message.toLowerCase().includes("i love") ||
      message.toLowerCase().includes("i like")
    ) {
      await saveMemory(message);
    }

    const memories = await getMemories();

    const memoryContext =
      memories.length > 0
        ? `Here is what you remember about the user:\n${memories.join("\n")}`
        : "You do not yet know anything about the user.";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Restore AI, a helpful teacher that remembers users over time."
        },
        {
          role: "system",
          content: memoryContext
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = completion.choices[0].message.content;

    return Response.json({ reply });
  } catch (error) {
    console.error(error);
    return Response.json({ reply: "Something went wrong." });
  }
}
