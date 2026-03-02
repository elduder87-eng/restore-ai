"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setProfile(data.profile);
    }

    loadProfile();
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Learning Profile</h1>

      <h2>Interests</h2>
      <ul>
        {profile.interests.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>

      <h2>Learning Style</h2>
      <p>{profile.learningStyle}</p>
    </div>
  );
}
