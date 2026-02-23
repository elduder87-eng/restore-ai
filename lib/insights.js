export function detectInsight(message) {
  const text = message.toLowerCase();

  // Personal facts
  if (text.includes("my favorite color is")) {
    return { type: "memory", value: message };
  }

  // Learning preferences
  if (text.includes("stop asking questions")) {
    return { type: "learning", value: "prefers explanations" };
  }

  if (text.includes("explain simply")) {
    return { type: "learning", value: "needs simple explanations" };
  }

  if (text.includes("short answers")) {
    return { type: "learning", value: "prefers concise responses" };
  }

  return null;
}
