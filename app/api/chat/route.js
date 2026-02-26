import OpenAI from "openai";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    // ---------- LOAD MEMORY ----------
    const savedName = await redis.get(`name:${userId}`);

    let systemPrompt = "You are Restore AI, a helpful teaching assistant.";

    if (savedName) {
      systemPrompt += ` The user's name is ${savedName}.`;
    }

    // ---------- SAVE NAME ----------
    const nameMatch = message.match(/my name is (\w+)/i);

    if (nameMatch) {
      const name = nameMatch[1];
      await redis.set(`name:${userId}`, name);
    }

    // ---------- OPENAI ----------
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

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
    console.error("CHAT ERROR:", error);

    return Response.json(
      { reply: "Server error." },
      { status: 500 }
    );
  }
}
