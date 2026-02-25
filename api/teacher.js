let classroom = [];

export function saveStudent(profile) {
  const existing = classroom.find(
    s => s.name === profile.name
  );

  if (existing) {
    Object.assign(existing, profile);
  } else {
    classroom.push(profile);
  }
}

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({
      students: classroom
    });
  }

  res.status(405).json({ error: "Method not allowed" });
}
