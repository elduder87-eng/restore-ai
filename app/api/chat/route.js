// app/api/chat/route.js

import OpenAI from "openai";
import { Redis } from "@upstash/redis";

export const runtime = "edge";

/* OpenAI */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* Redis */
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

/* Load Memory */
async function loadMemory(userId) {
  const key = `memory:${userId}`;

  try {
    const data = await redis.get(key);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/* Save Memory */
async function saveMemory(userId, memory) {
  const key = `memory:${userId}`;
  await redis.set(key, JSON.stringify(memory));
}

/* API Route */
export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    const memory = await loadMemory(userId);

    const messages = [
      {
        role: "system",
        content:
          "You are Restore, an AI focused on helping people learn clearly and kindly.",
      },
      ...memory,
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    const reply = completion.choices[0].message.content;

    const updatedMemory = [
      ...memory,
      { role: "user", content: message },
      { role: "assistant", content: reply },
    ].slice(-10);

    await saveMemory(userId, updatedMemory);

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API ERROR:", error);

    return new Response(
      JSON.stringify({ reply: "Something went wrong." }),
      { status: 500 }
    );
  }
}
