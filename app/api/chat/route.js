import OpenAI from "openai"
import { addMessage, getRecentMessages } from "@/lib/memory"
import { updateLearningProfile, getLearningProfile } from "@/lib/profile"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req) {
  try {
    const body = await req.json()
    const { message, userId } = body

    if (!message || !userId) {
      return new Response("Missing message or userId", { status: 400 })
    }

    // Save user message to memory
    await addMessage(userId, "user", message)

    // -------------------------
    // Identity Extraction
    // -------------------------

    const extraction = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Extract user identity attributes from this message. Return ONLY valid JSON. If nothing extractable, return {}.",
        },
        { role: "user", content: message },
      ],
    })

    let extractedData = {}

    try {
      extractedData = JSON.parse(
        extraction.choices[0].message.content
      )
    } catch {
      extractedData = {}
    }

    // Update learning profile (behavior + identity)
    await updateLearningProfile(userId, message, extractedData)

    // Retrieve updated profile
    const profile = await getLearningProfile(userId)

    // Retrieve memory
    const memory = await getRecentMessages(userId)

    // -------------------------
    // Main AI Response
    // -------------------------

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore AI.

User behavioral profile:
${JSON.stringify(profile)}

Use identity and behavioral signals subtly.
Do NOT list stored data unless directly asked.
Be natural.
`,
        },
        ...memory,
      ],
    })

    const reply = completion.choices[0].message.content

    // Save assistant reply
    await addMessage(userId, "assistant", reply)

    return Response.json({ reply })

  } catch (error) {
    console.error("API ERROR:", error)
    return new Response("Something went wrong.", { status: 500 })
  }
}
