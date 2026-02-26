import { setName, addInterest } from "../lib/memory.js";

export default async function handler(req, res) {
  const { message } = req.body;

  let reply = "I'm here to help you learn.";

  const nameMatch = message.match(/my name is (.+)/i);
  if (nameMatch) {
    const name = nameMatch[1].trim();
    setName(name);
    reply = `Nice to meet you, ${name}.`;
  }

  const interestMatch = message.match(/i enjoy (.+)/i);
  if (interestMatch) {
    const interest = interestMatch[1].trim();
    addInterest(interest);
    reply = `I remember you enjoy ${interest}.`;
  }

  res.status(200).json({ reply });
}
