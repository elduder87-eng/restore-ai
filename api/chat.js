export default async function handler(req, res) {
  // Allow POST only
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ✅ Fix for Vercel body parsing
    let body = req.body;

    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const { message } = body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // -------------------------
    // SIMPLE RESTORE AI LOGIC
    // -------------------------

    let reply = "";

    const lower = message.toLowerCase();

    if (lower.includes("hello") || lower.includes("hi")) {
      reply = "Hello! What would you like to learn about today?";
    } 
    else if (lower.includes("gravity")) {
      reply =
        "Gravity is a force that pulls objects toward each other. Earth's mass pulls objects toward its center, which is why things fall downward.";
    }
    else if (lower.includes("stop asking questions")) {
      reply =
        "Understood. I will focus on clear explanations instead of questions.";
    }
    else {
      reply =
        "Here is a clear explanation: learning works best when ideas build step by step from simple concepts to deeper understanding.";
    }

    // ✅ Return response
    return res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}
