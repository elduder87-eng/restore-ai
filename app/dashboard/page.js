<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0"/>
<title>Restore – Dashboard</title>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
<style>
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
    --shadow-md: 0 2px 8px rgba(0,0,0,0.06), 0 12px 28px rgba(0,0,0,0.08);
  }

  body {
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--dark);
    min-height: 100vh;
    max-width: 430px;
    margin: 0 auto;
  }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes barGrow  { from{width:0} to{width:var(--w)} }
  @keyframes breathe  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
  @keyframes shimmer  { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }

  /* ── NAV ── */
  nav {
    background: var(--card);
    border-bottom: 1px solid var(--border);
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky; top: 0; z-index: 100;
    backdrop-filter: blur(12px);
  }
  .nav-brand { display: flex; align-items: center; gap: 9px; }
  .nav-logo {
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
  .nav-sub {
    font-size: 10px; color: var(--muted);
    font-weight: 400; margin-top: 1px;
  }
  .nav-links { display: flex; gap: 2px; }
  .nav-link {
    padding: 5px 10px; border-radius: 8px;
    font-size: 12px; font-weight: 500;
    color: var(--muted); border: none; background: none;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }
  .nav-link.active { color: var(--teal); background: var(--teal-lt); font-weight: 600; }

  /* ── MAIN ── */
  main { padding: 20px 16px 40px; }

  /* PAGE TITLE */
  .page-title {
    font-family: 'Lora', serif;
    font-size: 28px; font-weight: 700;
    letter-spacing: -0.03em; color: var(--dark);
    margin-bottom: 16px;
    animation: fadeUp 0.4s ease both;
  }

  /* ── THINKING MODE BANNER ── */
  .thinking-banner {
    background: var(--card);
    border-radius: 16px;
    border-left: 4px solid var(--teal);
    padding: 16px 18px;
    margin-bottom: 16px;
    box-shadow: var(--shadow-sm);
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

  /* ── 3-COL INSIGHT ROW ── */
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
  .insight-text {
    font-size: 12px; color: var(--mid);
    line-height: 1.5; font-weight: 400;
  }

  /* ── FULL CARD ── */
  .full-card {
    background: var(--card);
    border-radius: 16px; padding: 18px;
    margin-bottom: 14px;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border);
  }
  .card-heading {
    font-size: 15px; font-weight: 700;
    color: var(--dark); letter-spacing: -0.02em;
    margin-bottom: 8px;
  }
  .card-body {
    font-size: 13px; color: var(--mid); line-height: 1.6;
  }

  /* ── CURIOSITY ── */
  .curiosity-card {
    animation: fadeUp 0.4s ease 0.15s both;
    position: relative; overflow: hidden;
  }
  .curiosity-card::before {
    content: ''; position: absolute;
    top: -20px; right: -20px; width: 100px; height: 100px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59,191,178,0.08), transparent 70%);
  }

  /* ── GUIDE / CHAT ── */
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
    outline: none; transition: border-color 0.15s;
  }
  .guide-input:focus { border-color: var(--teal); }
  .guide-input::placeholder { color: var(--muted); }
  .ask-btn {
    padding: 10px 18px;
    background: linear-gradient(135deg, var(--teal), var(--teal-dk));
    border: none; border-radius: 10px;
    color: #fff; font-weight: 700; font-size: 13px;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 12px rgba(59,191,178,0.35);
    transition: opacity 0.15s, transform 0.15s;
    white-space: nowrap;
  }
  .ask-btn:hover { opacity: 0.9; transform: translateY(-1px); }

  /* ── BOTTOM 3-COL GRID ── */
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
  .bottom-heading {
    font-size: 11px; font-weight: 700;
    color: var(--dark); letter-spacing: -0.01em;
    margin-bottom: 10px; font-size: 12px;
  }

  /* PULSE BARS */
  .pulse-item { margin-bottom: 8px; }
  .pulse-row-top { display: flex; justify-content: space-between; margin-bottom: 4px; }
  .pulse-lbl { font-size: 10px; font-weight: 500; color: var(--mid); }
  .pulse-pct { font-size: 10px; font-weight: 600; font-family: 'DM Mono', monospace; color: var(--teal); }
  .pulse-track { height: 3px; background: #EEF0EF; border-radius: 2px; overflow: hidden; }
  .pulse-bar { height: 100%; border-radius: 2px; animation: barGrow 1s ease forwards; }

  /* CONFUSION */
  .conf-item {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 8px; border-radius: 8px; margin-bottom: 5px;
    font-size: 11px; font-weight: 500; color: var(--dark);
  }
  .conf-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .conf-badge {
    font-size: 9px; font-weight: 700; padding: 1px 6px;
    border-radius: 20px; margin-left: auto;
    font-family: 'DM Mono', monospace; text-transform: uppercase;
  }

  /* CURIOSITY TAGS */
  .c-tag {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 4px 9px; border-radius: 20px;
    background: var(--teal-lt); color: var(--teal-dk);
    font-size: 10px; font-weight: 600; margin: 2px;
    font-family: 'DM Mono', monospace;
  }

  /* ── MOMENTS / STEPS / SESSION ROW ── */
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
  .lower-heading {
    font-size: 12px; font-weight: 700;
    color: var(--dark); margin-bottom: 10px;
    letter-spacing: -0.01em;
  }
  .moment-item { margin-bottom: 8px; }
  .moment-name { font-size: 11px; font-weight: 600; color: var(--dark); }
  .moment-act { font-size: 10px; color: var(--muted); margin-top: 1px; line-height: 1.3; }
  .moment-dot {
    display: inline-block; width: 5px; height: 5px;
    border-radius: 50%; background: var(--teal); margin-right: 4px;
    vertical-align: middle;
  }

  .step-item { display: flex; align-items: flex-start; gap: 6px; margin-bottom: 7px; }
  .step-icon { font-size: 12px; flex-shrink: 0; margin-top: 1px; }
  .step-text { font-size: 10px; color: var(--mid); line-height: 1.4; }
  .step-badge {
    font-size: 8px; font-weight: 700; padding: 1px 5px;
    border-radius: 20px; display: block; margin-top: 3px;
    font-family: 'DM Mono', monospace; text-transform: uppercase;
  }

  .session-row { margin-bottom: 7px; }
  .session-key { font-size: 9px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; font-family: 'DM Mono', monospace; }
  .session-val { font-size: 11px; font-weight: 600; color: var(--dark); margin-top: 1px; }
  .session-state {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 11px; font-weight: 600; color: var(--dark);
  }
  .state-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #22C55E; animation: breathe 2s infinite;
    display: inline-block;
  }
