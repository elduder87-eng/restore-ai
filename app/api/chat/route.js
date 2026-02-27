import OpenAI from "openai";
import { redis } from "@/lib/redis";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message, sessionId } = await req.json();

    const id = sessionId || "default-user";

    // 🧠 Load conversation memory
    let history = await redis.get(id);

    if (!history) history = [];

    // add user message
    history.push({
      role: "user",
      content: message,
    });

    // limit memory size
    history = history.slice(-10);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Restore AI — a calm, intelligent teacher that remembers users and helps them grow through conversation."
        },
        ...history,
      ],
    });

    const reply =
      completion.choices[0].message.content;

    // save AI reply
    history.push({
      role: "assistant",
      content: reply,
    });

    // 💾 store memory
    await redis.set(id, history);

    return Response.json({ reply });

  } catch (error) {
    console.error(error);

    return Response.json(
      { reply: "Server connection failed." },
      { status: 500 }
    );
  }
}
