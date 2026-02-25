import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { message } = req.body;
  const userId = "default-user";

  // Load profile
  let profile = await redis.get(`profile:${userId}`);
  if (!profile) profile = {};

  // ---- MEMORY LEARNING ----

  const nameMatch = message.match(/my name is (\w+)/i);
  if (nameMatch) profile.name = nameMatch[1];

  const likesMatch = message.match(/i like (.+)/i);
  if (likesMatch) profile.likes = likesMatch[1];

  const goalMatch = message.match(/i want to learn (.+)/i);
  if (goalMatch) profile.goal = goalMatch[1];

  await redis.set(`profile:${userId}`, profile);

  // ---- BUILD CONTEXT ----

  let memoryContext = "User profile:";
  if (profile.name) memoryContext += ` Name: ${profile.name}.`;
  if (profile.likes) memoryContext += ` Interests: ${profile.likes}.`;
  if (profile.goal) memoryContext += ` Learning goal: ${profile.goal}.`;

  // ---- AI REQUEST ----

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
          content: `You are Restore AI, a warm supportive teacher AI.
Use the stored user profile to personalize responses.
${memoryContext}`,
        },
        { role: "user", content: message },
      ],
    }),
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;

  res.status(200).json({ reply });
}
