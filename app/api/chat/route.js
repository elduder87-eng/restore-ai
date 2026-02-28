import OpenAI from "openai";
import { saveMemory, loadMemory } from "../../../lib/memory";

export const runtime = "nodejs"; // important for Redis

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    // ✅ Load stored memory
    const memory = await loadMemory(userId);

    const systemPrompt = `
You are Restore AI — a thoughtful teacher assistant.

Known facts about the user:
${memory || "No stored memories yet."}

Remember important personal facts the user shares.
Answer naturally and helpfully.
`;

    // ✅ Ask OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    // ✅ Save new memory
    await saveMemory(userId, message);

    return Response.json({ reply });
  } catch (error) {
    console.error("CHAT ERROR FULL:", error);

    // show real error in UI while debugging
    return Response.json(
      {
        reply: "ERROR: " + (error?.message || "unknown"),
      },
      { status: 500 }
    );
  }
}
