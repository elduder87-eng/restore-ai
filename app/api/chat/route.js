import OpenAI from "openai";
import { saveMemory, getMemory } from "@/lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    // ✅ get memory safely
    let memory = [];
    try {
      memory = await getMemory(userId);
    } catch (e) {
      console.log("Memory read failed:", e);
    }

    const messages = [
      {
        role: "system",
        content: "You are Restore AI — a helpful teacher.",
      },
      ...memory.map((m) => ({
        role: "user",
        content: m,
      })),
      {
        role: "user",
        content: message,
      },
    ];

    // ✅ AI call
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "I couldn't generate a response.";

    // ✅ save memory (NON BLOCKING)
    saveMemory(userId, message).catch(() => {});

    return Response.json({ reply });
  } catch (error) {
    console.error("CHAT ROUTE ERROR:", error);

    // return real error so we can see progress
    return Response.json({
      reply: "Restore encountered an internal error.",
    });
  }
}
