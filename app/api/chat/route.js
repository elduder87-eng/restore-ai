// app/api/chat/route.js

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// =============================
// MEMORY (Stage 23)
// =============================
let memory = {
  interests: {},
  topics: [],
  stage: "starting"
};


// =============================
// UPDATE INTERESTS
// =============================
function updateInterests(message, memory) {

  const subjects = [
    "astronomy",
    "biology",
    "physics",
    "psychology",
    "math",
    "history",
    "chemistry",
    "language",
    "music"
  ];

  const lower = message.toLowerCase();

  subjects.forEach(subject => {
    if (lower.includes(subject)) {
      if (!memory.interests[subject]) {
        memory.interests[subject] = 0;
      }
      memory.interests[subject] += 1;
    }
  });
}


// =============================
// MAIN CHAT ROUTE
// =============================
export async function POST(req) {

  try {

    const body = await req.json();
    const userMessage = body.message || "";

    // update learner memory
    updateInterests(userMessage, memory);

    const lower = userMessage.toLowerCase();

    let reply = "";

    // =============================
    // MEMORY RECALL
    // =============================
    if (lower.includes("remember")) {

      const interests = Object.keys(memory.interests);

      if (interests.length === 0) {
        reply = "I'm still learning about your interests.";
      } else {
        reply =
          "I remember that you're interested in " +
          interests.join(", ") +
          ".";
      }

      return Response.json({ reply });
    }


    // =============================
    // PROGRESS CHECK
    // =============================
    if (lower.includes("how am i doing")) {

      const summary = Object.entries(memory.interests)
        .map(([k, v]) =>
          `${k}: ${v > 2 ? "strong interest" : "growing interest"}`
        )
        .join(", ");

      reply =
        summary.length > 0
          ? `Here’s your learning progress — ${summary}.`
          : "You're just getting started. Tell me what you're curious about!";

      return Response.json({ reply });
    }


    // =============================
    // SIMPLE ACKNOWLEDGEMENTS
    // (prevents repeated greetings)
    // =============================
    if (lower.includes("i enjoy") || lower.includes("i like")) {

      reply =
        "Nice! I'll remember that — we can explore it together.";

      return Response.json({ reply });
    }


    // =============================
    // OPENAI RESPONSE
    // =============================
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Restore AI, a calm educational guide. Teach clearly, simply, and encourage curiosity. Keep answers concise and supportive."
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    reply = completion.choices[0].message.content;

    return Response.json({ reply });

  } catch (error) {

    console.error("CHAT ERROR:", error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment."
    });
  }
}
