export function buildPersonality(memories = []) {
  const text = memories.join(" ").toLowerCase();

  const traits = [];

  // interests
  if (text.includes("interstellar") || text.includes("science"))
    traits.push("enjoys deep and intellectual topics");

  if (text.includes("sushi") || text.includes("food"))
    traits.push("likes exploration and new experiences");

  if (text.includes("favorite"))
    traits.push("comfortable sharing personal preferences");

  // thinking style
  if (text.includes("why") || text.includes("how"))
    traits.push("curious and reflective thinker");

  if (traits.length === 0)
    traits.push("friendly and open conversational partner");

  return traits;
}

export function buildSystemPrompt(traits) {
  return `
You are Restore AI.

Adapt your communication style to the user.

User personality traits:
${traits.map(t => `- ${t}`).join("\n")}

Behavior Rules:
- Speak naturally and conversationally.
- Match depth to user's curiosity.
- Be thoughtful but concise.
- Act like a learning companion, not an assistant.
`;
}
