let teacherDB = {
  students: []
};

export function saveStudent(profile) {
  const existing = teacherDB.students.find(
    s => s.name === profile.name
  );

  if (existing) {
    existing.interests = [...new Set(profile.interests)];
    existing.learningProfile = profile.learningProfile;
  } else {
    teacherDB.students.push(profile);
  }
}

export default function handler(req, res) {
  res.status(200).json(teacherDB);
}
