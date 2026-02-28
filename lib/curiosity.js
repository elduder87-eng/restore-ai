export function analyzeInterests(memories = []) {
  if (!memories.length) return [];

  const topics = {};

  memories.forEach((m) => {
    const text = m.toLowerCase();

    if (text.includes("astronomy")) {
      topics["astronomy"] = (topics["astronomy"] || 0) + 1;
    }

    if (text.includes("philosophy") || text.includes("existence")) {
      topics["philosophy"] = (topics["philosophy"] || 0) + 1;
    }

    if (text.includes("learn") || text.includes("curious")) {
      topics["learning"] = (topics["learning"] || 0) + 1;
    }
  });

  return Object.entries(topics)
    .sort((a, b) => b[1] - a[1])
    .map(([topic]) => topic);
}

export function generateCuriosity(topics = []) {
  if (!topics.length) return null;

  const top = topics[0];

  const prompts = {
    astronomy:
      "You seem interested in astronomy — what fascinates you most: planets, black holes, or the origin of the universe?",
    philosophy:
      "You seem drawn to philosophical ideas. Do you enjoy questions about consciousness, meaning, or reality itself?",
    learning:
      "You seem naturally curious. What subjects do you find yourself thinking about the most lately?",
  };

  return prompts[top] || null;
}
