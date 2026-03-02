import OpenAI from "openai";
import { redis } from "@/lib/redis";
import { getIdentity, updateIdentity } from "@/lib/identity";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MEMORY_KEY = "memory:default-user";

export async function POST(req) {
  try {
    const body = await req.json();
    const userMessage = body.message;

    // -----------------------------
    // Update Identity
    // -----------------------------
    await updateIdentity(userMessage);
    const identity = await getIdentity();

    // -----------------------------
    // Get conversation memory
    // -----------------------------
    let history = await redis.get(MEMORY_KEY);

    if (!history) {
      history = [];
    }

    // Add user message
    history.push({
      role: "user",
      content: userMessage,
    });

    // Keep last 10 messages
    history = history.slice(-10);

    // -----------------------------
    // AI Response
    // -----------------------------
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore AI, a personalized learning companion.

User Identity Profile:
Preferences: ${identity.preferences.join(", ")}
Interests: ${identity.interests.join(", ")}
Learning Style: ${identity.learningStyle}
Traits: ${identity.traits.join(", ")}

Use this information naturally to personalize responses.
`,
        },
        ...history,
      ],
    });

    const reply = completion.choices[0].message.content;

    // Save assistant reply
    history.push({
      role: "assistant",
      content: reply,
    });

    await redis.set(MEMORY_KEY, history);

    return Response.json({ reply });
  } catch (error) {
    console.error("API ERROR:", error);
    return Response.json(
      { reply: "Something went wrong." },
      { status: 500 }
    );
  }
}
