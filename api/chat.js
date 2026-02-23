import OpenAI from "openai";
import { saveMemory, getMemory } from "../lib/studentMemory.js";
import { detectInsight } from "../lib/insights.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // ✅ Load memory
    const memory = await getMemory(sessionId);

    // ✅ Detect new insights
    const insight = detectInsight(message);

    if (insight) {
      await saveMemory(sessionId, insight);
    }

    // ✅ Build system context
    const memoryContext =
      memory.length > 0
        ? `Student facts:\n${memory.join("\n")}`
        : "";

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Restore AI, a clear and supportive teacher.

Explain simply and directly.
Do not ask unnecessary questions.

${memoryContext}`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({ reply });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({
      reply: "Server error. Please try again.",
    });
  }
}
