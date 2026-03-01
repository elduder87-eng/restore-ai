// lib/topic.js

// Detects conversational topic from user messages

const TOPIC_KEYWORDS = {
  astronomy: [
    "space",
    "planet",
    "star",
    "galaxy",
    "black hole",
    "universe",
    "orbit",
    "cosmos",
    "astronomy"
  ],
  psychology: [
    "mind",
    "behavior",
    "emotion",
    "brain",
    "psychology",
    "memory",
    "thinking"
  ],
  biology: [
    "plant",
    "animal",
    "cell",
    "life",
    "photosynthesis",
    "evolution"
  ],
  physics: [
    "gravity",
    "energy",
    "force",
    "motion",
    "relativity"
  ]
};

export function detectTopic(message) {
  const text = message.toLowerCase();

  for (const topic in TOPIC_KEYWORDS) {
    for (const keyword of TOPIC_KEYWORDS[topic]) {
      if (text.includes(keyword)) {
        return topic;
      }
    }
  }

  return null;
}
