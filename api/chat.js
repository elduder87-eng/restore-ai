import { loadStudent, saveStudent } from "../lib/studentMemory.js";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, studentId = "default" } = req.body;

    // ---- LOAD MEMORY ----
    let student = loadStudent(studentId);

    const text = message.toLowerCase();
    let reply = "";

    // ---- LEARNING STYLE DETECTION ----
    if (text.includes("just explain") || text.includes("stop asking")) {
      student.insights.prefersDirectAnswers = true;
    }

    if (text.includes("i'm confused")) {
      student.insights.oftenConfused = true;
    }

    // curiosity tracking
    student.insights.curiosityLevel += 1;

    // ---- RESPONSE STYLE ----
    if (student.insights.prefersDirectAnswers) {

      if (text.includes("gravity")) {
        reply =
          "Gravity is the force that pulls objects toward each other. Earth's gravity pulls things toward the ground.";
      }
      else if (text.includes("volcano")) {
        reply =
          "A volcano is an opening in Earth's crust where magma rises and erupts as lava, ash, and gases.";
      }
      else {
        reply =
          "Here’s a clear explanation: tell me the topic you want to learn, and I’ll explain it simply.";
      }

    } else {

      reply =
        "Interesting question! What do you already know about this topic?";
    }

    // ---- SAVE UPDATED MEMORY ----
    saveStudent(studentId, student);

    return res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ reply: "Server error." });
  }
}
