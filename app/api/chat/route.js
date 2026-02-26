import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    // ---- Load memory ----
    const memory =
      (await redis.get(`memory:${userId}`)) || [];

    // ---- Build conversation ----
    const messages = [
      {
        role: "system",
        content:
          "You are Restore AI in Teacher Mode. Be calm, clear, encouraging, and educational.",
      },
      ...memory,
      { role: "user", content: message },
    ];

    // ---- Call OpenAI ----
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
        }),
      }
    );

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "I'm here to help you learn.";

    // ---- Save updated memory ----
    const updatedMemory = [
      ...memory,
      { role: "user", content: message },
      { role: "assistant", content: reply },
    ].slice(-10); // keep last 10 messages

    await redis.set(`memory:${userId}`, updatedMemory);

    // ---- Return response ----
    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    return new Response(
      JSON.stringify({
        reply: "Server connection failed.",
      }),
      { status: 500 }
    );
  }
}
