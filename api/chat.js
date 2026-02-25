function analyzeLearningSignals(message) {
  const text = message.toLowerCase();

  let signals = {};

  // curiosity detection
  if (text.includes("why") || text.includes("how")) {
    signals.engagement = "high";
  }

  // beginner signals
  if (text.includes("simple") || text.includes("explain like")) {
    signals.depth_preference = "beginner";
  }

  // advanced signals
  if (text.includes("deep") || text.includes("advanced")) {
    signals.depth_preference = "advanced";
  }

  // interest detection
  if (text.includes("i enjoy") || text.includes("i like")) {
    signals.learning_style = "exploratory";
  }

  // goal detection
  if (text.includes("i want to learn")) {
    signals.motivation = "goal_oriented";
  }

  return signals;
}
