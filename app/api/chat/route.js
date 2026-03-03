import OpenAI from "openai"
import { addMessage, getRecentMessages } from "@/lib/memory"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req) {
  try {
    const body = await req.json()
    const { message } = body

    if (!message) {
      return new Response("No message provided", { status: 400 })
    }

    // Save user message
    await addMessage("user", message)

    // Get recent memory
    const memory = await getRecentMessages()

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Restore AI. You remember details about the user and answer helpfully.",
        },
        ...memory,
      ],
    })

    const reply = completion.choices[0].message.content

    // Save assistant reply
    await addMessage("assistant", reply)

    return Response.json({ reply })
  } catch (error) {
    console.error("API ERROR:", error)
    return new Response("Something went wrong.", { status: 500 })
  }
}
