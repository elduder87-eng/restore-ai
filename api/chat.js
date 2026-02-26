import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // -----------------------------
    // LOAD MEMORY
    // -----------------------------
    let profile = await redis.get("student:profile");

    if (!profile) {
      profile = {
        name: null,
        interests: []
      };
    }

    // -----------------------------
    // SIMPLE IDENTITY EXTRACTION
    // -----------------------------
    const nameMatch = message.match(/my name is (\w+)/i);

    if (nameMatch) {
      profile.name = nameMatch[1];
      await redis.set("student:profile", profile);
    }

    const interestMatch = message.match(/i love (\w+)/i);

    if (interestMatch) {
      profile.interests.push(interestMatch[1]);
      await redis.set("student:profile", profile);
    }

    // -----------------------------
    // RESPONSE
    // -----------------------------
    let reply = "I'm here to help you learn.";

    if (profile.name) {
      reply = `Nice to keep learning with you, ${profile.name}.`;
    }

    return res.status(200).json({
      reply,
      profile
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
}
