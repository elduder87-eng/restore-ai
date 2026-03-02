import OpenAI from "openai";
import { getMemory, updateMemory } from "@/lib/memory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function buildAdaptiveSystemPrompt(memory) {

  let teachingStyle = "clear and friendly";

  if (memory.confidence < 0.4)
    teachingStyle = "gentle, simple, encouraging, beginner-friendly";

  if (memory.confidence > 0.7)
    teachingStyle = "deeper, more conceptual, and thought-provoking";

  return `
You are Restore AI, an adaptive learning companion.

Teaching style:
${teachingStyle}

Learner state: ${memory.learningState}
Confidence level: ${memory.confidence}

Known interests: ${memory.interests.join(", ") || "none yet"}

Rules:
- Adjust explanation complexity automatically.
- Encourage curiosity.
- Help the learner connect ideas.
- Be concise but warm.
- Never mention memory tracking.
`;
}

export async function POST(req) {
  try {
    const { message } = await req.json();

    const memory = updateMemory("default", message);

    // Reflection request
    if (message.toLowerCase().includes("how am i doing")) {
      return Response.json({
        reply: `Here’s your learning progress:\n
State: ${memory.learningState}
Confidence: ${(memory.confidence * 100).toFixed(0)}%
Interests: ${memory.interests.join(", ") || "still discovering"}`
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: buildAdaptiveSystemPrompt(memory)
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    return Response.json({
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);
    return Response.json({
      reply: "I'm having a small technical hiccup — but I'm still here. Try again in a moment."
    });
  }
}
