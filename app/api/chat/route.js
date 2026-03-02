import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";
    const memoryKey = `restore:memory:${userId}`;

    // ✅ Safely get memory
    let history = await redis.get(memoryKey);

    if (!Array.isArray(history)) {
      history = [];
    }

    // Add user message
    history.push({
      role: "user",
      content: message,
    });

    // Call OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: history,
      }),
    });

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "I'm having trouble responding right now.";

    // Add AI response
    history.push({
      role: "assistant",
      content: reply,
    });

    // Save memory
    await redis.set(memoryKey, history);

    return Response.json({ reply });
  } catch (err) {
    console.error("API ERROR:", err);
    return Response.json(
      { reply: "Something went wrong." },
      { status: 500 }
    );
  }
}
