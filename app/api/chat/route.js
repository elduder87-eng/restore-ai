// app/api/chat/route.js

import OpenAI from "openai";
import { readMemory, writeMemory } from "@/memory/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// =============================
// TOPIC DETECTION
// =============================
function detectTopic(message) {
  const text = message.toLowerCase();

  if (text.includes("astronomy")) return "astronomy";
  if (text.includes("biology")) return "biology";
  if (text.includes("gravity")) return "gravity";
  if (text.includes("physics")) return "physics";
  if (text.includes("music")) return "music";
  if (text.includes("language")) return "language";

  return null;
}


// =============================
// MAIN ROUTE
// =============================
export async function POST(req) {
  try {
    const { message } = await req.json();
    const lower = message.toLowerCase();

    // -------------------------
    // LOAD MEMORY FILES
    // -------------------------
    const identity = readMemory("identity.json");
    const curiosity = readMemory("curiosity.json");
    const learningPath = readMemory("learningPath.json");

    const topic = detectTopic(message);

    // -------------------------
    // UPDATE MEMORY
    // -------------------------
    if (topic) {

      // identity memory
      if (!identity.interests.includes(topic)) {
        identity.interests.push(topic);
      }

      // curiosity tracking
      if (!curiosity.topics[topic]) {
        curiosity.topics[topic] = 1;
      } else {
        curiosity.topics[topic]++;
      }

      // learning path tracking
      if (!learningPath.paths[topic]) {
        learningPath.paths[topic] = {
          mentions: 1,
          suggested: false,
        };
      } else {
        learningPath.paths[topic].mentions++;
      }

      writeMemory("identity.json", identity);
      writeMemory("curiosity.json", curiosity);
      writeMemory("learningPath.json", learningPath);
    }

    // -------------------------
    // MEMORY RECALL
    // -------------------------
    if (lower.includes("what do you remember")) {
      const interests = identity.interests.length
        ? identity.interests.join(", ")
        : "still learning about you";

      return Response.json({
        reply: `I remember that you're interested in ${interests}.`,
      });
    }

    // -------------------------
    // PROGRESS REFLECTION
    // -------------------------
    if (lower.includes("how am i doing")) {
      const progress =
        identity.interests.length > 0
          ? identity.interests
              .map(i => `${i}: growing interest`)
              .join(", ")
          : "just getting started.";

      return Response.json({
        reply: `Here’s your learning progress — ${progress}`,
      });
    }

    // -------------------------
    // AI RESPONSE
    // -------------------------
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Restore AI, a calm educational learning companion. Encourage curiosity, teach clearly, and guide gently without forcing direction.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    let aiResponse = completion.choices[0].message.content;

    // -------------------------
    // STAGE 24 GUIDED SUGGESTION
    // -------------------------
    let suggestion = null;

    for (const t in learningPath.paths) {
      const entry = learningPath.paths[t];

      if (entry.mentions >= 2 && !entry.suggested) {
        entry.suggested = true;
        suggestion = t;
        break;
      }
    }

    if (suggestion) {
      writeMemory("learningPath.json", learningPath);

      aiResponse += `

If you're interested, we could explore ${suggestion} more deeply sometime — it connects nicely with what you've been learning.`;
    }

    return Response.json({ reply: aiResponse });

  } catch (error) {
    console.error("CHAT ERROR:", error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
