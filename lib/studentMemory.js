import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "students.json");

export function loadStudent(id = "default") {
  const raw = fs.readFileSync(dataPath);
  const students = JSON.parse(raw);

  return students[id] || students["default"];
}

// IMPORTANT:
// Vercel serverless functions cannot permanently write files.
// So we simulate saving for now.
export function saveStudent(id, profile) {
  console.log("Student memory updated:", id);
}
