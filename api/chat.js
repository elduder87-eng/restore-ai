import { loadStudent, saveStudent } from "../lib/studentMemory.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    // Load student profile
    let student = loadStudent("default");

    const text = message.toLowerCase();

    // --- Learning Detection ---
    if (text.includes("stop asking") || text.includes("just explain")) {
      student.insights.prefersDirectAnswers = true;
    }

    if (text.includes("confused")) {
      student.insights.oftenConfused = true;
    }

    if (text.includes("?")) {
      student.insights.curiosityLevel += 1;
    }

    // Save (simulated for now)
    saveStudent("default", student);

    // --- Teaching Style Selection ---
    let reply = "";

    if (student.insights.prefersDirectAnswers) {
      reply =
        "Here is a clear explanation: Gravity is a force that pulls objects toward each other. Earth's mass pulls objects toward its center, which is why things fall downward.";
    } else {
      reply =
        "Let's think about this together. What do you already know about gravity, and how might it affect objects differently?";
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ reply: "Server error." });
  }
}
