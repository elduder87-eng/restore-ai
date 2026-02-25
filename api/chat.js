// api/chat.js

import OpenAI from "openai";
import { getIdentity, saveIdentity } from "../data/identity.js";
import { extractIdentity } from "../lib/extractIdentity.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    // Allow only POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // -----------------------------
    // STEP 1 — Load Identity Memory
    // -----------------------------
    // (Later this becomes real login ID)
    const userId = "demo-user";

    const identity = await getIdentity(userId);

    // -----------------------------
    // STEP 2 — Ask OpenAI
    // -----------------------------
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore AI — a supportive teaching assistant.

You remember student identity and personalize learning.

Student identity:
${JSON.stringify(identity)}

Use this information naturally when helpful.
`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    // -----------------------------
    // STEP 3 — Update Identity Memory
    // -----------------------------
    const updates = extractIdentity(message);

    const newIdentity = {
      ...identity,
      ...updates,
    };

    await saveIdentity(userId, newIdentity);

    // -----------------------------
    // STEP 4 — Return Response
    // -----------------------------
    return res.status(200).json({
      reply,
    });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
}
