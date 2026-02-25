import OpenAI from "openai";

import {
  getStudent,
  addHistory,
  setName,
  addTopic,
  addInterest,
  addConfusion
} from "../lib/memory.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  try {
    const { message, userId = "default-user" } = req.body;

    const student = getStudent(userId);

    // -------------------------
    // Identity Detection
    // -------------------------
    const nameMatch = message.match(/my name is (\w+)/i);
    if (nameMatch) {
      setName(userId, nameMatch[1]);
    }

    // -------------------------
    // Topic Detection (simple AI brain v1)
    // -------------------------
    const lower = message.toLowerCase();

    if (lower.includes("physics")) addTopic(userId, "Physics");
    if (lower.includes("gravity")) addTopic(userId, "Gravity");
    if (lower.includes("math")) addTopic(userId, "Math");
    if (lower.includes("biology")) addTopic(userId, "Biology");

    // -------------------------
    // Interest Detection
    // -------------------------
    if (lower.includes("i like") || lower.includes("i enjoy")) {
      addInterest(userId, message);
    }

    // -------------------------
    // Confusion Detection
    // -------------------------
    if (
      lower.includes("confused") ||
      lower.includes("don't understand") ||
      lower.includes("hard to understand")
    ) {
      addConfusion(userId, "Needs Review");
    }

    addHistory(userId, "user", message);

    // -------------------------
    // AI RESPONSE
    // -------------------------
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `You are Restore AI, a supportive teacher.

Student name: ${student.name ?? "Unknown"}

Known interests: ${student.interests.join(", ") || "None yet"}
Topics explored: ${student.topics.join(", ") || "None yet"}

Respond naturally and helpfully.`
        },
        ...student.history.slice(-10)
      ]
    });

    const reply = completion.choices[0].message.content;

    addHistory(userId, "assistant", reply);

    res.status(200).json({ reply, student });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
