// lib/curiosity.js

export function addCuriositySeed(response, topic) {
  if (!topic) return response;

  // Keep suggestions subtle (25% chance)
  const shouldAdd = Math.random() < 0.25;
  if (!shouldAdd) return response;

  const curiosityMap = {
    astronomy: [
      "If you're ever interested, we could explore how black holes shape galaxies.",
      "One day we could look at how astronomers discover new planets.",
      "There are fascinating ideas about how the universe began if you'd like to explore them sometime."
    ],

    psychology: [
      "If you're curious someday, we could explore how memory shapes personality.",
      "There are interesting studies about habit formation we could look at later.",
      "We could explore how emotions influence decision-making whenever you want."
    ],

    science: [
      "We could explore how scientists test ideas through real experiments sometime.",
      "There are surprising connections between different sciences if you're ever curious."
    ]
  };

  const seeds = curiosityMap[topic];
  if (!seeds) return response;

  const seed =
    seeds[Math.floor(Math.random() * seeds.length)];

  return `${response}\n\n${seed}`;
}
