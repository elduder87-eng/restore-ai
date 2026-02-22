import { loadStudent, saveStudent, updateInsights } from "../lib/studentMemory.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  // Load student memory
  let student = loadStudent("default");

  // Update learning insights
  student = updateInsights(student, message);

  // Save updated memory
  saveStudent("default", student);

  // Teaching style selection
  let reply = "";

  if (student.preferences.style === "direct") {
    reply = directTeaching(message);
  } else {
    reply = guidedTeaching(message);
  }

  res.status(200).json({ reply });
}

/* ---------------- TEACHING MODES ---------------- */

function directTeaching(message) {
  return `I'll explain this simply.

${simpleExplain(message)}

Let me know what you'd like to learn next.`;
}

function guidedTeaching(message) {
  return `That's a great question! Let's think about it together:

1. What do you already know about this topic?
2. Why do you think it works that way?
3. Can you think of an example?

Exploring these ideas helps build understanding.`;
}

/* ---------------- SIMPLE EXPLAINER ---------------- */

function simpleExplain(message) {
  const text = message.toLowerCase();

  if (text.includes("gravity")) {
    return "Gravity is a force that pulls objects toward each other. Earth’s mass pulls things toward its center, which is why objects fall.";
  }

  if (text.includes("plants")) {
    return "Plants need sunlight to make food through photosynthesis, turning light into energy they use to grow.";
  }

  if (text.includes("seasons")) {
    return "Seasons change because Earth is tilted as it orbits the Sun, causing different parts of Earth to receive different amounts of sunlight.";
  }

  if (text.includes("volcano")) {
    return "A volcano is an opening in Earth's crust where molten rock rises and erupts onto the surface.";
  }

  return "Here’s a simple explanation: this topic involves how systems interact through cause and effect.";
}
