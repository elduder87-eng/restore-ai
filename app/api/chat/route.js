import OpenAI from "openai";
import { saveMemory, getMemories } from "@/lib/memory";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    // 1️⃣ Load memory
    const memories = await getMemories(userId);

    const memoryContext =
      memories.length > 0
        ? `Known facts about user:\n${memories.join("\n")}`
        : "";

    // 2️⃣ Ask AI
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Restore AI, a helpful adaptive teacher who remembers students.",
        },
        {
          role: "system",
          content: memoryContext,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    // 3️⃣ Save new memory
    await saveMemory(userId, message);

    return Response.json({ reply });
  } catch (error) {
    console.error("CHAT ERROR:", error);
    return Response.json(
      { reply: "Something went wrong." },
      { status: 500 }
    );
  }
}
