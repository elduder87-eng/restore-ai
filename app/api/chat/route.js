import OpenAI from "openai";
import { loadMemory, saveMemory, shouldRemember } from "@/lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    /*
    LOAD MEMORY
    */
    const memories = await loadMemory();

    const memoryContext =
      memories.length > 0
        ? `Known facts about the user:\n${memories.join("\n")}`
        : "No stored memories yet.";

    /*
    AI RESPONSE
    */
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Restore AI, a helpful teacher assistant with memory."
        },
        {
          role: "system",
          content: memoryContext
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    const reply = completion.choices[0].message.content;

    /*
    MEMORY JUDGE
    */
    const remember = await shouldRemember(openai, message);

    if (remember) {
      await saveMemory(message);
    }

    return Response.json({ reply });

  } catch (error) {
    console.error(error);
    return Response.json({
      reply: "Something went wrong."
    });
  }
}
