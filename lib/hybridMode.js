// lib/hybridMode.js

export function chooseMode(message) {
  const text = message.toLowerCase()

  const knowledgeSignals = [
    "explain",
    "how does",
    "what is",
    "teach",
    "example",
    "why does"
  ]

  const reflectionSignals = [
    "i wonder",
    "i feel",
    "what do you think",
    "meaning",
    "purpose"
  ]

  const struggleSignals = [
    "confused",
    "don't understand",
    "hard",
    "stuck"
  ]

  if (struggleSignals.some(w => text.includes(w))) {
    return "support-first"
  }

  if (reflectionSignals.some(w => text.includes(w))) {
    return "companion-lean"
  }

  if (knowledgeSignals.some(w => text.includes(w))) {
    return "teacher-lean"
  }

  return "balanced"
}
