import { saveStudent } from "./teacher.js";

let studentName = null;
let interests = [];
let learningProfile = {
  topics: [],
  curiosityScore: 0
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;
    const text = message.toLowerCase();

    let reply = "I'm here to help you learn.";

    // ---------- NAME MEMORY ----------
    const nameMatch = text.match(/my name is (\w+)/i);
    if (nameMatch) {
      studentName =
        nameMatch[1].charAt(0).toUpperCase() +
        nameMatch[1].slice(1);

      reply = `Hello ${studentName}! How can I help you learn today?`;
    }

    if (text.includes("what is my name") && studentName) {
      reply = `Your name is ${studentName}.`;
    }

    // ---------- INTEREST MEMORY ----------
    if (text.includes("i enjoy")) {
      const interest = text.replace("i enjoy", "").trim();
      interests.push(interest);

      reply = `Hello ${studentName || ""}! I remember you enjoy ${interest}. Let's explore that together.`;
    }

    // ---------- TOPIC TRACKING ----------
    if (text.includes("gravity")) {
      if (!learningProfile.topics.includes("gravity")) {
        learningProfile.topics.push("gravity");
      }

      learningProfile.curiosityScore++;

      reply =
        `Hi ${studentName || ""}! Gravity is the force that pulls objects with mass toward each other. ` +
        `On Earth, gravity keeps us grounded and causes objects to fall. ` +
        `Einstein later showed that gravity happens because massive objects bend space and time itself.`;
    }

    // ---------- SAVE TO TEACHER SYSTEM ----------
    if (studentName) {
      saveStudent({
        name: studentName,
        interests,
        learningProfile
      });
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      reply: "Error contacting server."
    });
  }
}
