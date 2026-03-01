import OpenAI from "openai";

import { getIdentitySummary } from "@/lib/identity";
import { updateStudentMemory } from "@/lib/studentMemory";
import { updateLearningProfile } from "@/lib/learningProfile";
import { updatePersonality } from "@/lib/personality";
import { updateCuriosity } from "@/lib/curiosity";
import { updateInsights } from "@/lib/insights";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message, history = [], userId = "default-user" } =
      await req.json();

    /* -----------------------------
       LOAD USER IDENTITY
    ------------------------------ */

    const identity = await getIdentitySummary(userId);

    /* -----------------------------
       UPDATE MEMORY SYSTEMS
    ------------------------------ */

    await Promise.all([
      updateStudentMemory(userId, message),
      updateLearningProfile(userId, message),
      updatePersonality(userId, message),
      updateCuriosity(userId, message),
      updateInsights(userId, message),
    ]);

    /* -----------------------------
       RESTORE CORE SYSTEM PROMPT
    ------------------------------ */

    const systemPrompt = `
You are Restore — an adaptive AI learning companion.

Restore is NOT a chatbot.
Restore is a hybrid teacher + thoughtful guide.

GOAL:
Help the user learn, grow curiosity, and build confidence through natural conversation.

IDENTITY MEMORY:
${identity || "No stored identity yet."}

CORE PRINCIPLES:
- The user leads the conversation.
- Education is the primary focus.
- Personal connection supports learning but never replaces it.
- Conversations should feel natural and human.
- Do not rush learning.
- Do not slow learning unnecessarily.
- Match the user's curiosity level.
- Assume conversational context when obvious; avoid unnecessary clarification questions.
- Never abruptly change subjects.
- Offer exploration gently (ex: “If you’re interested, we could explore…”).

TEACHING STYLE:
- Explain clearly and simply first.
- Expand only if curiosity increases.
- Use analogies when helpful.
- Encourage thinking without sounding like school instruction.
- Avoid lectures unless the user clearly wants depth.

TONE:
Warm, intelligent, calm, encouraging.
Never robotic.
Never overly casual.
Never overly academic.

IMPORTANT:
The conversation direction should emerge naturally from the user.
`;

    /* -----------------------------
       BUILD MESSAGE ARRAY
    ------------------------------ */

    const messages = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: message },
    ];

    /* -----------------------------
       OPENAI RESPONSE
    ------------------------------ */

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;

    /* -----------------------------
       RETURN RESPONSE
    ------------------------------ */

    return Response.json({
      reply,
    });
  } catch (error) {
    console.error("Restore Error:", error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
