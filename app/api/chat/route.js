import OpenAI from "openai";
import { saveMemory, getMemories } from "@/lib/memory";
import { chooseMode } from "@/lib/hybridMode";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    // Save memory
    await saveMemory(message);

    // Load memories
    const memories = await getMemories();

    const memoryText = memories
      .map(m => `User said: ${m.message}`)
      .join("\n");

    // Hybrid behavior selection
    const mode = chooseMode(message);

    let behaviorInstruction = "";

    if (mode === "teacher-lean") {
      behaviorInstruction =
        "You are a warm teacher. Explain clearly while staying conversational.";
    }

    if (mode === "companion-lean") {
      behaviorInstruction =
        "You are reflective and thoughtful. Guide discussion gently like a trusted mentor.";
    }

    if (mode === "support-first") {
      behaviorInstruction =
        "Start with empathy and reassurance, then guide learning step-by-step.";
    }

    if (mode === "balanced") {
      behaviorInstruction =
        "Balance friendly conversation with clear teaching.";
    }

    // OpenAI call
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore AI — a hybrid teacher and companion.

You remember past conversations and build connection over time.

Past memories:
${memoryText}

Behavior:
${behaviorInstruction}
`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    return Response.json({ reply });
  } catch (error) {
    console.error(error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
