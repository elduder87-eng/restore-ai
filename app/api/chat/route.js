import OpenAI from "openai";
import { kv } from "@vercel/kv";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    // ---------- LOAD MEMORY ----------
    let memory = [];

    try {
      memory = (await kv.get("memory")) || [];
    } catch (err) {
      console.log("KV read failed:", err);
    }

    // ---------- UPDATE MEMORY ----------
    if (
      message.toLowerCase().includes("i enjoy") ||
      message.toLowerCase().includes("i like")
    ) {
      memory.push(message);
      await kv.set("memory", memory);
    }

    // ---------- BUILD CONTEXT ----------
    const memoryContext =
      memory.length > 0
        ? `User facts: ${memory.join(", ")}`
        : "No stored memories.";

    // ---------- OPENAI CALL ----------
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Restore AI, a personalized teacher.
${memoryContext}`,
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
