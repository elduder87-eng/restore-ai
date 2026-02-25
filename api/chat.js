import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { message, userId } = req.body;

  if (!message || !userId) {
    return res.status(400).json({ reply: "Missing message or userId" });
  }

  /* ---------------- LOAD PROFILE ---------------- */

  let profile = await redis.get(`profile:${userId}`);
  if (!profile) profile = {};

  const text = message.toLowerCase();

  /* ---------------- AUTO LEARNING ---------------- */

  // Name detection
  const nameMatch = message.match(/my name is (\w+)/i);
  if (nameMatch) profile.name = nameMatch[1];

  // Interest detection (natural phrases)
  if (text.includes("i like") || text.includes("i love") || text.includes("i enjoy")) {
    profile.interest = message.replace(/i (like|love|enjoy)/i, "").trim();
  }

  // Difficulty detection
  if (text.includes("is hard") || text.includes("struggle")) {
    profile.challenge = message;
  }

  // Learning goal detection
  if (text.includes("want to learn") || text.includes("trying to learn")) {
    profile.goal = message;
  }

  await redis.set(`profile:${userId}`, profile);

  /* ---------------- LOAD HISTORY ---------------- */

  let history = await redis.lrange(`history:${userId}`, 0, 5);
  history = history || [];

  const memoryContext = `
Student Profile:
Name: ${profile.name || "Unknown"}
Interest: ${profile.interest || "Unknown"}
Goal: ${profile.goal || "Unknown"}
Challenge: ${profile.challenge || "None noted"}

Recent Conversation:
${history.join("\n")}
`;

  /* ---------------- AI CALL ---------------- */

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Restore AI, a calm educational companion.
Use the student profile to personalize explanations naturally.
Do not announce memory updates.`,
        },
        {
          role: "system",
          content: memoryContext,
        },
        {
          role: "user",
          content: message,
        },
      ],
    }),
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;

  /* ---------------- SAVE HISTORY ---------------- */

  await redis.lpush(`history:${userId}`, `User: ${message}`);
  await redis.lpush(`history:${userId}`, `AI: ${reply}`);
  await redis.ltrim(`history:${userId}`, 0, 10);

  res.status(200).json({ reply });
}
