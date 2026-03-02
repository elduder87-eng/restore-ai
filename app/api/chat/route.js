import OpenAI from "openai";
import { getMemory, updateMemory } from "@/lib/memory";
import { generateSuggestion } from "@/lib/suggestions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message, userId = "default-user" } = await req.json();

    // =====================
    // LOAD MEMORY
    // =====================
    let memory = await getMemory(userId);

    const lower = message.toLowerCase();

    let detectedInterests = [];

    if (lower.includes("astronomy")) detectedInterests.push("astronomy");
    if (lower.includes("biology")) detectedInterests.push("biology");

    if (detectedInterests.length > 0) {
      memory = await updateMemory(userId, {
        interests: detectedInterests,
      });
    }

    // learning style detection
    let learningStyle = memory.learningStyle;

    if (lower.includes("simply") || lower.includes("simple")) {
      learningStyle = "simple";
      memory = await updateMemory(userId, { learningStyle });
    }

    // =====================
    // SUGGESTIONS
    // =====================
    const suggestion = generateSuggestion(memory);

    // =====================
    // SYSTEM PROMPT
    // =====================
    const systemPrompt = `
You are Restore AI, a calm and encouraging adaptive teacher.

Learner Profile:
Interests: ${memory.interests.join(", ") || "unknown"}
Learning Style: ${memory.learningStyle}

Teaching Rules:
- Adapt explanations to learning style.
- Be encouraging and educational.
- Let the learner lead the conversation.
- Keep responses natural and human.
- Occasionally suggest future topics gently.

Suggested Exploration:
${suggestion || "None right now."}
`;

    // =====================
    // OPENAI CALL
    // =====================
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    return Response.json({ reply });
  } catch (error) {
    console.error(error);
    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
