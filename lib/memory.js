export function extractMemory(message) {
  const memory = {};

  const lower = message.toLowerCase();

  // name detection
  const nameMatch = message.match(/my name is (\w+)/i);
  if (nameMatch) {
    memory.name = nameMatch[1];
  }

  // preference detection
  if (lower.includes("i like") || lower.includes("i love")) {
    const pref = message.replace(/.*(i like|i love)/i, "").trim();
    memory.preference = pref;
  }

  // goal detection
  if (lower.includes("i want to")) {
    const goal = message.replace(/.*i want to/i, "").trim();
    memory.goal = goal;
  }

  return memory;
}
