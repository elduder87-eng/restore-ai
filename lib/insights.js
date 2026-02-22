// lib/insights.js
// Restore AI Learning + Insight Engine

export function extractInsights(messages = []) {
  if (!messages.length) return {};

  const insights = {
    topics: {},
    curiosityScore: 0,
    questionCount: 0,
  };

  const questionWords = [
    "why",
    "how",
    "what",
    "when",
    "where",
    "does",
    "do",
    "can",
  ];

  messages.forEach((msg) => {
    const text = (msg.content || "").toLowerCase();

    // Count questions
    if (questionWords.some((w) => text.includes(w)) || text.includes("?")) {
      insights.questionCount++;
      insights.curiosityScore += 1;
    }

    // Simple topic detection
    const topics = ["gravity", "math", "science", "history", "reading"];

    topics.forEach((topic) => {
      if (text.includes(topic)) {
        insights.topics[topic] =
          (insights.topics[topic] || 0) + 1;
      }
    });
  });

  return insights;
}

export function buildTeacherSummary(insights) {
  if (!insights) return "No insights yet.";

  const topTopic =
    Object.entries(insights.topics || {})
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "exploration";

  return `
Student Curiosity Report:
• Questions Asked: ${insights.questionCount}
• Curiosity Score: ${insights.curiosityScore}
• Primary Interest: ${topTopic}
`;
}
