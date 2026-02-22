export default async function handler(req, res) {

  // Allow POST requests only
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "No message received." });
    }

    // ---- SIMPLE RESTORE AI RESPONSE ENGINE ----
    // (Temporary brain — we upgrade next step)

    let reply = "";

    const text = message.toLowerCase();

    if (text.includes("hello") || text.includes("hi")) {
      reply = "Hello! What would you like to learn about today?";
    } 
    else if (text.includes("volcano")) {
      reply =
        "A volcano is an opening in Earth's crust where molten rock, ash, and gases escape. They usually form near tectonic plate boundaries.";
    }
    else if (text.includes("gravity")) {
      reply =
        "Gravity is the force that pulls objects toward each other. On Earth, it pulls things toward the planet's center.";
    }
    else {
      reply =
        "That's an interesting question. Can you tell me a little more about what you'd like to understand?";
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ reply: "Something went wrong." });
  }
}
