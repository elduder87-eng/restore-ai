import { NextResponse } from "next/server"
import { updateIdentity, getIdentity } from "@/lib/identity"

export async function POST(req) {
  try {
    const { message } = await req.json()

    // Update identity if user shares info
    await updateIdentity(message)

    const identity = await getIdentity()

    let reply = "I understand."

    if (message.toLowerCase().includes("what do you know about me")) {
      const parts = []

      if (identity.favoriteColor)
        parts.push(`Your favorite color is ${identity.favoriteColor}.`)

      if (identity.favoriteAnimal)
        parts.push(`Your favorite animal is ${identity.favoriteAnimal}.`)

      reply = parts.length > 0
        ? parts.join(" ")
        : "I don't know much about you yet."
    }

    return NextResponse.json({ reply })

  } catch (error) {
    console.error("API ERROR:", error)
    return NextResponse.json(
      { reply: "Something went wrong." },
      { status: 500 }
    )
  }
}
