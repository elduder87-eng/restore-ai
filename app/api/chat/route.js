import OpenAI from "openai";
import { getRecentMessages, addMessage } from "@/lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { message, userId } = body;

    if (!message || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing message or userId" }),
        { status: 400 }
      );
    }

    // 1️⃣ Load memory once
    const memory = await getRecentMessages(userId);

    // Performance limit: last 6 messages only
    const recentMemory = memory.slice(-6);

    // 2️⃣ Build conversation payload
    const messages = [
      {
        role: "system",
        content: `
You are Restore.

Restore builds independent thinkers, not dependency.

Be natural and conversational.
Be concise by default.
Expand only if the user explicitly asks for depth.

Avoid overwhelming lists unless requested.
Favor clarity, warmth, and subtle contextual awareness.
Encourage reflection, not reliance.
        `.trim(),
      },
      ...recentMemory,
      {
        role: "user",
        content: message,
      },
    ];

    // 3️⃣ Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "I'm here with you. Could you say that again?";

    // 4️⃣ Write AFTER response (prevents race conditions)
    await addMessage(userId, "user", message);
    await addMessage(userId, "assistant", reply);

    return new Response(JSON.stringify({ reply }), {
      status: 200,
    });
  } catch (error) {
    console.error("Chat route error:", error);

    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
