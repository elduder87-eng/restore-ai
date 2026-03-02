import OpenAI from "openai";
import {
  loadMemory,
  saveMemory,
  updateMemoryFromMessage,
} from "@/lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message, history } = await req.json();

    /* -------------------------
       LOAD MEMORY
    ------------------------- */
    let memory = await loadMemory();

    /* -------------------------
       UPDATE MEMORY
    ------------------------- */
    memory = updateMemoryFromMessage(message, memory);
    await saveMemory(memory);

    /* -------------------------
       BUILD MEMORY CONTEXT
    ------------------------- */
    const interests =
      memory.identity?.interests?.length > 0
        ? `Student interests: ${memory.identity.interests.join(", ")}`
        : "Student interests unknown.";

    const systemPrompt = `
You are Restore AI — a supportive adaptive teacher.

${interests}

Use this knowledge naturally when helping the learner.
Be encouraging, curious, and educational.
`;

    /* -------------------------
       CALL OPENAI
    ------------------------- */
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...(history || []),
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    return Response.json({ reply });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
