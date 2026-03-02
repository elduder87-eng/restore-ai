import OpenAI from "openai";
import { saveMemory, getMemory } from "@/lib/memory";
import {
  updateLearningProfile,
  getLearningProfile
} from "@/lib/profile";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    // Save memory
    await saveMemory(userId, message);

    // Update learning profile
    await updateLearningProfile(userId, message);

    // Retrieve stored data
    const memory = await getMemory(userId);
    const profile = await getLearningProfile(userId);

    const memoryContext = memory
      ? `User interests: ${memory.interests.join(", ")}`
      : "No stored interests yet.";

    const systemPrompt = `
You are Restore AI, a personalized teacher.

Learner Memory:
${memoryContext}

Learning Profile:
${JSON.stringify(profile)}

Teaching Rules:
- Adapt explanations to curiosity and depth preference.
- Be encouraging and educational.
- Act like a supportive teacher.
`;

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
