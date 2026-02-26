import OpenAI from "openai";
import { Redis } from "@upstash/redis";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    // get stored name
    let name = await redis.get(`name:${userId}`);

    // detect name introduction
    if (message.toLowerCase().includes("my name is")) {
      name = message.split("my name is")[1].trim();
      await redis.set(`name:${userId}`, name);
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful teacher AI. ${
            name ? `The user's name is ${name}.` : ""
          }`,
        },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    return new Response(
      JSON.stringify({ reply }),
      { status: 200 }
    );

  } catch (error) {
    console.error("CHAT ERROR:", error);

    return new Response(
      JSON.stringify({ reply: "Server error." }),
      { status: 500 }
    );
  }
}
