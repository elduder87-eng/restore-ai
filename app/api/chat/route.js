import OpenAI from "openai";
import { kv } from "@vercel/kv";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ---------- MEMORY SAVE ----------
async function saveInterest(message) {
  const lower = message.toLowerCase();

  let detected = null;

  if (lower.includes("astronomy")) detected = "astronomy";
  if (lower.includes("biology")) detected = "biology";
  if (lower.includes("math")) detected = "math";
  if (lower.includes("physics")) detected = "physics";

  if (!detected) return;

  const existing = (await kv.get("user_interests")) || [];

  if (!existing.includes(detected)) {
    existing.push(detected);
    await kv.set("user_interests", existing);
  }
}

// ---------- API ROUTE ----------
export async function POST(req) {
  try {
    const { messages } = await req.json();

    const lastMessage =
      messages[messages.length - 1]?.content || "";

    // save memory
    await saveInterest(lastMessage);

    // load memory
    const interests =
      (await kv.get("user_interests")) || [];

    const memoryContext =
      interests.length > 0
        ? `The user has shown interest in: ${interests.join(
            ", "
          )}. Remember this and reference it naturally.`
        : "";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Restore AI, a supportive learning teacher.
${memoryContext}`
        },
        ...messages
      ]
    });

    const reply =
      completion.choices[0].message.content;

    return Response.json({ reply });
  } catch (error) {
    console.error(error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment."
    });
  }
}
