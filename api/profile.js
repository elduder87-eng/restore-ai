import { getProfile, setName, addInterest } from "../lib/memory.js";

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(getProfile());
  }

  if (req.method === "POST") {
    const { name, interest } = req.body;

    if (name) setName(name);
    if (interest) addInterest(interest);

    return res.status(200).json(getProfile());
  }

  res.status(405).end();
}
