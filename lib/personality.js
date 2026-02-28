// lib/personality.js

/**
 * Analyze stored memories and infer personality traits
 */
export function buildPersonality(memories = []) {
  if (!memories.length) return "";

  const traits = [];

  const text = memories.join(" ").toLowerCase();

  // ---------- Intellectual interests ----------
  if (text.includes("interstellar") ||
      text.includes("physics") ||
      text.includes("science"))
    traits.push("interested in science and big ideas");

  // ---------- Reflective thinking ----------
  if (text.includes("why") || text.includes("how"))
    traits.push("a reflective thinker");

  // ---------- Philosophy detection (NEW) ----------
  if (
    text.includes("philosophy") ||
    text.includes("philosophical")
  )
    traits.push("enjoys deep philosophical conversations");

  // ---------- Food interests ----------
  if (text.includes("sushi") ||
      text.includes("pizza") ||
      text.includes("food"))
    traits.push("enjoys exploring different foods");

  // ---------- Preferences sharing ----------
  if (text.includes("favorite"))
    traits.push("comfortable sharing personal preferences");

  // Remove duplicates
  const uniqueTraits = [...new Set(traits)];

  if (!uniqueTraits.length) return "";

  return `
User Personality Profile:
The user appears to be someone who is ${uniqueTraits.join(", ")}.
Adapt responses to match this personality — thoughtful, personal, and natural.
`;
}
