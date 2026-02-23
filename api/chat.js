import OpenAI from "openai";
import { getStudentMemory, saveStudentMemory } from "../lib/studentMemory";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message } = req.body;

    const studentId = "default-student";

    // ✅ get memory safely
    let memory = "";
    try {
      memory = await getStudentMemory(studentId);
    } catch (e) {
      console.log("Memory read failed:", e);
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Restore AI, a calm teacher who explains clearly and simply.",
        },
        {
          role: "system",
          content: `Student memory: ${memory}`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    // ✅ save memory safely (non-blocking)
    try {
      const updatedMemory = memory + "\n" + message;
      await saveStudentMemory(studentId, updatedMemory);
    } catch (e) {
      console.log("Memory save failed:", e);
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({
      reply: "Server error. Please try again.",
    });
  }
}
