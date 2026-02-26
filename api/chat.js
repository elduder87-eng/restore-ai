export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  let reply = "I'm here to help you learn.";

  // Detect name
  const nameMatch = message.match(/my name is (.+)/i);

  if (nameMatch) {
    const name = nameMatch[1].trim();

    // SAVE NAME TO PROFILE API
    await fetch(`${process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : ""}/api/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    reply = `Nice to meet you, ${name}.`;
  }

  // Detect interest
  const interestMatch = message.match(/i enjoy (.+)/i);

  if (interestMatch) {
    const interest = interestMatch[1].trim();

    await fetch(`${process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : ""}/api/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ interest }),
    });

    reply = `I remember you enjoy ${interest}.`;
  }

  res.status(200).json({ reply });
}
