export function generateInsight(message) {
  const lower = message.toLowerCase();

  if (lower.includes("stop asking questions")) {
    return "Understood. I will focus on clear explanations instead of questions.";
  }

  if (lower.includes("hello")) {
    return "Hello! What would you like to learn about today?";
  }

  if (lower.includes("gravity")) {
    return "Gravity is a force that pulls objects toward each other. Earth's mass pulls objects toward its center, which is why things fall downward.";
  }

  if (lower.includes("photosynthesis")) {
    return "Photosynthesis is how plants make food using sunlight, water, and carbon dioxide. They turn light energy into sugar for growth.";
  }

  return "Here is a clear explanation: learning works best when ideas connect to understanding.";
}
