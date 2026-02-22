import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "students.json");

export function loadStudent(id = "default") {
  const raw = fs.readFileSync(dataPath, "utf-8");
  const students = JSON.parse(raw);

  return students[id] || students["default"];
}

export function saveStudent(id, profile) {
  const raw = fs.readFileSync(dataPath, "utf-8");
  const students = JSON.parse(raw);

  students[id] = profile;

  fs.writeFileSync(dataPath, JSON.stringify(students, null, 2));
}
