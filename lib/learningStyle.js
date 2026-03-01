export function detectLearningStyle(message, currentStyle = {}) {
  const text = message.toLowerCase();

  let style = {
    simple: currentStyle.simple || 0,
    deep: currentStyle.deep || 0,
    curiosity: currentStyle.curiosity || 0,
    exploratory: currentStyle.exploratory || 0,
    exampleBased: currentStyle.exampleBased || 0,
  };

  // prefers simple explanations
  if (
    text.includes("simple") ||
    text.includes("easy") ||
    text.includes("like i'm") ||
    text.includes("explain simply")
  ) {
    style.simple += 1;
  }

  // deeper thinking
  if (
    text.includes("why") ||
    text.includes("how does") ||
    text.includes("what causes")
  ) {
    style.deep += 1;
  }

  // curiosity signals
  if (
    text.includes("what if") ||
    text.includes("could") ||
    text.includes("i wonder")
  ) {
    style.curiosity += 1;
  }

  // exploration / topic switching
  if (
    text.includes("something else") ||
    text.includes("surprise me") ||
    text.includes("another topic")
  ) {
    style.exploratory += 1;
  }

  // example learner
  if (
    text.includes("example") ||
    text.includes("real world") ||
    text.includes("like")
  ) {
    style.exampleBased += 1;
  }

  return style;
}
