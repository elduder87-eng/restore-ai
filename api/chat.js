import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { message } = req.body;
  const userId = "default-user";

  // ---------- LOAD PROFILE ----------
  let profile = await redis.get(`profile:${userId}`);
  if (!profile) profile = {};

  // ---------- LEARN PROFILE ----------
  const nameMatch = message.match(/my name is (\w+)/i);
  if (nameMatch) profile.name = nameMatch[1];

  const likesMatch = message.match(/i like (.+)/i);
  if (likesMatch) profile.likes = likesMatch[1];

  const goalMatch = message.match(/i want to learn (.+)/i);
  if (goalMatch) profile.goal = goalMatch[1];

  await redis.set(`profile:${userId}`, profile);

  // ---------- LOAD CHAT MEMORY ----------
  let history = await redis.lrange(`history:${userId}`, 0, 5);
  history = history || [];

  const memoryContext = `
User profile:
Name: ${profile.name || "Unknown"}
Interests: ${profile.likes || "Unknown"}
Goal: ${profile.goal || "Unknown"}

Recent conversation:
${history.join("\n")}
`;

  // ---------- AI CALL ----------
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
        messages: [
          {
            role: "system",
            content: `You are Restore AI, a supportive teacher.
Use memory to continue conversations naturally.
${memoryContext}`,
          },
          { role: "user", content: message },
        ],
      }),
    }
  );

  const data = await response.json();
  const reply = data.choices[0].message.content;

  // ---------- SAVE MEMORY ----------
  await redis.lpush(`history:${userId}`, `User: ${message}`);
  await redis.lpush(`history:${userId}`, `AI: ${reply}`);
  await redis.ltrim(`history:${userId}`, 0, 10);

  res.status(200).json({ reply });
}
