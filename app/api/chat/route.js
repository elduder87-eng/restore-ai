import OpenAI from "openai";
import { saveMemory, loadMemory } from "../../lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    // -----------------------
    // LOAD MEMORY
    // -----------------------
    const memory = await loadMemory(userId);

    const memoryContext = `
Name: ${memory.name || "Unknown"}
Interest: ${memory.interest || "Unknown"}
`;

    // -----------------------
    // MEMORY EXTRACTION
    // -----------------------
    const lower = message.toLowerCase();

    let updatedMemory = { ...memory };

    // name detection
    if (lower.includes("my name is")) {
      const name = message.split("my name is")[1]?.trim();
      if (name) updatedMemory.name = name;
    }

    // interest detection
    if (lower.includes("i love") || lower.includes("i like")) {
      const interest =
        message.split("i love")[1]?.trim() ||
        message.split("i like")[1]?.trim();

      if (interest) updatedMemory.interest = interest;
    }

    await saveMemory(userId, updatedMemory);

    // -----------------------
    // AI RESPONSE
    // -----------------------
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore AI.

Known user information:
${memoryContext}

Rules:
- Use stored memory when answering questions about the user.
- If memory exists, confidently reference it.
- If memory is missing, say you don't know yet.
- Be natural and conversational.
`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return Response.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { reply: "Something went wrong." },
      { status: 500 }
    );
  }
}
