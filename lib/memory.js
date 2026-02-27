export function extractMemory(message) {
  const memory = {};

  // ---- NAME ----
  const nameMatch = message.match(/my name is\s+(\w+)/i);
  if (nameMatch) {
    memory.name = nameMatch[1];
  }

  // ---- LIKES / LOVES ----
  const likeMatch = message.match(/i (like|love)\s+(.+)/i);
  if (likeMatch) {
    memory.preference = likeMatch[2].trim();
  }

  // ---- GOALS ----
  const goalMatch = message.match(/i want to\s+(.+)/i);
  if (goalMatch) {
    memory.goal = goalMatch[1].trim();
  }

  return memory;
}
