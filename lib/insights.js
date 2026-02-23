export function detectInsight(message) {
  const text = message.toLowerCase();

  if (text.includes("my favorite color is")) {
    return message;
  }

  if (text.includes("i like")) {
    return message;
  }

  if (text.includes("i am")) {
    return message;
  }

  return null;
}
