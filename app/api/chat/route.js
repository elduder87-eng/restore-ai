import OpenAI from "openai";

import { saveMemory, loadMemory } from "@/lib/memory";
import { buildIdentity, loadIdentity } from "@/lib/identity";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();
    const userId = "default";

    // 1️⃣ Load stored memory
    const memory = await loadMemory(userId);

    // 2️⃣ Rebuild identity from memories
    await buildIdentity(userId);

    // 3️⃣ Load identity profile
    const identity = await loadIdentity(userId);

    // 4️⃣ Ask AI with identity awareness
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore AI — a learning assistant.

User Identity:
${identity}

Known Memories:
${memory.join("\n")}

Use this information naturally in conversation.
Do NOT list memories unless asked.
Be conversational and human.
`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "I couldn't generate a response.";

    // 5️⃣ Store new memory automatically
    if (
      message.toLowerCase().includes("my") ||
      message.toLowerCase().includes("i like") ||
      message.toLowerCase().includes("i am")
    ) {
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
