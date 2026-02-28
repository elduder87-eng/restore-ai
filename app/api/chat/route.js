import OpenAI from "openai";
import { loadMemory, saveMemory, shouldRemember } from "@/lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    /* ======================
       LOAD MEMORY
    ====================== */
    const memories = await loadMemory(userId);

    const memoryContext =
      memories.length > 0
        ? `Known facts about user:\n${memories.join("\n")}`
        : "No stored memories yet.";

    /* ======================
       AI RESPONSE
    ====================== */
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore AI.

Use stored memories when relevant.

${memoryContext}
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    /* ======================
       MEMORY JUDGE
    ====================== */
    const remember = await shouldRemember(openai, message);

    if (remember) {
      console.log("Saving memory:", message);
      await saveMemory(userId, message);
    }

    return Response.json({ reply });
  } catch (error) {
    console.error(error);
    return Response.json({
      reply: "Something went wrong.",
    });
  }
}
