import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ reply: "Method not allowed" });
    }

    const { message } = req.body;

    // simple user id (later we upgrade this)
    const userId = "default-user";

    // check stored name
    let name = await kv.get(`user:${userId}:name`);

    // detect name introduction
    if (message.toLowerCase().includes("my name is")) {
      name = message.split("my name is")[1].trim();
      await kv.set(`user:${userId}:name`, name);

      return res.json({
        reply: `Nice to meet you, ${name}. I'll remember that.`
      });
    }

    // greeting behavior
    if (name) {
      return res.json({
        reply: `Welcome back, ${name}. I'm here to help you learn.`
      });
    }

    return res.json({
      reply: "I'm here to help you learn."
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);
    return res.status(500).json({
      reply: "Server error."
    });
  }
}
