export function detectInsight(message) {
  const lower = message.toLowerCase();

  // favorite color memory
  if (lower.includes("favorite color is")) {
    const color = lower.split("favorite color is")[1].trim();
    return {
      type: "memory",
      key: "favorite_color",
      value: color,
    };
  }

  return null;
}
