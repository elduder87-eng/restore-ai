// lib/conversationState.js

/**
 * Restore Conversation State
 * Determines guidance subtlety based on conversation signals
 */

export function analyzeConversation(message) {
  const text = message.toLowerCase();

  let learning = 0;
  let curiosity = 0;
  let personal = 0;

  // Learning signals
  if (
    text.includes("explain") ||
    text.includes("how") ||
    text.includes("why") ||
    text.includes("teach")
  ) {
    learning += 2;
  }

  // Curiosity signals
  if (
    text.includes("wonder") ||
    text.includes("what if") ||
    text.includes("interesting") ||
    text.includes("curious")
  ) {
    curiosity += 2;
  }

  // Personal signals
  if (
    text.includes("i feel") ||
    text.includes("i like") ||
    text.includes("i enjoy") ||
    text.includes("my")
  ) {
    personal += 2;
  }

  return {
    learning,
    curiosity,
    personal,
  };
}

/**
 * Determines subtle guidance strength
 */
export function guidanceLevel(scores) {
  const total = scores.learning + scores.curiosity + scores.personal;

  if (total === 0) return "minimal";

  if (scores.learning >= scores.curiosity)
    return "educational-soft";

  if (scores.curiosity > scores.learning)
    return "exploratory-soft";

  return "balanced-soft";
}
