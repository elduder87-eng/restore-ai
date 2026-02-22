import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, studentId = "default" } = req.body;

    // ✅ Load student memory
    let memory = await redis.get(`student:${studentId}`);

    if (!memory) {
      memory = {
        preferences: {
          style: "guided",
          difficulty: "medium",
        },
        history: [],
      };
    }

    // Save message to history
    memory.history.push({
      role: "user",
      content: message,
    });

    // Keep history small
    memory.history = memory.history.slice(-10);

    // Teaching style logic
    let reply;

    if (
      message.toLowerCase().includes("stop asking questions") ||
      message.toLowerCase().includes("just explain")
    ) {
      memory.preferences.style = "direct";
      reply =
        "Got it. I’ll explain things clearly and directly from now on.";
    } else if (memory.preferences.style === "direct") {
      reply = `Here is a clear explanation: ${message} is an important concept. Let me explain it step-by-step in simple terms.`;
    } else {
      reply =
        "Let's think about this together. What do you already know about it?";
    }

    memory.history.push({
      role: "assistant",
      content: reply,
    });

    // ✅ Save updated memory
    await redis.set(`student:${studentId}`, memory);

    return res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ reply: "Server error." });
  }
}
