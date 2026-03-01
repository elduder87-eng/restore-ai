import OpenAI from "openai";
import { saveMessage, getMessages } from "@/lib/memory";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    // Load memory
    const history = await getMessages(userId);

    // Save user message
    await saveMessage(userId, {
      role: "user",
      content: message,
    });

    const messages = [
      {
        role: "system",
        content:
          "You are Restore, a calm and encouraging AI teacher. Explain clearly and simply.",
      },
      ...history,
      {
        role: "user",
        content: message,
      },
    ];

    // ✅ NEW OPENAI CALL (IMPORTANT)
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    const reply =
      completion.choices[0].message.content;

    // Save AI response
    await saveMessage(userId, {
      role: "assistant",
      content: reply,
    });

    return Response.json({ reply });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
