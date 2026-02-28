import OpenAI from "openai";
import { getMemory, saveMemory } from "@/app/lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    // -------- SAFE MEMORY LOAD --------
    let memory = {};
    try {
      memory = await getMemory(userId);
    } catch (err) {
      console.error("Memory load failed:", err);
    }

    // Detect name
    const nameMatch = message.match(/my name is (.+)/i);
    if (nameMatch) {
      try {
        await saveMemory(userId, "name", nameMatch[1]);
      } catch (err) {
        console.error("Memory save failed:", err);
      }
    }

    // Build context
    const systemPrompt = `
You are Restore AI — Teacher Mode.
You remember user facts when available.

Known facts:
${JSON.stringify(memory)}
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
    console.error("CHAT ERROR:", error);

    return Response.json({
      reply: "I hit a small internal issue, but I'm still here. Try again.",
    });
  }
}
