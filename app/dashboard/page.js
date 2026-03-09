"use client";

export default function Dashboard() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #F2F4F3;
          --teal: #3BBFB2;
          --teal-lt: #EBF8F7;
          --teal-dk: #2A9E93;
          --dark: #1C2126;
          --mid: #5C6672;
          --muted: #9BA5AE;
          --card: #FFFFFF;
          --border: #E8ECEA;
          --red: #E5484D;
          --amber: #E5960A;
          --green: #16A15E;
          --shadow-sm: 0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.06);
        }

        .dash-root {
          background: var(--bg);
          font-family: 'DM Sans', sans-serif;
          color: var(--dark);
          min-height: 100vh;
        }

        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes barGrow { from{width:0} to{width:var(--w)} }
        @keyframes breathe { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }

        /* NAV */
        .dash-nav {
          background: var(--card);
          border-bottom: 1px solid var(--border);
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky; top: 0; z-index: 100;
        }
        .nav-brand { display: flex; align-items: center; gap: 9px; }
        .nav-logo-box {
          width: 34px; height: 34px; border-radius: 10px;
          background: linear-gradient(135deg, #3BBFB2, #2A9E93);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }
        .nav-name {
          font-family: 'Lora', serif;
          font-size: 17px; font-weight: 700;
          color: var(--dark); letter-spacing: -0.02em;
        }
        .nav-sub { font-size: 10px; color: var(--muted); margin-top: 1px; }
        .nav-links { display: flex; gap: 2px; }
        .nav-link {
          padding: 5px 10px; border-radius: 8px;
          font-size: 12px; font-weight: 500;
          color: var(--muted); border: none; background: none;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.15s; text-decoration: none; display: inline-block;
        }
        .nav-link-active {
          color: var(--teal); background: var(--teal-lt); font-weight: 600;
        }

        /* MAIN */
        .dash-main { padding: 20px 16px 40px; }

        .page-title {
          font-family: 'Lora', serif;
          font-size: 28px; font-weight: 700;
          letter-spacing: -0.03em; color: var(--dark);
          margin-bottom: 16px;
          animation: fadeUp 0.4s ease both;
        }

        /* CARDS */
        .card {
          background: var(--card);
          border-radius: 16px; padding: 18px;
          margin-bottom: 14px;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border);
        }

        /* THINKING MODE */
        .thinking-banner {
          border-left: 4px solid var(--teal);
          animation: fadeUp 0.4s ease 0.05s both;
        }
        .thinking-label {
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--teal);
          font-family: 'DM Mono', monospace; margin-bottom: 5px;
        }
        .thinking-mode {
          font-family: 'Lora', serif;
          font-size: 20px; font-weight: 600;
          color: var(--dark); letter-spacing: -0.02em; margin-bottom: 6px;
        }
        .thinking-desc { font-size: 13px; color: var(--mid); line-height: 1.5; }

        /* INSIGHT ROW */
        .insight-row {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 10px; margin-bottom: 14px;
          animation: fadeUp 0.4s ease 0.1s both;
        }
        .insight-card {
          background: var(--card);
          border-radius: 14px; padding: 14px 12px;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border);
        }
        .insight-heading {
          font-size: 11px; font-weight: 700;
          color: var(--teal); margin-bottom: 6px;
          font-family: 'DM Mono', monospace;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .insight-text { font-size: 12px; color: var(--mid); line-height: 1.5; }

        /* CURIOSITY */
        .curiosity-card {
          animation: fadeUp 0.4s ease 0.15s both;
          position: relative; overflow: hidden;
        }
        .card-heading {
          font-size: 15px; font-weight: 700;
          color: var(--dark); letter-spacing: -0.02em; margin-bottom: 8px;
        }
        .card-body { font-size: 13px; color: var(--mid); line-height: 1.6; }
        .topic-tag-row { margin-top: 10px; display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
        .topic-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--teal); display: inline-block; }
        .topic-text { font-size: 11px; color: var(--mid); }

        /* GUIDE */
        .guide-card { animation: fadeUp 0.4s ease 0.2s both; }
        .guide-label {
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--muted);
          font-family: 'DM Mono', monospace; margin-bottom: 4px;
        }
        .guide-input-row { display: flex; gap: 8px; margin-top: 12px; }
        .guide-input {
          flex: 1; background: #F7F9F8;
          border: 1px solid var(--border); border-radius: 10px;
          padding: 10px 13px; font-size: 13px;
          font-family: 'DM Sans', sans-serif; color: var(--dark);
          outline: none;
        }
        .ask-btn {
          padding: 10px 18px;
          background: linear-gradient(135deg, #3BBFB2, #2A9E93);
          border: none; border-radius: 10px;
          color: #fff; font-weight: 700; font-size: 13px;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          box-shadow: 0 4px 12px rgba(59,191,178,0.35);
          white-space: nowrap;
        }

        /* BOTTOM 3-COL */
        .bottom-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 10px; margin-bottom: 14px;
          animation: fadeUp 0.4s ease 0.25s both;
        }
        .bottom-card {
          background: var(--card);
          border-radius: 14px; padding: 14px 12px;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border);
        }
        .bottom-heading { font-size: 12px; font-weight: 700; color: var(--dark); margin-bottom: 10px; }

        /* PULSE */
        .pulse-item { margin-bottom: 8px; }
        .pulse-row-top { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .pulse-lbl { font-size: 10px; font-weight: 500; color: var(--mid); }
        .pulse-pct { font-size: 10px; font-weight: 600; font-family: 'DM Mono', monospace; color: var(--teal); }
        .pulse-pct-red { color: var(--red); }
        .pulse-track { height: 3px; background: #EEF0EF; border-radius: 2px; overflow: hidden; }
        .pulse-bar { height: 100%; border-radius: 2px; animation: barGrow 1s ease forwards; }

        /* CONFUSION */
        .conf-item {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 8px; border-radius: 8px; margin-bottom: 5px;
        }
        .conf-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .conf-name { font-size: 10px; flex: 1; color: var(--dark); font-weight: 500; }
        .conf-badge {
          font-size: 9px; font-weight: 700; padding: 1px 6px;
          border-radius: 20px; font-family: 'DM Mono', monospace; text-transform: uppercase;
        }

        /* CURIOSITY TAGS */
        .c-tag {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 9px; border-radius: 20px;
          background: var(--teal-lt); color: var(--teal-dk);
          font-size: 10px; font-weight: 600; margin: 2px;
          font-family: 'DM Mono', monospace;
        }

        /* LOWER ROW */
        .lower-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 10px; margin-bottom: 14px;
          animation: fadeUp 0.4s ease 0.3s both;
        }
        .lower-card {
          background: var(--card);
          border-radius: 14px; padding: 14px 12px;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border);
        }
        .lower-heading { font-size: 12px; font-weight: 700; color: var(--dark); margin-bottom: 10px; }

        .moment-item { margin-bottom: 8px; }
        .moment-name { font-size: 11px; font-weight: 600; color: var(--dark); display: flex; align-items: center; gap: 4px; }
        .moment-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--teal); flex-shrink: 0; }
        .moment-act { font-size: 10px; color: var(--muted); margin-top: 1px; line-height: 1.3; }

        .step-item { display: flex; align-items: flex-start; gap: 6px; margin-bottom: 7px; }
        .step-icon { font-size: 12px; flex-shrink: 0; margin-top: 1px; }
        .step-text { font-size: 10px; color: var(--mid); line-height: 1.4; }
        .step-badge {
          font-size: 8px; font-weight: 700; padding: 1px 5px;
          border-radius: 20px; display: block; margin-top: 3px;
          font-family: 'DM Mono', monospace; text-transform: uppercase;
        }

        .session-row { margin-bottom: 7px; }
        .session-key {
          font-size: 9px; font-weight: 700; color: var(--muted);
          text-transform: uppercase; letter-spacing: 0.06em;
          font-family: 'DM Mono', monospace;
        }
        .session-val { font-size: 11px; font-weight: 600; color: var(--dark); margin-top: 1px; }
        .session-state { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; color: var(--dark); }
        .state-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #22C55E; animation: breathe 2s infinite; display: inline-block;
        }
      `}</style>

      <div className="dash-root">

        {/* NAV */}
        <nav className="dash-nav">
          <div className="nav-brand">
            <div className="nav-logo-box">🌱</div>
            <div>
              <div className="nav-name">Restore</div>
              <div className="nav-sub">Where understanding grows</div>
            </div>
          </div>
          <div className="nav-links">
            <a href="/dashboard" className="nav-link nav-link-active">Dashboard</a>
            <a href="/chat" className="nav-link">Chat</a>
            <a href="/profile" className="nav-link">Profile</a>
          </div>
        </nav>

        {/* MAIN */}
        <main className="dash-main">

          <h1 className="page-title">Dashboard</h1>

          {/* THINKING MODE */}
          <div className="card thinking-banner">
            <div className="thinking-label">Current Thinking Mode</div>
            <div className="thinking-mode">Connecting Ideas</div>
            <div className="thinking-desc">
              Restore detects how you&apos;re learning based on your exploration and reflection patterns.
            </div>
          </div>

          {/* INSIGHTS ROW */}
          <div className="insight-row">
            <div className="insight-card">
              <div className="insight-heading">Insight</div>
              <div className="insight-text">You form strong connections when reflecting on examples.</div>
            </div>
            <div className="insight-card">
              <div className="insight-heading">Thought</div>
              <div className="insight-text">Why don&apos;t planets fall into the sun if gravity pulls them?</div>
            </div>
            <div className="insight-card">
              <div className="insight-heading">Connection</div>
              <div className="insight-text">How might gravity, motion, and orbital speed connect?</div>
            </div>
          </div>

          {/* TODAY'S CURIOSITY */}
          <div className="card curiosity-card">
            <div className="thinking-label" style={{marginBottom: "6px"}}>✦ Today&apos;s Curiosity</div>
            <div className="card-heading">What might happen if gravity suddenly weakened near Earth?</div>
            <div className="topic-tag-row">
              <span className="topic-dot"></span>
              <span className="topic-text">Gravity · Orbits · Atmosphere</span>
            </div>
          </div>

          {/* RESTORE GUIDE */}
          <div className="card guide-card">
            <div className="guide-label">AI Companion</div>
            <div className="card-heading">Restore Guide</div>
            <div className="card-body">Ask about today&apos;s learning patterns.</div>
            <div className="guide-input-row">
              <input className="guide-input" placeholder="Ask about today's learning…" />
              <button className="ask-btn">Ask</button>
            </div>
          </div>

          {/* BOTTOM 3-COL: PULSE / CONFUSION / CURIOSITY */}
          <div className="bottom-grid">

            {/* UNDERSTANDING PULSE */}
            <div className="bottom-card">
              <div className="bottom-heading">Understanding Pulse</div>
              {[
                { label: "Connecting", pct: 72, bar: "linear-gradient(90deg,#7BE8DF,#3BBFB2)", color: "" },
                { label: "Reflecting", pct: 58, bar: "linear-gradient(90deg,#7BE8DF,#3BBFB2)", color: "" },
                { label: "Curious",    pct: 85, bar: "linear-gradient(90deg,#A78BFA,#7C3AED)", color: "" },
                { label: "Confused",   pct: 31, bar: "linear-gradient(90deg,#FCA5A5,#E5484D)", color: "pulse-pct-red" },
                { label: "Exploring",  pct: 64, bar: "linear-gradient(90deg,#6EE7B7,#16A15E)", color: "" },
              ].map(({ label, pct, bar, color }) => (
                <div className="pulse-item" key={label}>
                  <div className="pulse-row-top">
                    <span className="pulse-lbl">{label}</span>
                    <span className={`pulse-pct ${color}`}>{pct}%</span>
                  </div>
                  <div className="pulse-track">
                    <div className="pulse-bar" style={{ width: `${pct}%`, background: bar }} />
                  </div>
                </div>
              ))}
            </div>

            {/* CONFUSION SIGNALS */}
            <div className="bottom-card">
              <div className="bottom-heading">Confusion Signals</div>
              <div className="conf-item" style={{ background: "#FFF0F0" }}>
                <div className="conf-dot" style={{ background: "#E5484D" }} />
                <span className="conf-name">Electric Circuits</span>
                <span className="conf-badge" style={{ background: "rgba(229,72,77,.12)", color: "#E5484D" }}>High</span>
              </div>
              <div className="conf-item" style={{ background: "#FFFBEB" }}>
                <div className="conf-dot" style={{ background: "#E5960A" }} />
                <span className="conf-name">Limits in Calculus</span>
                <span className="conf-badge" style={{ background: "rgba(229,150,10,.12)", color: "#E5960A" }}>Med</span>
              </div>
              <div className="conf-item" style={{ background: "#FFFBEB" }}>
                <div className="conf-dot" style={{ background: "#E5960A" }} />
                <span className="conf-name">Plate Tectonics</span>
                <span className="conf-badge" style={{ background: "rgba(229,150,10,.12)", color: "#E5960A" }}>Med</span>
              </div>
            </div>

            {/* CURIOSITY ACTIVITY */}
            <div className="bottom-card">
              <div className="bottom-heading">Curiosity Activity</div>
              <span className="c-tag">🕳 Black holes</span>
              <span className="c-tag">🌿 Evolution</span>
              <span className="c-tag">🏛 Ancient civ.</span>
            </div>
          </div>

          {/* LOWER ROW: MOMENTS / STEPS / SESSION */}
          <div className="lower-grid">

            {/* LEARNING MOMENTS */}
            <div className="lower-card">
              <div className="lower-heading">Learning Moments</div>
              {[
                { name: "Emma",  act: "Connected Galileo & Motion" },
                { name: "James", act: "Understood Ionic Bonds" },
                { name: "Sarah", act: "Reflected on Moon Phases" },
              ].map(({ name, act }) => (
                <div className="moment-item" key={name}>
                  <div className="moment-name">
                    <span className="moment-dot" />
                    {name}
                  </div>
                  <div className="moment-act">{act}</div>
                </div>
              ))}
            </div>

            {/* SUGGESTED NEXT STEPS */}
            <div className="lower-card">
              <div className="lower-heading">Suggested Next Steps</div>
              <div className="step-item">
                <span className="step-icon">📚</span>
                <div>
                  <div className="step-text">Review: Limits in Calculus</div>
                  <span className="step-badge" style={{ background: "#FEE8E8", color: "#E5484D" }}>Review</span>
                </div>
              </div>
              <div className="step-item">
                <span className="step-icon">🔭</span>
                <div>
                  <div className="step-text">Explore: Gravity bends space</div>
                  <span className="step-badge" style={{ background: "#EBF8F7", color: "#2A9E93" }}>Explore</span>
                </div>
              </div>
              <div className="step-item">
                <span className="step-icon">🔗</span>
                <div>
                  <div className="step-text">Connect: Galileo → planetary motion</div>
                  <span className="step-badge" style={{ background: "#EDFAF4", color: "#16A15E" }}>Connect</span>
                </div>
              </div>
            </div>

            {/* CURRENT SESSION */}
            <div className="lower-card">
              <div className="lower-heading">Current Session</div>
              <div className="session-row">
                <div className="session-key">Topic</div>
                <div className="session-val">Gravity &amp; Orbits</div>
              </div>
              <div className="session-row">
                <div className="session-key">State</div>
                <div className="session-state">
                  <span className="state-dot" />
                  Reflecting
                </div>
              </div>
              <div className="session-row">
                <div className="session-key">Questions</div>
                <div className="session-val">7 asked</div>
              </div>
              <div className="session-row">
                <div className="session-key">Connections</div>
                <div className="session-val">3 made</div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </>
  );
}
