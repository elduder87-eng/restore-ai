import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

/* ===============================
   Learning Signal Analyzer
================================ */

function analyzeLearningSignals(message) {
  const text = message.toLowerCase();

  let signals = {};

  // curiosity
  if (text.includes("why") || text.includes("how")) {
    signals.engagement = "high";
  }

  // beginner preference
  if (text.includes("simple") || text.includes("explain like")) {
    signals.depth_preference = "beginner";
  }

  // advanced preference
  if (text.includes("advanced") || text.includes("deep")) {
    signals.depth_preference = "advanced";
  }

  // interest expression
  if (text.includes("i enjoy") || text.includes("i like")) {
    signals.learning_style = "exploratory";
  }

  // goal-oriented language
  if (text.includes("i want to learn")) {
    signals.motivation = "goal_oriented";
  }

  return signals;
}

/* ===============================
   Extract Basic Memory
================================ */

function extractMemory(message, memory) {
  const text = message.toLowerCase();

  // name memory
  if (text.includes("my name is")) {
    const name = message.split("my name is")[1]?.trim();
    if (name) memory.name = name;
  }

  // interest
  if (text.includes("i enjoy") || text.includes("i like")) {
    memory.interest = message;
  }

  // learning goal
  if (text.includes("i want to learn")) {
    memory.goal = message;
  }

  return memory;
}

/* ===============================
   API Handler
================================ */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, userId = "default-user" } = req.body;

    const userKey = `memory:${userId}`;

    // Load memory
    let memory = (await redis.get(userKey)) || {};

    /* ===== Update Memory ===== */

    memory = extractMemory(message, memory);

    // Analyze learning behavior
    const learningSignals = analyzeLearningSignals(message);

    memory.learning_profile = {
      ...memory.learning_profile,
      ...learningSignals,
    };

    // Save updated memory
    await redis.set(userKey, memory);

    /* ===== Build System Prompt ===== */

    const systemPrompt = `
You are Restore AI — an adaptive teacher and mentor.

You adjust your teaching style based on the learner profile.

Learner Memory:
${JSON.stringify(memory)}

Teaching Rules:
- Be supportive and encouraging.
- Adapt explanation depth automatically.
- Teach clearly and naturally.
- Encourage curiosity.
- Act like a patient human teacher.
`;

    /* ===== Call OpenAI ===== */

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "I'm here, but something went wrong.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}
