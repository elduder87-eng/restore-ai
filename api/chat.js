import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { message } = req.body;

  const userId = "default-user"; // later becomes login/session id

  // 🔹 Load stored profile
  let profile = await redis.get(`profile:${userId}`);
  if (!profile) profile = {};

  // 🔹 Detect name learning
  const nameMatch = message.match(/my name is (\w+)/i);
  if (nameMatch) {
    profile.name = nameMatch[1];
    await redis.set(`profile:${userId}`, profile);
  }

  // 🔹 Build memory context
  let memoryContext = "";
  if (profile.name) {
    memoryContext += `The user's name is ${profile.name}. `;
  }

  // 🔹 OpenAI request
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
          content: `You are Restore AI, a supportive teacher AI. ${memoryContext}`,
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

  res.status(200).json({ reply });
}
