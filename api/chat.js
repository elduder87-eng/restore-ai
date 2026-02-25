export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message, memory } = req.body;

    // -----------------------------
    // MEMORY
    // -----------------------------

    let studentName = memory?.name || null;
    let interests = memory?.interests || [];

    const lower = message.toLowerCase();

    // Learn name
    const nameMatch = message.match(/my name is (\w+)/i);
    if (nameMatch) {
      studentName = nameMatch[1];
    }

    // Learn interests
    if (lower.includes("i enjoy") || lower.includes("i like")) {
      const interest = message
        .replace(/i enjoy|i like/i, "")
        .trim();

      if (!interests.includes(interest)) {
        interests.push(interest);
      }
    }

    // -----------------------------
    // MEMORY CONTEXT
    // -----------------------------

    let memoryContext = "";

    if (studentName) {
      memoryContext += `The student's name is ${studentName}. `;
    }

    if (interests.length > 0) {
      memoryContext += `The student enjoys ${interests.join(", ")}. `;
    }

    // -----------------------------
    // DIRECT MEMORY QUESTION
    // -----------------------------

    if (lower.includes("what is my name")) {
      return res.status(200).json({
        reply: studentName
          ? `Your name is ${studentName}.`
          : "I don't know your name yet.",
        memory: { name: studentName, interests }
      });
    }

    // -----------------------------
    // OPENAI CALL
    // -----------------------------

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          input: `
You are Restore AI, a supportive learning companion.

${memoryContext}

Student: ${message}
Respond helpfully and warmly.
`
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.output?.[0]?.content?.[0]?.text ||
      "I'm here to help you learn.";

    return res.status(200).json({
      reply,
      memory: {
        name: studentName,
        interests
      }
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);

    return res.status(200).json({
      reply: "I'm here to help you learn.",
      memory: {}
    });
  }
}
