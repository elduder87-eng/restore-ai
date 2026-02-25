// Simple in-memory learning profile store

const learningProfiles = {};

export function getLearningProfile(userId) {
  if (!learningProfiles[userId]) {
    learningProfiles[userId] = {
      interests: [],
      goals: [],
      confusions: []
    };
  }

  return learningProfiles[userId];
}

export function updateLearningProfile(userId, message) {
  const profile = getLearningProfile(userId);

  const text = message.toLowerCase();

  // Detect interests
  if (
    text.includes("i like") ||
    text.includes("i enjoy") ||
    text.includes("i love")
  ) {
    profile.interests.push(message);
  }

  // Detect goals
  if (
    text.includes("i want to learn") ||
    text.includes("i want to understand") ||
    text.includes("my goal")
  ) {
    profile.goals.push(message);
  }

  // Detect confusion
  if (
    text.includes("i don't understand") ||
    text.includes("im confused") ||
    text.includes("this is confusing")
  ) {
    profile.confusions.push(message);
  }

  return profile;
}
