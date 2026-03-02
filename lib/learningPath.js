import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "memory", "learningPath.json");

function ensureFile() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ paths: {} }, null, 2));
  }
}

export function getLearningPaths() {
  ensureFile();
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function updateLearningPath(topic) {
  ensureFile();

  const data = getLearningPaths();

  if (!data.paths[topic]) {
    data.paths[topic] = {
      mentions: 1,
      suggested: false
    };
  } else {
    data.paths[topic].mentions += 1;
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function getSuggestion() {
  const data = getLearningPaths();

  for (const topic in data.paths) {
    const entry = data.paths[topic];

    // Suggest after repeated curiosity
    if (entry.mentions >= 2 && !entry.suggested) {
      entry.suggested = true;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      return topic;
    }
  }

  return null;
}
