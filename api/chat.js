import fs from "fs";
import path from "path";

const STUDENT_FILE = path.join(process.cwd(), "data", "students.json");

function loadStudents() {
  try {
    return JSON.parse(fs.readFileSync(STUDENT_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveStudents(data) {
  fs.writeFileSync(STUDENT_FILE, JSON.stringify(data, null, 2));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, history, studentId } = req.body;

    // ===== LOAD STUDENT MEMORY =====
    const students = loadStudents();

    if (!students[studentId]) {
      students[studentId] = {
        curiosity: "unknown",
        misconceptions: [],
        interests: [],
        summary: ""
      };
    }

    const student = students[studentId];

    // ===== SYSTEM PROMPT =====
    const systemPrompt = `
You are Restore AI, a curiosity-driven teacher.

Student Profile:
${JSON.stringify(student)}

Goals:
- Teach through questions.
- Encourage thinking, not answers.
- Detect misconceptions gently.
- Update understanding over time.
`;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...history,
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();
    const reply = data.choices[0].message.content;

    // ===== SIMPLE PROFILE UPDATE =====
    if (message.toLowerCase().includes("why")) {
      student.curiosity = "high";
    }

    if (message.toLowerCase().includes("fall faster")) {
      student.misconceptions.push("gravity_speed_confusion");
    }

    student.summary =
      "Student shows curiosity-driven questioning behavior.";

    students[studentId] = student;
    saveStudents(students);

    return res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
