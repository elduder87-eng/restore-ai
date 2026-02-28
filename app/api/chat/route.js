import OpenAI from "openai";

import { saveMemory, getMemories } from "@/lib/memory";
import { updateAdaptationProfile } from "@/lib/adaptation";
import { detectAdaptationSignals } from "@/lib/curiosity";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message;

    const userId = "default-user";

    /* ---------------- MEMORY ---------------- */

    await saveMemory(userId, message);

    const memories = await getMemories(userId);

    /* ---------------- ADAPTATION ---------------- */

    const signals = detectAdaptationSignals(message);
    await updateAdaptationProfile(userId, signals);

    /* ---------------- PROMPT ---------------- */

    const memoryContext = memories
      .slice(-5)
      .map((m) => `User previously said: ${m}`)
      .join("\n");

    const systemPrompt = `
You are Restore AI — Teacher Mode.

Speak naturally and thoughtfully.
Build connection gradually.
Do NOT rush intimacy.
Adapt slowly based on repeated interaction.

Known memories:
${memoryContext}
`;

    /* ---------------- OPENAI ---------------- */

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply =
      completion.choices[0].message.content;

    return Response.json({ reply });
  } catch (error) {
    console.error(error);

    return Response.json({
      reply: "Something went wrong.",
    });
  }
}
