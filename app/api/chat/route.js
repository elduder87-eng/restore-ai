export const runtime = "edge";

export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are Restore AI in Teacher Mode. Be calm, clear, and helpful.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    return new Response(
      JSON.stringify({
        reply: data.choices?.[0]?.message?.content || "No response",
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Server crashed",
        details: String(error),
      }),
      { status: 500 }
    );
  }
}
