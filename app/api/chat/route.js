import { Redis } from "@upstash/redis";

export const runtime = "edge";

// ✅ FORCE correct variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    // ---- MEMORY LOAD ----
    const name = await redis.get(`name:${userId}`);

    let reply = "I'm here to help you learn.";

    // ---- MEMORY SAVE ----
    if (message.toLowerCase().includes("my name is")) {
      const extracted = message.split("my name is")[1]?.trim();
      if (extracted) {
        await redis.set(`name:${userId}`, extracted);
        reply = `Nice to meet you, ${extracted}.`;
      }
    }

    // ---- MEMORY RECALL ----
    else if (name) {
      reply = `Welcome back, ${name}. I'm here to help you learn.`;
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("CHAT ERROR:", err);
    return new Response(
      JSON.stringify({ reply: "Server connection failed." }),
      { status: 500 }
    );
  }
}
