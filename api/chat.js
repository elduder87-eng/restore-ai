import OpenAI from "openai";

import {
  getIdentity,
  updateIdentity
} from "../data/identityMemory.js";

import {
  getLearningProfile,
  updateLearningProfile
} from "../data/learningMemory.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const userId = "default-user";

    // --- Identity Memory ---
    const identity = updateIdentity(userId, message);

    // --- Learning Memory ---
    const learningProfile =
      updateLearningProfile(userId, message);

    // --- Build system context ---
    const systemMessage = `
You are Restore AI, a personalized learning teacher.

Student name: ${identity.name || "Unknown"}

Known Interests:
${learningProfile.interests.join("\n")}

Learning Goals:
${learningProfile.goals.join("\n")}

Confusion Areas:
${learningProfile.confusions.join("\n")}

Teach in a supportive, adaptive way.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message }
      ]
    });

    res.status(200).json({
      reply: completion.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error"
    });
  }
}
