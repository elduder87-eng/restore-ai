import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "students.json");

// Load student profile
export function loadStudent(id = "default") {
  const raw = fs.readFileSync(dataPath);
  const students = JSON.parse(raw);

  return students[id] || students["default"];
}

// Save updated student profile
export function saveStudent(id, profile) {
  const raw = fs.readFileSync(dataPath);
  const students = JSON.parse(raw);

  students[id] = profile;

  fs.writeFileSync(dataPath, JSON.stringify(students, null, 2));
}

// Update learning insights automatically
export function updateInsights(profile, message) {
  const text = message.toLowerCase();

  // Detect preference for direct answers
  if (
    text.includes("just explain") ||
    text.includes("stop asking") ||
    text.includes("just tell me")
  ) {
    profile.insights.prefersDirectAnswers = true;
    profile.preferences.style = "direct";
  }

  // Detect confusion
  if (text.includes("i'm confused") || text.includes("dont understand")) {
    profile.insights.oftenConfused = true;
  }

  return profile;
}
