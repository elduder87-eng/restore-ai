// api/chat.js

import OpenAI from "openai";
import { Redis } from "@upstash/redis";

import { saveTimelineEvent, getTimeline } from "../lib/timelineMemory.js";


// ----------------------------
// OpenAI Setup
// ----------------------------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// ----------------------------
// Redis Setup (Identity Memory)
// ----------------------------
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});


// ----------------------------
// Helper — extract name
// ----------------------------
function extractName(message) {
  const match = message.match(/my name is (\w+)/i);
  return match ? match[1] : null;
}


// ----------------------------
// API Route
// ----------------------------
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message, conversation = [], userId = "default_user" } = req.body;

    const userMessage = message;

    // ----------------------------
    // Identity Memory
    // ----------------------------
    const detectedName = extractName(userMessage);

    if (detectedName) {
      await redis.set(`identity:${userId}:name`, detectedName);
    }

    const storedName = await redis.get(`identity:${userId}:name`);

    // ----------------------------
    // Timeline Memory
    // ----------------------------
    const timeline = await getTimeline(userId);

    const timelineContext = timeline
      .map(t => `${t.role}: ${t.message}`)
      .join("\n");

    // ----------------------------
    // Build Messages
    // ----------------------------
    const messages = [
      {
        role: "system",
        content: `
You are Restore AI, a personalized learning assistant.

Student name: ${storedName || "unknown"}

Recent learning history:
${timelineContext}

You remember past learning and continue naturally.
Keep explanations clear, encouraging, and educational.
        `
      },
      ...conversation,
      {
        role: "user",
        content: userMessage
      }
    ];

    // ----------------------------
    // OpenAI Response
    // ----------------------------
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;

    // ----------------------------
    // SAVE TIMELINE EVENTS
    // ----------------------------
    await saveTimelineEvent(userId, "user", userMessage);
    await saveTimelineEvent(userId, "assistant", reply);

    // ----------------------------
    // Return Response
    // ----------------------------
    res.status(200).json({
      reply,
      name: storedName || null
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
}
