import { kv } from "@vercel/kv";

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return Response.json(
        { reply: "No message provided." },
        { status: 400 }
      );
    }

    const userId = "default-user";

    // Load memory
    const storedName = await kv.get(`name:${userId}`);

    // Learn name
    if (message.toLowerCase().includes("my name is")) {
      const name = message.split("my name is")[1]?.trim();

      if (name) {
        await kv.set(`name:${userId}`, name);

        return Response.json({
          reply: `Nice to meet you, ${name}. I'll remember that.`,
        });
      }
    }

    // Use memory
    if (storedName) {
      return Response.json({
        reply: `Welcome back, ${storedName}. I'm here to help you learn.`,
      });
    }

    // Default
    return Response.json({
      reply: "I'm here to help you learn.",
    });

  } catch (err) {
    console.error("CHAT ERROR:", err);

    return Response.json(
      { reply: "Server error." },
      { status: 500 }
    );
  }
}
