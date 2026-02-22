// lib/insights.js

export function analyzeConversation(messages) {
  if (!messages || messages.length === 0) {
    return {
      topic: "unknown",
      curiosityLevel: 0,
      confusionSignals: 0,
      learningMode: "exploration"
    };
  }

  const text = messages.map(m => m.content.toLowerCase()).join(" ");

  // Topic detection (very simple starter logic)
  let topic = "general";
  if (text.includes("gravity")) topic = "gravity";
  if (text.includes("plant") || text.includes("sunlight")) topic = "plants";
  if (text.includes("colonists") || text.includes("rebel")) topic = "history";

  // Curiosity detection
  const curiosityWords = ["why", "how", "what", "explain"];
  const curiosityLevel = curiosityWords.reduce(
    (count, word) => count + (text.match(new RegExp(word, "g")) || []).length,
    0
  );

  // Confusion detection
  const confusionWords = ["don't understand", "confused", "what do you mean"];
  const confusionSignals = confusionWords.reduce(
    (count, phrase) => count + (text.includes(phrase) ? 1 : 0),
    0
  );

  // Learning mode
  let learningMode = "exploration";
  if (text.includes("explain directly")) learningMode = "instruction";

  return {
    topic,
    curiosityLevel,
    confusionSignals,
    learningMode
  };
}
