import { NextResponse } from "next/server";
import OpenAI from "openai";

import { getMemory, saveMemory } from "@/lib/memory";
import extractIdentity from "@/lib/extractIdentity";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message, userId = "default-user" } = await req.json();

    // 1️⃣ LOAD MEMORY FROM REDIS
    const memory = await getMemory(userId);

    // 2️⃣ EXTRACT NEW IDENTITY INFO
    const identity = extractIdentity(message);

    if (identity.name || identity.interests.length > 0) {
      await saveMemory(userId, identity);
    }

    // 3️⃣ BUILD CONTEXT FOR AI
    const systemContext = `
You are Restore AI.

User Memory:
Name: ${memory?.name || "Unknown"}
Interests: ${(memory?.interests || []).join(", ")}

Use this information naturally if relevant.
`;

    // 4️⃣ CALL AI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemContext },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    return NextResponse.json({ reply });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { reply: "I'm here to help you learn." },
      { status: 200 }
    );
  }
}
