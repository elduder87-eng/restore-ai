import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data/students.json");

function loadStudents() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveStudents(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, history = [], studentId } = req.body;

    const students = loadStudents();

    if (!students[studentId]) {
      students[studentId] = {
        curiosityScore: 0,
        topics: [],
        misconceptions: [],
        lastSummary: ""
      };
    }

    const profile = students[studentId];

    // ===== SIMPLE LEARNING SIGNALS =====
    const text = message.toLowerCase();

    if (text.includes("?")) profile.curiosityScore++;

    if (text.includes("gravity") && !profile.topics.includes("gravity"))
      profile.topics.push("gravity");

    if (text.includes("fall faster"))
      profile.misconceptions.push("gravity_speed");

    // ===== SYSTEM PROMPT =====
    const systemPrompt = `
You are Restore AI, a curiosity-driven teacher.

Student Learning Profile:
${JSON.stringify(profile)}

Use this profile to adapt explanations.
Encourage thinking before answering.
Guide understanding step-by-step.
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
          temperature: 0.7,
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

    // Update summary
    profile.lastSummary =
      "Student shows curiosity-driven exploration.";

    students[studentId] = profile;
    saveStudents(students);

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
