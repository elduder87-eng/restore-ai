import fs from "fs";
import path from "path";

const memoryDir = path.join(process.cwd(), "memory");

// ---------- READ ----------
export function readMemory(file) {
  try {
    const filePath = path.join(memoryDir, file);
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.log("Memory read error:", err);
    return null;
  }
}

// ---------- WRITE ----------
export function writeMemory(file, data) {
  try {
    const filePath = path.join(memoryDir, file);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.log("Memory write error:", err);
  }
}
