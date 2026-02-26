import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    const { message } = req.body;
    const userId = "default-user";

    // ---------- GET PROFILE ----------
    const name = await redis.get(`${userId}:name`);

    // ---------- GET HISTORY ----------
    let history = await redis.get(`${userId}:history`);
    if (!history) history = [];

    // add new message
    history.push(`User: ${message}`);

    // keep last 6 messages only
    history = history.slice(-6);

    await redis.set(`${userId}:history`, history);

    // ---------- BUILD CONTEXT ----------
    const context = history.join("\n");

    let reply;

    if (name) {
      reply = `Welcome back, ${name}. Based on our conversation:\n${context}`;
    } else {
      reply = "I'm here to help you learn.";
    }

    // store AI reply too
    history.push(`AI: ${reply}`);
    history = history.slice(-6);
    await redis.set(`${userId}:history`, history);

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Server error." });
  }
}
