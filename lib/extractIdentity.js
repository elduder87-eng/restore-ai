// lib/extractIdentity.js

export function extractIdentity(message) {
  const updates = {};

  // Name detection
  const nameMatch = message.match(/my name is (\w+)/i);
  if (nameMatch) {
    updates.name = nameMatch[1];
  }

  // Interest detection
  if (message.toLowerCase().includes("i enjoy")) {
    updates.interests = [message];
  }

  // Goal detection
  if (message.toLowerCase().includes("i want to learn")) {
    updates.learning_goals = [message];
  }

  return updates;
}
