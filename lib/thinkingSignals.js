export function analyzeThinkingSignals(messages, profile) {
  const combinedText = messages
    .filter(m => m.role === "user")
    .map(m => m.content.toLowerCase())
    .join(" ")

  const questionCount = (combinedText.match(/\?/g) || []).length

  let curiosityLevel = "emerging"
  if (questionCount > 3) curiosityLevel = "steady"
  if (questionCount > 6) curiosityLevel = "deepening"

  let engagementMode = profile?.engagement_style || "guided"

  let growthSignals = []

  if (combinedText.includes("why") || combinedText.includes("how")) {
    growthSignals.push("Exploring underlying reasoning")
  }

  if (combinedText.includes("also") || combinedText.includes("connect")) {
    growthSignals.push("Building cross-topic connections")
  }

  if (questionCount > 5) {
    growthSignals.push("Increased question frequency")
  }

  if (growthSignals.length === 0) {
    growthSignals.push("Steady engagement pattern")
  }

  // Very simple emotional tone detection
  let emotionalTone = "curious"

  if (combinedText.includes("confused") || combinedText.includes("don't understand")) {
    emotionalTone = "processing"
  }

  if (combinedText.includes("frustrated")) {
    emotionalTone = "challenged but engaged"
  }

  return {
    curiosityLevel,
    engagementMode,
    growthSignals,
    emotionalTone
  }
}
