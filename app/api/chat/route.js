import OpenAI from "openai";
import { getMemory, saveInterest } from "@/lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message, history = [] } = await req.json();

    const userId = "demo-user";

    // -----------------------------
    // MEMORY DETECTION
    // -----------------------------
    const interestMatch = message.match(/i (like|love|enjoy) (.+)/i);

    if (interestMatch) {
      const interest = interestMatch[2];
      saveInterest(userId, interest);
    }

    const memory = getMemory(userId);

    // -----------------------------
    // MEMORY RECALL
    // -----------------------------
    if (/what do you remember about me/i.test(message)) {
      let memorySummary = "I'm still getting to know you.";

      if (memory.interests.length > 0) {
        memorySummary =
          "I remember that you're interested in " +
          memory.interests.join(", ") +
          ".";
      }

      return Response.json({
        reply: memorySummary,
      });
    }

    // -----------------------------
    // BUILD CONTEXT
    // -----------------------------
    const systemPrompt = `
You are Restore AI, a calm educational companion.

Teach simply.
Be encouraging.
Follow the user's curiosity naturally.

Known user interests: ${
      memory.interests.length
        ? memory.interests.join(", ")
        : "none yet"
    }
`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: message },
    ];

    // -----------------------------
    // OPENAI RESPONSE
    // -----------------------------
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
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
