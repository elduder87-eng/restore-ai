import { saveStudent } from "./teacher.js";

let studentProfile = {
  name: null,
  interests: [],
  learningProfile: {
    topics: [],
    curiosityScore: 0
  }
};

export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const text = message.toLowerCase();

    // -------- NAME DETECTION --------
    const nameMatch = message.match(/my name is (\w+)/i);
    if (nameMatch) {
      studentProfile.name = nameMatch[1];
    }

    // -------- INTEREST DETECTION --------
    if (text.includes("i enjoy") || text.includes("i like")) {
      const interest = message.split(" ").pop();
      studentProfile.interests.push(interest);
    }

    // -------- TOPIC TRACKING --------
    if (text.includes("gravity")) {
      studentProfile.learningProfile.topics.push("gravity");
      studentProfile.learningProfile.curiosityScore++;
    }

    // -------- SAVE TO TEACHER MEMORY --------
    if (studentProfile.name) {
      saveStudent(studentProfile);
    }

    // -------- RESPONSE LOGIC --------
    let reply = "I'm here to help you learn.";

    if (text.includes("what is my name")) {
      reply = studentProfile.name
        ? `Your name is ${studentProfile.name}.`
        : "I don't know your name yet.";
    }

    else if (text.includes("gravity")) {
      reply =
        `Hi ${studentProfile.name || "there"}! Gravity is the force ` +
        `that pulls objects with mass toward each other. ` +
        `On Earth, gravity keeps us grounded and causes objects to fall. ` +
        `Einstein later showed that gravity happens because massive objects bend space and time itself.`;
    }

    else if (studentProfile.interests.length > 0) {
      reply =
        `Hello ${studentProfile.name || ""}! ` +
        `I remember you enjoy ${studentProfile.interests[0]}. ` +
        `Let's explore that together.`;
    }

    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({ reply: "Error contacting server." });
  }
}
