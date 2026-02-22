import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "students.json");

// Load student profile
export function loadStudent(id = "default") {
  try {
    const raw = fs.readFileSync(dataPath);
    const students = JSON.parse(raw);

    return (
      students[id] || {
        learningStyle: "guided",
        confusionLevel: "medium",
        preferences: "interactive",
        lastTopic: ""
      }
    );
  } catch {
    return {
      learningStyle: "guided",
      confusionLevel: "medium",
      preferences: "interactive",
      lastTopic: ""
    };
  }
}

// Save student profile
export function saveStudent(id, profile) {
  let students = {};

  try {
    const raw = fs.readFileSync(dataPath);
    students = JSON.parse(raw);
  } catch {}

  students[id] = profile;

  fs.writeFileSync(dataPath, JSON.stringify(students, null, 2));
}
