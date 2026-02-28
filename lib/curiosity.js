/*
  Curiosity + Signal Detection Engine
*/

export function detectCuriosity(message) {
  const text = message.toLowerCase();

  if (
    text.includes("why") ||
    text.includes("meaning") ||
    text.includes("exist")
  ) {
    return "philosophical";
  }

  if (
    text.includes("how") ||
    text.includes("learn")
  ) {
    return "exploratory";
  }

  return "general";
}

/*
  Stage 13 — Adaptation Signals
*/

export function detectAdaptationSignals(message) {
  const text = message.toLowerCase();

  const signals = {};

  if (
    text.includes("why") ||
    text.includes("meaning") ||
    text.includes("exist")
  ) {
    signals.reflection = 1;
  }

  if (
    text.includes("how") ||
    text.includes("learn")
  ) {
    signals.exploration = 1;
  }

  if (
    text.includes("feel") ||
    text.includes("emotion") ||
    text.includes("struggle")
  ) {
    signals.empathy = 1;
  }

  if (
    text.includes("code") ||
    text.includes("system") ||
    text.includes("build")
  ) {
    signals.structure = 1;
  }

  return signals;
}
