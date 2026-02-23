import OpenAI from "openai";
import { getStudentMemory, saveStudentMemory } from "../lib/studentMemory";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const { message } = req.body;

    const studentId = "default-student";

    // ✅ Load memory
    const memory = await getStudentMemory(studentId);

    const systemPrompt = `
You are Restore AI, a calm teacher.
You remember past conversations and adapt explanations
to the student's learning style.

Student Memory:
${memory || "No prior memory yet."}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    // ✅ Save updated memory
    await saveStudentMemory(
      studentId,
      (memory || "") + `\nStudent: ${message}\nAI: ${reply}`
    );

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Server error. Please try again." });
  }
}