</style>
</head>
<body>

<!-- NAV -->
<nav>
  <div class="nav-brand">
    <div class="nav-logo">🌱</div>
    <div>
      <div class="nav-name">Restore</div>
      <div class="nav-sub">Where understanding grows</div>
    </div>
  </div>
  <div class="nav-links">
    <button class="nav-link active">Dashboard</button>
    <button class="nav-link">Chat</button>
    <button class="nav-link">Profile</button>
  </div>
</nav>

<main>

  <!-- TITLE -->
  <h1 class="page-title">Dashboard</h1>

  <!-- THINKING MODE -->
  <div class="thinking-banner full-card">
    <div class="thinking-label">Current Thinking Mode</div>
    <div class="thinking-mode">Connecting Ideas</div>
    <div class="thinking-desc">Restore detects how you're learning based on your exploration and reflection patterns.</div>
  </div>

  <!-- TODAY'S INSIGHTS ROW -->
  <div class="insight-row">
    <div class="insight-card">
      <div class="insight-heading">Insight</div>
      <div class="insight-text">You form strong connections when reflecting on examples.</div>
    </div>
    <div class="insight-card">
      <div class="insight-heading">Thought</div>
      <div class="insight-text">Why don't planets fall into the sun if gravity pulls them?</div>
    </div>
    <div class="insight-card">
      <div class="insight-heading">Connection</div>
      <div class="insight-text">How might gravity, motion, and orbital speed connect?</div>
    </div>
  </div>

  <!-- TODAY'S CURIOSITY -->
  <div class="full-card curiosity-card">
    <div class="thinking-label" style="margin-bottom:6px">✦ Today's Curiosity</div>
    <div class="card-heading">What might happen if gravity suddenly weakened near Earth?</div>
    <div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap">
      <span style="font-size:11px;color:var(--mid);display:flex;align-items:center;gap:4px">
        <span style="width:6px;height:6px;border-radius:50%;background:var(--teal);display:inline-block"></span>
        Gravity · Orbits · Atmosphere
      </span>
    </div>
  </div>

  <!-- RESTORE GUIDE -->
  <div class="full-card guide-card">
    <div class="guide-label">AI Companion</div>
    <div class="card-heading">Restore Guide</div>
    <div class="card-body">Ask about today's learning patterns.</div>
    <div class="guide-input-row">
      <input class="guide-input" placeholder="Ask about today's learning…"/>
      <button class="ask-btn">Ask</button>
    </div>
  </div>

  <!-- BOTTOM 3-COL: PULSE / CONFUSION / CURIOSITY -->
  <div class="bottom-grid">

    <!-- UNDERSTANDING PULSE -->
    <div class="bottom-card">
      <div class="bottom-heading">Understanding Pulse</div>

      <div class="pulse-item">
        <div class="pulse-row-top"><span class="pulse-lbl">Connecting</span><span class="pulse-pct">72%</span></div>
        <div class="pulse-track"><div class="pulse-bar" style="--w:72%;background:linear-gradient(90deg,#7BE8DF,#3BBFB2)"></div></div>
      </div>
      <div class="pulse-item">
        <div class="pulse-row-top"><span class="pulse-lbl">Reflecting</span><span class="pulse-pct">58%</span></div>
        <div class="pulse-track"><div class="pulse-bar" style="--w:58%;background:linear-gradient(90deg,#7BE8DF,#3BBFB2)"></div></div>
      </div>
      <div class="pulse-item">
        <div class="pulse-row-top"><span class="pulse-lbl">Curious</span><span class="pulse-pct">85%</span></div>
        <div class="pulse-track"><div class="pulse-bar" style="--w:85%;background:linear-gradient(90deg,#A78BFA,#7C3AED)"></div></div>
      </div>
      <div class="pulse-item">
        <div class="pulse-row-top"><span class="pulse-lbl">Confused</span><span class="pulse-pct" style="color:var(--red)">31%</span></div>
        <div class="pulse-track"><div class="pulse-bar" style="--w:31%;background:linear-gradient(90deg,#FCA5A5,#E5484D)"></div></div>
      </div>
      <div class="pulse-item">
        <div class="pulse-row-top"><span class="pulse-lbl">Exploring</span><span class="pulse-pct">64%</span></div>
        <div class="pulse-track"><div class="pulse-bar" style="--w:64%;background:linear-gradient(90deg,#6EE7B7,#16A15E)"></div></div>
      </div>
    </div>

    <!-- CONFUSION SIGNALS -->
    <div class="bottom-card">
      <div class="bottom-heading">Confusion Signals</div>

      <div class="conf-item" style="background:#FFF0F0">
        <div class="conf-dot" style="background:var(--red)"></div>
        <span style="font-size:10px;flex:1">Electric Circuits</span>
        <span class="conf-badge" style="background:rgba(229,72,77,.12);color:var(--red)">High</span>
      </div>
      <div class="conf-item" style="background:#FFFBEB">
        <div class="conf-dot" style="background:var(--amber)"></div>
        <span style="font-size:10px;flex:1">Limits in Calculus</span>
        <span class="conf-badge" style="background:rgba(229,150,10,.12);color:var(--amber)">Med</span>
      </div>
      <div class="conf-item" style="background:#FFFBEB">
        <div class="conf-dot" style="background:var(--amber)"></div>
        <span style="font-size:10px;flex:1">Plate Tectonics</span>
        <span class="conf-badge" style="background:rgba(229,150,10,.12);color:var(--amber)">Med</span>
      </div>
    </div>

    <!-- CURIOSITY ACTIVITY -->
    <div class="bottom-card">
      <div class="bottom-heading">Curiosity Activity</div>
      <div>
        <span class="c-tag">🕳 Black holes</span>
        <span class="c-tag">🌿 Evolution</span>
        <span class="c-tag">🏛 Ancient civ.</span>
      </div>
    </div>
  </div>

  <!-- LOWER ROW: MOMENTS / STEPS / SESSION -->
  <div class="lower-grid">

    <!-- LEARNING MOMENTS -->
    <div class="lower-card">
      <div class="lower-heading">Learning Moments</div>

      <div class="moment-item">
        <div class="moment-name"><span class="moment-dot"></span>Emma</div>
        <div class="moment-act">Connected Galileo & Motion</div>
      </div>
      <div class="moment-item">
        <div class="moment-name"><span class="moment-dot"></span>James</div>
        <div class="moment-act">Understood Ionic Bonds</div>
      </div>
      <div class="moment-item">
        <div class="moment-name"><span class="moment-dot"></span>Sarah</div>
        <div class="moment-act">Reflected on Moon Phases</div>
      </div>
    </div>

    <!-- SUGGESTED NEXT STEPS -->
    <div class="lower-card">
      <div class="lower-heading">Suggested Next Steps</div>

      <div class="step-item">
        <span class="step-icon">📚</span>
        <div>
          <div class="step-text">Review: Limits in Calculus</div>
          <span class="step-badge" style="background:#FEE8E8;color:var(--red)">Review</span>
        </div>
      </div>
      <div class="step-item">
        <span class="step-icon">🔭</span>
        <div>
          <div class="step-text">Explore: Gravity bends space</div>
          <span class="step-badge" style="background:var(--teal-lt);color:var(--teal-dk)">Explore</span>
        </div>
      </div>
      <div class="step-item">
        <span class="step-icon">🔗</span>
        <div>
          <div class="step-text">Connect: Galileo → planetary motion</div>
          <span class="step-badge" style="background:#EDFAF4;color:var(--green)">Connect</span>
        </div>
      </div>
    </div>

    <!-- CURRENT SESSION -->
    <div class="lower-card">
      <div class="lower-heading">Current Session</div>

      <div class="session-row">
        <div class="session-key">Topic</div>
        <div class="session-val">Gravity & Orbits</div>
      </div>
      <div class="session-row">
        <div class="session-key">State</div>
        <div class="session-state"><span class="state-dot"></span>Reflecting</div>
      </div>
      <div class="session-row">
        <div class="session-key">Questions</div>
        <div class="session-val">7 asked</div>
      </div>
      <div class="session-row">
        <div class="session-key">Connections</div>
        <div class="session-val">3 made</div>
      </div>
    </div>
  </div>

</main>
</body>
</html>
