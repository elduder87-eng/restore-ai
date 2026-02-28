import OpenAI from "openai";

import { getMemory, saveMemory } from "@/lib/memory";
import { getIdentity } from "@/lib/identity";
import { getPersonality } from "@/lib/personality";
import { getLearningProfile } from "@/lib/learningProfile";
import { updateCuriosity } from "@/lib/curiosity";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();
    const userId = "default-user";

    // ======================
    // SAFE LOAD FUNCTIONS
    // ======================

    let memory = "";
    let identity = "";
    let personality = "";
    let learningProfile = "";

    try {
      memory = (await getMemory(userId)) || "";
    } catch (e) {
      console.log("Memory load failed");
    }

    try {
      identity = (await getIdentity(userId)) || "";
    } catch (e) {
      console.log("Identity load failed");
    }

    try {
      personality = (await getPersonality(userId)) || "";
    } catch (e) {
      console.log("Personality load failed");
    }

    try {
      learningProfile = (await getLearningProfile(userId)) || "";
    } catch (e) {
      console.log("Learning profile load failed");
    }

    // ======================
    // SYSTEM PROMPT
    // ======================

    const systemPrompt = `
You are Restore AI — a thoughtful teaching assistant.

IDENTITY:
${identity}

PERSONALITY:
${personality}

LEARNING PROFILE:
${learningProfile}

MEMORY:
${memory}

Be conversational, thoughtful, and curious.
`;

    // ======================
    // OPENAI CALL
    // ======================

    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    const reply =
      completion?.choices?.[0]?.message?.content ||
      "I'm thinking but couldn't finish that response.";

    // ======================
    // SAFE SAVES
    // ======================

    try {
      await saveMemory(userId, message);
    } catch {
      console.log("Memory save failed");
    }

    try {
      await updateCuriosity(userId, message, reply);
    } catch {
      console.log("Curiosity update failed");
    }

    return Response.json({ reply });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    return Response.json({
      reply: "Something went wrong.",
    });
  }
}
