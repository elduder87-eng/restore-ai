export function detectInsight(message) {
  const lower = message.toLowerCase();

  const colorMatch = lower.match(/favorite color is (.+)/);

  if (colorMatch) {
    return {
      key: "favorite color",
      value: colorMatch[1].trim()
    };
  }

  return null;
}
