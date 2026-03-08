"use client";

export default function Home() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "linear-gradient(#cfd8e3,#bfc9d6)",
      }}
    >
      <div style={{ fontSize: "60px" }}>🌱</div>

      <h1 style={{ fontSize: "42px", margin: "10px 0" }}>Restore</h1>

      <p style={{ opacity: 0.6 }}>Where Understanding Grows</p>

      <a
        href="/dashboard"
        style={{
          marginTop: "40px",
          padding: "12px 30px",
          border: "1px solid #4caf50",
          borderRadius: "8px",
          textDecoration: "none",
          color: "#2e7d32",
        }}
      >
        Enter
      </a>
    </div>
  );
}
