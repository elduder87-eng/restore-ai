export function generateSuggestion(memory) {
  if (!memory || !memory.interests) return null;

  const interests = memory.interests;

  // Cross-discipline suggestion
  if (
    interests.includes("astronomy") &&
    interests.includes("biology")
  ) {
    return "Since you enjoy both astronomy and biology, one day we could explore astrobiology — the study of life beyond Earth.";
  }

  if (interests.includes("astronomy")) {
    return "If you'd like someday, we could explore topics like black holes, exoplanets, or how stars are born.";
  }

  if (interests.includes("biology")) {
    return "If you're interested, we could explore genetics, ecosystems, or how cells communicate.";
  }

  return null;
}
