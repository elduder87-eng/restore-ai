// api/chat.js

import OpenAI from "openai";
import { Redis } from "@upstash/redis";

/* =========================
   Clients
========================= */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

/* =========================
   Learning Signal Detection
========================= */

function analyzeLearningSignals(message) {
  const text = message.toLowerCase();
  let signals = {};

  // depth preference
  if (text.includes("simply") || text.includes("basic")) {
    signals.depth_preference = "beginner";
  }

  if (
    text.includes("in depth") ||
    text.includes("advanced") ||
    text.includes("detailed")
  ) {
    signals.depth_preference = "advanced";
  }

  // curiosity level
  if (text.includes("why") || text.includes("how")) {
    signals.engagement = "high";
  }

  // topic detection
  const topics = ["physics", "science", "math", "biology", "chemistry"];

  topics.forEach(topic => {
    if (text.includes(topic)) {
      signals.topic_interest = topic;
    }
  });

  // learning intent
  if (text.includes("explain")) {
    signals.learning_mode = "instruction";
  }

  return signals;
}

/* =========================
   Personal Memory Extraction
========================= */

function extractPersonalInfo(message) {
  const text = message.toLowerCase();
  let memory = {};

  // name detection
  if (text.includes("my name is")) {
    memory.name = message.split("my name is")[1]?.trim();
  }

  // interests
  if (text.includes("i enjoy")) {
    memory.interest = message.split("i enjoy")[1]?.trim();
  }

  if (text.includes("i want to learn")) {
    memory.learning_goal = message.split("i want to learn")[1]?.trim();
  }

  return memory;
}

/* =========================
   API Handler
========================= */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const userId = "default-user";

    /* =========================
       Load Memory
    ========================= */

    let memory = (await redis.get(userId)) || {};

    /* =========================
       Update Personal Memory
    ========================= */

    const personalInfo = extractPersonalInfo(message);
    memory = { ...memory, ...personalInfo };

    /* =========================
       Update Learning Profile
    ========================= */

    const learningSignals = analyzeLearningSignals(message);

    memory.learning_profile = {
      ...(memory.learning_profile || {}),
      ...learningSignals,
    };

    /* =========================
       Save Memory
    ========================= */

    await redis.set(userId, memory);

    /* =========================
       Build Context
    ========================= */

    let context = "";

    if (memory
