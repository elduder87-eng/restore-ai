"use client"

import Link from "next/link"

export default function NavBar() {
  return (
    <nav style={{
      display: "flex",
      gap: "30px",
      padding: "20px",
      borderBottom: "1px solid #ddd",
      fontWeight: "500"
    }}>

      <Link href="/dashboard">Dashboard</Link>

      <Link href="/chat">Chat</Link>

      <Link href="/profile">Profile</Link>

    </nav>
  )
}
