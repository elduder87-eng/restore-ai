import { rememberFact, recallMemory } from "../lib/studentMemory.js";
import { generateInsight } from "../lib/insights.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ reply: "Method not allowed" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "No message provided." });
    }

    // 1️⃣ Recall stored memory
    const memoryRecall = await recallMemory(message);
    if (memoryRecall) {
      return res.status(200).json({ reply: memoryRecall });
    }

    // 2️⃣ Store new memory
    const memorySaved = await rememberFact(message);
    if (memorySaved) {
      return res.status(200).json({ reply: memorySaved });
    }

    // 3️⃣ Normal teaching response
    const reply = generateInsight(message);

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("CHAT ERROR:", error);
    return res.status(500).json({
      reply: "Server error. Please try again."
    });
  }
}
