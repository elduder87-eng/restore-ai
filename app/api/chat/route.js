// app/api/chat/route.js

import OpenAI from "openai";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

// --------------------
// OpenAI Client
// --------------------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --------------------
// POST Handler
// --------------------
export async function POST(req) {
  try {
    const { message, userId = "default-user" } = await req.json();

    if (!message) {
      return NextResponse.json({ reply: "No message received." });
    }

    // --------------------
    // Load Memory
    // --------------------
    const memoryKey = `memory:${userId}`;
    let memory = await redis.get(memoryKey);

    if (!memory) {
      memory = [];
    }

    // Add user message to memory
    memory.push({
      role: "user",
      content: message,
    });

    // Keep memory size reasonable
    memory = memory.slice(-10);

    // --------------------
    // System Personality
    // --------------------
    const systemPrompt = {
      role: "system",
      content: `
You are Restore AI operating in Teacher Mode.

You are a hybrid between a thoughtful teacher and a supportive friend.
You help users learn while building a genuine connection.

Guidelines:
- Be warm but intellectually engaging.
- Encourage curiosity.
- Ask occasional reflective questions.
- Do NOT rush emotional bonding.
- Let connection grow naturally over time.
`,
    };

    const messages = [systemPrompt, ...memory];

    // --------------------
    // OpenAI Call
    // --------------------
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;

    // Save AI reply into memory
    memory.push({
      role: "assistant",
      content: reply,
    });

    await redis.set(memoryKey, memory);

    // --------------------
    // Return Response
    // --------------------
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    return NextResponse.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
