import { NextResponse } from "next/server"
import { updateIdentity, getIdentity } from "@/lib/identity"
import { addMessage, getRecentMessages } from "@/lib/memory"
import { detectLearningStyle, updateLearningStyle, getLearningStyle } from "@/lib/learning"

export async function POST(req) {
  try {
    const { message } = await req.json()

    await addMessage("user", message)
    await updateIdentity(message)

    const style = detectLearningStyle(message)
    await updateLearningStyle(style)

    const identity = await getIdentity()
    const history = await getRecentMessages()
    const learning = await getLearningStyle()

    let reply = "I understand."

    if (message.toLowerCase().includes("what do you know about me")) {
      const parts = []

      if (identity.favoriteColor)
        parts.push(`Your favorite color is ${identity.favoriteColor}.`)
      if (identity.favoriteAnimal)
        parts.push(`Your favorite animal is ${identity.favoriteAnimal}.`)
      if (identity.favoriteFood)
        parts.push(`Your favorite food is ${identity.favoriteFood}.`)
      if (identity.hobby)
        parts.push(`Your hobby is ${identity.hobby}.`)
      if (identity.goal)
        parts.push(`Your goal is ${identity.goal}.`)

      reply = parts.length > 0
        ? parts.join(" ")
        : "I don't know much about you yet."
    }

    if (learning !== "neutral") {
      reply += ` (Responding in ${learning} style.)`
    }

    await addMessage("assistant", reply)

    return NextResponse.json({ reply })

  } catch (error) {
    console.error("API ERROR:", error)
    return NextResponse.json({ reply: "Something went wrong." }, { status: 500 })
  }
}
