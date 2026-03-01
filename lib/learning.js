const learningStore = {};

export function getLearning(userId) {
  if (!learningStore[userId]) {
    learningStore[userId] = {};
  }
  return learningStore[userId];
}

export function updateLearning(userId, topic, stage) {
  const learning = getLearning(userId);

  learning[topic] = {
    stage,
    updated: new Date().toISOString()
  };
}

export function summarizeLearning(userId) {
  return getLearning(userId);
}
