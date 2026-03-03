import OpenAI from "openai"
import { addMessage, getRecentMessages } from "@/lib/memory"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req) {
  try {
    const body = await req.json()
    const { message, userId } = body

    if (!message || !userId) {
      return new Response("Missing data", { status: 400 })
    }

    await addMessage(userId, "user", message)

    const memory = await getRecentMessages(userId)

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Restore AI. You remember user details and respond helpfully.",
        },
        ...memory,
      ],
    })

    const reply = completion.choices[0].message.content

    await addMessage(userId, "assistant", reply)

    return Response.json({ reply })
  } catch (error) {
    console.error("API ERROR:", error)
    return new Response("Something went wrong.", { status: 500 })
  }
}
