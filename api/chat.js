import OpenAI from "openai";
import { saveMemory, getMemory } from "../lib/memory.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  const userId = "default-user";

  // ---- Identity Detection ----
  const nameMatch = message.match(/my name is (\w+)/i);

  if (nameMatch) {
    saveMemory(userId, "name", nameMatch[1]);
  }

  const storedName = getMemory(userId, "name");

  const systemPrompt = `
You are Restore AI, a calm educational assistant.
${storedName ? `The user's name is ${storedName}. Use it naturally.` : ""}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "AI error occurred." });
  }
}
