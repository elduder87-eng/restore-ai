import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    const { message } = req.body;
    const userId = "default-user";

    // ---------- PROFILE ----------
    const name = await redis.get(`${userId}:name`);

    // ---------- LOAD HISTORY ----------
    let history = await redis.get(`${userId}:history`);

    // convert string → array
    if (history) {
      history = JSON.parse(history);
    } else {
      history = [];
    }

    // add user message
    history.push(`User: ${message}`);
    history = history.slice(-6);

    // save history
    await redis.set(
      `${userId}:history`,
      JSON.stringify(history)
    );

    // ---------- BUILD CONTEXT ----------
    const context = history.join("\n");

    let reply;

    if (name) {
      reply = `Welcome back, ${name}. Based on our conversation:\n${context}`;
    } else {
      reply = "I'm here to help you learn.";
    }

    // store AI reply
    history.push(`AI: ${reply}`);
    history = history.slice(-6);

    await redis.set(
      `${userId}:history`,
      JSON.stringify(history)
    );

    res.status(200).json({ reply });

  } catch (error) {
    console.error("CHAT ERROR:", error);
    res.status(500).json({ reply: "Server error." });
  }
}
