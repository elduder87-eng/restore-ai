export function detectInsight(message) {
  const text = message.toLowerCase();

  // PERSONAL MEMORY
  if (text.includes("my favorite color is")) {
    return { type: "memory", value: message };
  }

  // LEARNING BEHAVIOR
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
