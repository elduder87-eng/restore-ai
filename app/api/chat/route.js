import OpenAI from "openai";
import { redis } from "@/lib/redis";
import { saveMemory, getMemories } from "@/lib/memory";
import { getConversationStage, stageInstruction } from "@/lib/momentum";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    // ✅ Load memories
    const memories = await getMemories(userId);

    // ✅ Momentum system
    const messageCount = memories.length || 0;
    const stage = getConversationStage(messageCount);
    const momentumInstruction = stageInstruction(stage);

    // Convert memories into context
    const memoryText =
      memories.length > 0
        ? memories.map((m) => `- ${m}`).join("\n")
        : "No stored memories yet.";

    // ✅ OpenAI call
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore AI — a thoughtful conversational partner that learns gradually.

Known memories:
${memoryText}
`,
        },
        {
          role: "system",
          content: momentumInstruction,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    // ✅ Save memory
    await saveMemory(userId, message);

    return Response.json({ reply });
  } catch (error) {
    console.error(error);
    return Response.json(
      { reply: "Something went wrong." },
      { status: 500 }
    );
  }
}
