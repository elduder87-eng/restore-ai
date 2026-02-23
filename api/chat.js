import OpenAI from "openai";
import { saveMemory } from "../lib/studentMemory.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const userId = "default-user";

    // ---- MEMORY DETECTION ----
    try {
      if (message.toLowerCase().includes("my favorite color is")) {
        const color = message.split("is")[1]?.trim();
        if (color) {
          await saveMemory(userId, "favoriteColor", color);
        }
      }
    } catch (memoryError) {
      console.error("Memory failed but continuing:", memoryError);
    }

    // ---- AI RESPONSE ----
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Restore AI, a teacher that explains concepts clearly and simply without asking unnecessary questions.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("CHAT API ERROR:", error);
    return res.status(500).json({
      reply
