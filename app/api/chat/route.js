import { NextResponse } from "next/server";
import OpenAI from "openai";
import { kv } from "@vercel/kv";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    // -----------------------------
    // LOAD MEMORY
    // -----------------------------
    let memory = await kv.get("memory");

    if (!memory) {
      memory = {
        interests: [],
        learningStyle: "clear and simple explanations",
      };
    }

    // -----------------------------
    // UPDATE INTERESTS (simple AI detection)
    // -----------------------------
    const lower = message.toLowerCase();

    if (lower.includes("astronomy") && !memory.interests.includes("astronomy")) {
      memory.interests.push("astronomy");
    }

    if (lower.includes("biology") && !memory.interests.includes("biology")) {
      memory.interests.push("biology");
    }

    if (lower.includes("weather") && !memory.interests.includes("weather")) {
      memory.interests.push("weather");
    }

    if (
      lower.includes("simple") ||
      lower.includes("easy") ||
      lower.includes("explain simply")
    ) {
      memory.learningStyle = "prefers simple explanations";
    }

    // SAVE MEMORY
    await kv.set("memory", memory);

    // -----------------------------
    // BUILD SYSTEM PROMPT
    // -----------------------------
    const systemPrompt = `
You are Restore AI, a supportive educational teacher.

User Interests: ${memory.interests.join(", ") || "unknown"}
Learning Style: ${memory.learningStyle}

Rules:
- Teach clearly and simply.
- Personalize explanations to interests.
- Encourage curiosity.
- Keep tone friendly and educational.
`;

    // -----------------------------
    // OPENAI RESPONSE
    // -----------------------------
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    // -----------------------------
    // RETURN RESPONSE
    // -----------------------------
    return NextResponse.json({
      reply,
      memory,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { reply: "Something went wrong." },
      { status: 500 }
    );
  }
}
