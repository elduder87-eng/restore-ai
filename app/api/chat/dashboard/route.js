import { getRecentMessages } from "@/lib/memory"
import { getLearningProfile } from "@/lib/profile"
import { analyzeThinkingSignals } from "@/lib/thinkingSignals"

export async function GET() {
  try {
    const userId = "default-user"

    const messages = await getRecentMessages(userId)
    const profile = await getLearningProfile(userId)

    const signals = analyzeThinkingSignals(messages || [], profile || {})

    return Response.json(signals)
  } catch (error) {
    return Response.json({ error: "Dashboard failed" }, { status: 500 })
  }
}
