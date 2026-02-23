import OpenAI from "openai";
import { getMemories, saveMemory } from "../lib/studentMemory.js";
import {
  saveLearningPreference,
  getLearningProfile,
} from "../lib/learningProfile.js";
import { detectInsight } from "../lib/insights.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "No message provided." });
    }

    const session = sessionId || "default";

    // Detect insights
    const insight = detectInsight(message);

    if (insight) {
      if (insight.type === "memory") {
        await saveMemory(session, insight.value);
      }

      if (insight.type === "learning") {
        await saveLearningPreference(session, insight.value);
      }
    }

    // Load stored data
    const memories = await getMemories(session);
    const learningProfile = await getLearningProfile(session);

    const systemPrompt = `
You are Restore AI, a supportive teaching assistant.

Student facts:
${memories.join("\n")}

Learning preferences:
${learningProfile.join("\n")}

Teach clearly and adapt explanations to the learner.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      reply: "Server error. Please try again.",
    });
  }
}
