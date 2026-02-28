export function getConversationStage(messageCount = 0) {
  if (messageCount < 4) return 1;
  if (messageCount < 8) return 2;
  if (messageCount < 15) return 3;
  if (messageCount < 25) return 4;
  return 5;
}

export function stageInstruction(stage) {
  switch (stage) {
    case 1:
      return "Keep responses light, curious, and welcoming.";
    case 2:
      return "Explore ideas more deeply while staying conversational.";
    case 3:
      return "Introduce reflective questions and thoughtful connections.";
    case 4:
      return "Allow emotional and philosophical depth to emerge naturally.";
    case 5:
      return "Engage with warmth, continuity, and genuine conversational presence.";
    default:
      return "";
  }
}
