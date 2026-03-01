// app/api/chat/route.js

import OpenAI from "openai";
import { saveMemory, getHistory, getTopic } from "@/lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message, userId = "default-user" } = await req.json();

    // Save user message
    await saveMemory(userId, message);

    // Load memory
    const history = await getHistory(userId);
    const currentTopic = await getTopic(userId);

    // Base Restore personality
    let systemPrompt = `
You are Restore, a hybrid teacher and companion AI.

Core behavior:
- Education is primary.
- Conversation feels natural and human.
- The user leads the direction.
- Do not abruptly change subjects.
- Teach simply when teaching is requested.
`;

    // Topic awareness (NEW)
    if (currentTopic) {
      systemPrompt += `
The user is currently interested in ${currentTopic}.
If teaching is requested, prefer examples from this topic.
`;
    }

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map((msg) => ({
        role: "user",
        content: msg,
      })),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;

    // Save AI reply too
    await saveMemory(userId, reply);

    return Response.json({ reply });

  } catch (error) {
    console.error(error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
