// app/api/chat/route.js

import OpenAI from "openai";
import { Redis } from "@upstash/redis";

export const runtime = "edge";

/* -----------------------------
   OpenAI
----------------------------- */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* -----------------------------
   Redis (Upstash)
----------------------------- */
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

/* -----------------------------
   Helper: Load Memory
----------------------------- */
async function loadMemory(userId) {
  const key = `memory:${userId}`;

  try {
    const data = await redis.get(key);

    if (!data) return [];

    return typeof data === "string" ? JSON.parse(data) : data;
  } catch (err) {
    console.log("Memory load failed:", err);
    return [];
  }
}

/* -----------------------------
   Helper: Save Memory
----------------------------- */
async function saveMemory(userId, memory) {
  const key = `memory:${userId}`;

  try {
    await redis.set(key, JSON.stringify(memory));
  } catch (err) {
    console.log("Memory save failed:", err);
  }
}

/* -----------------------------
   POST Handler
----------------------------- */
export async function POST(req) {
  try {
    const { message } 五分彩 = await req.json();

    const userId = "default-user";

    /* ---- Load Memory ---- */
    const memory = await loadMemory(userId);

    /* ---- Build Messages ---- */
    const messages = [
      {
        role: "system",
        content:
          "You are Restore, an AI focused on helping people learn clearly, kindly, and confidently.",
      },
      ...memory,
      {
        role: "user",
        content: message,
      },
    ];

    /* ---- OpenAI Response ---- */
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    const reply = completion.choices[0].message.content;

    /* ---- Update Memory ---- */
    const updatedMemory = [
      ...memory,
      { role: "user", content: message },
      { role: "assistant", content: reply },
    ].slice(-10); // keep last 10 messages

    await saveMemory(userId, updatedMemory);

    /* ---- Return Response ---- */
    return new Response(
      JSON.stringify({ reply }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("API ERROR:", error);

    return new Response(
      JSON.stringify({
        reply: "Something went wrong.",
      }),
      { status: 500 }
    );
  }
}
