import OpenAI from "openai";
import { getMemory, saveInterest } from "@/lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    // --- MEMORY ---
    const memory = getMemory(userId);

    const lower = message.toLowerCase();

    if (lower.includes("i enjoy") || lower.includes("i like")) {
      const interest = message
        .replace(/i enjoy|i like/gi, "")
        .trim();

      saveInterest(userId, interest);
    }

    // --- MEMORY CONTEXT ---
    let memoryContext = "";

    if (memory.interests.length > 0) {
      memoryContext =
        "The user has shown interest in: " +
        memory.interests.join(", ") +
        ".";
    }

    // --- AI CALL ---
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Restore AI, a calm educational assistant focused on teaching clearly and encouraging curiosity."
        },
        {
          role: "system",
          content: memoryContext
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = completion.choices[0].message.content;

    // --- MEMORY QUESTION HANDLER ---
    if (lower.includes("what do you remember")) {
      return Response.json({
        reply:
          memory.interests.length > 0
            ? `I remember that you're interested in ${memory.interests.join(
                ", "
              )}.`
            : "I'm still getting to know you!"
      });
    }

    return Response.json({ reply });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment."
    });
  }
}
