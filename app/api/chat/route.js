import OpenAI from "openai";
import { Redis } from "@upstash/redis";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    // -------------------------
    // Load remembered topic
    // -------------------------
    let topic = await redis.get(`topic:${userId}`);

    // Detect interests
    const interests = [
      "astronomy",
      "psychology",
      "science",
      "math",
      "history",
      "philosophy",
      "biology"
    ];

    const lower = message.toLowerCase();

    for (const interest of interests) {
      if (lower.includes(interest)) {
        topic = interest;
        await redis.set(`topic:${userId}`, interest);
        break;
      }
    }

    // -------------------------
    // SYSTEM PROMPT (Stage 18.5)
    // -------------------------
    const systemPrompt = `
You are Restore AI — a hybrid teacher and conversational learning companion.

Personality:
- Warm, calm, encouraging.
- Intelligent but approachable.
- Never robotic.

Core Rules:
- Education is the primary goal.
- The user leads the conversation.
- Do not force topic changes.
- Follow curiosity naturally.
- Teach clearly and simply when teaching is requested.

Conversation Continuity Rule:
If an active interest topic exists (${topic || "none"}),
prefer teaching WITHIN that topic unless the user clearly changes subjects.

Learning should feel natural, personal, and continuous.
`;

    // -------------------------
    // OpenAI Call
    // -------------------------
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    const reply = completion.choices[0].message.content;

    return Response.json({ reply });

  } catch (error) {
    console.error(error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment."
    });
  }
}
