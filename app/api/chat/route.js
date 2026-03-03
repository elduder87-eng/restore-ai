import OpenAI from "openai"
import { addMessage, getRecentMessages } from "@/lib/memory"
import { updateLearningProfile } from "@/lib/profile"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req) {
  try {
    const { message, userId } = await req.json()

    if (!message || !userId) {
      return Response.json({
        reply: "I need a message and user ID to continue."
      })
    }

    // ---------- SAFE MEMORY LOAD ----------
    let history = []
    try {
      history = await getRecentMessages(userId)
    } catch (err) {
      console.error("Memory Load Error:", err)
    }

    // ---------- SAFE PROFILE UPDATE ----------
    try {
      await updateLearningProfile(userId, message)
    } catch (err) {
      console.error("Profile Update Error:", err)
    }

    // ---------- SAFE OPENAI CALL ----------
    let aiResponse = "I'm here — something small glitched. Let's try that again."

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are Restore — warm, intelligent, supportive, never overbearing. Encourage deeper thinking naturally."
          },
          ...history,
          { role: "user", content: message }
        ],
      })

      aiResponse = completion.choices[0].message.content
    } catch (err) {
      console.error("OpenAI Error:", err)
    }

    // ---------- SAFE MEMORY SAVE ----------
    try {
      await addMessage(userId, "user", message)
      await addMessage(userId, "assistant", aiResponse)
    } catch (err) {
      console.error("Memory Save Error:", err)
    }

    return Response.json({ reply: aiResponse })

  } catch (err) {
    console.error("Critical Chat Error:", err)

    return Response.json({
      reply:
        "I hit a small technical hiccup, but I’m still here. Let’s try that again."
    })
  }
}
