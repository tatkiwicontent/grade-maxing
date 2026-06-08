const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Grade Maxing — AI Worksheet Generator</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --ink: #0d0d0d;
    --paper: #f5f0e8;
    --accent: #ff4d00;
    --accent2: #7c3aed;
    --muted: #7a7470;
    --rule: #e0dbd2;
    --card: #ffffff;
    --success: #1a7a4a;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: var(--paper);
    color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
  }

  /* ── NAV ── */
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 40px;
    border-bottom: 1px solid var(--rule);
    background: var(--paper);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    letter-spacing: 0.06em;
    color: var(--ink);
    text-decoration: none;
  }

  .nav-logo span { color: var(--accent); }

  .nav-tag {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    background: rgba(0,0,0,0.05);
    padding: 5px 12px;
    border-radius: 100px;
  }

  /* ── HERO ── */
  .hero {
    padding: 72px 40px 56px;
    max-width: 900px;
    margin: 0 auto;
    text-align: center;
    animation: fadeUp 0.6s ease both;
  }

  .hero-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 20px;
    display: block;
  }

  .hero h1 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(52px, 9vw, 96px);
    line-height: 0.95;
    letter-spacing: 0.03em;
    margin-bottom: 20px;
  }

  .hero h1 em {
    color: var(--accent);
    font-style: normal;
  }

  .hero p {
    font-size: 17px;
    color: var(--muted);
    font-weight: 300;
    max-width: 520px;
    margin: 0 auto 40px;
    line-height: 1.6;
  }

  /* ── APP CARD ── */
  .app-card {
    background: var(--card);
    border-radius: 20px;
    border: 1px solid var(--rule);
    max-width: 760px;
    margin: 0 auto 80px;
    overflow: hidden;
    box-shadow: 0 4px 40px rgba(0,0,0,0.06);
    animation: fadeUp 0.6s 0.15s ease both;
    opacity: 0;
  }

  .app-card-header {
    background: var(--ink);
    padding: 20px 28px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .dot { width: 10px; height: 10px; border-radius: 50%; }
  .dot.red { background: #ff5f57; }
  .dot.yellow { background: #ffbd2e; }
  .dot.green { background: #28c840; }

  .app-card-title {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: rgba(245,240,232,0.4);
    letter-spacing: 0.1em;
    margin-left: 8px;
  }

  .app-card-body { padding: 36px 36px 28px; }

  /* ── FORM ── */
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-group.full { grid-column: 1 / -1; }

  label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
  }

  select, input, textarea {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--ink);
    background: var(--paper);
    border: 1.5px solid var(--rule);
    border-radius: 10px;
    padding: 12px 14px;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
  }

  select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a7470' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; cursor: pointer; }

  select:focus, input:focus, textarea:focus {
    border-color: var(--accent);
    background: #fff;
  }

  textarea { resize: vertical; min-height: 80px; line-height: 1.5; }

  /* ── LANGUAGE TOGGLE ── */
  .lang-toggle {
    display: flex;
    gap: 0;
    border: 1.5px solid var(--rule);
    border-radius: 10px;
    overflow: hidden;
  }

  .lang-btn {
    flex: 1;
    padding: 11px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    background: var(--paper);
    border: none;
    cursor: pointer;
    color: var(--muted);
    transition: all 0.15s;
    text-align: center;
  }

  .lang-btn.active {
    background: var(--ink);
    color: var(--paper);
  }

  .lang-btn:first-child { border-right: 1.5px solid var(--rule); }

  /* ── DIFFICULTY ── */
  .diff-toggle {
    display: flex;
    gap: 8px;
  }

  .diff-btn {
    flex: 1;
    padding: 10px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border: 1.5px solid var(--rule);
    border-radius: 8px;
    background: var(--paper);
    cursor: pointer;
    color: var(--muted);
    transition: all 0.15s;
    text-align: center;
  }

  .diff-btn.active.easy { background: #e8f5ee; border-color: var(--success); color: var(--success); }
  .diff-btn.active.medium { background: #fff3e0; border-color: #e67e00; color: #e67e00; }
  .diff-btn.active.hard { background: #ffeae6; border-color: var(--accent); color: var(--accent); }

  /* ── WORKSHEET TYPES ── */
  .type-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }

  .type-btn {
    padding: 10px 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
    border: 1.5px solid var(--rule);
    border-radius: 8px;
    background: var(--paper);
    cursor: pointer;
    color: var(--muted);
    transition: all 0.15s;
    text-align: center;
    line-height: 1.3;
  }

  .type-btn span { display: block; font-size: 18px; margin-bottom: 4px; }
  .type-btn.active { background: var(--ink); border-color: var(--ink); color: var(--paper); }

  /* ── GENERATE BTN ── */
  .generate-btn {
    width: 100%;
    padding: 18px;
    background: var(--accent);
    color: white;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 0.08em;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    margin-top: 24px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .generate-btn:hover { background: #e03d00; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255,77,0,0.3); }
  .generate-btn:active { transform: translateY(0); }
  .generate-btn:disabled { background: var(--muted); cursor: not-allowed; transform: none; box-shadow: none; }

  /* ── OUTPUT ── */
  .output-section {
    max-width: 760px;
    margin: 0 auto 80px;
    display: none;
    animation: fadeUp 0.5s ease both;
  }

  .output-section.visible { display: block; }

  .output-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .output-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    letter-spacing: 0.04em;
  }

  .output-actions { display: flex; gap: 10px; }

  .btn-secondary {
    padding: 10px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    border: 1.5px solid var(--ink);
    border-radius: 8px;
    background: transparent;
    cursor: pointer;
    color: var(--ink);
    transition: all 0.15s;
  }

  .btn-secondary:hover { background: var(--ink); color: var(--paper); }

  .btn-primary {
    padding: 10px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    background: var(--accent);
    cursor: pointer;
    color: white;
    transition: all 0.15s;
  }

  .btn-primary:hover { background: #e03d00; }

  .worksheet-display {
    background: white;
    border-radius: 16px;
    border: 1px solid var(--rule);
    box-shadow: 0 2px 20px rgba(0,0,0,0.05);
    overflow: hidden;
  }

  .worksheet-header {
    background: var(--ink);
    padding: 24px 32px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .ws-brand {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px;
    color: rgba(245,240,232,0.3);
    letter-spacing: 0.08em;
  }

  .ws-brand span { color: var(--accent); }

  .ws-meta { text-align: right; }
  .ws-meta-title { font-family: 'Bebas Neue', sans-serif; font-size: 24px; color: var(--paper); letter-spacing: 0.04em; }
  .ws-meta-sub { font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(245,240,232,0.4); letter-spacing: 0.12em; margin-top: 4px; }

  .worksheet-body {
    padding: 32px;
    font-size: 14px;
    line-height: 1.8;
    color: #1a1a1a;
    white-space: pre-wrap;
    min-height: 200px;
  }

  /* Loading */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 32px;
    gap: 16px;
  }

  .spinner {
    width: 36px;
    height: 36px;
    border: 3px solid var(--rule);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  .loading-text {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .loading-dots span {
    animation: blink 1.2s infinite;
    font-size: 18px;
    color: var(--accent);
  }

  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

  /* ── HOW IT WORKS ── */
  .how-section {
    background: var(--ink);
    padding: 72px 40px;
    text-align: center;
  }

  .how-section h2 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(36px, 6vw, 56px);
    color: var(--paper);
    margin-bottom: 48px;
    letter-spacing: 0.04em;
  }

  .how-section h2 span { color: var(--accent); }

  .steps {
    display: flex;
    gap: 32px;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 800px;
    margin: 0 auto;
  }

  .step {
    flex: 1;
    min-width: 160px;
    max-width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .step-num {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--accent);
    color: white;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.04em;
  }

  .step-title {
    font-weight: 700;
    color: var(--paper);
    font-size: 14px;
    text-align: center;
  }

  .step-desc {
    font-size: 12px;
    color: rgba(245,240,232,0.45);
    text-align: center;
    line-height: 1.5;
  }

  /* ── PRICING STRIP ── */
  .pricing-strip {
    padding: 72px 40px;
    max-width: 900px;
    margin: 0 auto;
    text-align: center;
  }

  .pricing-strip h2 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(36px, 6vw, 56px);
    margin-bottom: 8px;
    letter-spacing: 0.04em;
  }

  .pricing-strip .sub {
    color: var(--muted);
    font-size: 15px;
    margin-bottom: 40px;
    font-weight: 300;
  }

  .pricing-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .p-card {
    background: var(--card);
    border-radius: 16px;
    border: 1px solid var(--rule);
    padding: 28px 24px;
    text-align: left;
    position: relative;
  }

  .p-card.featured {
    background: var(--ink);
    border-color: var(--ink);
  }

  .p-card.featured * { color: var(--paper); }
  .p-card.featured .p-muted { color: rgba(245,240,232,0.4); }
  .p-card.featured .p-amount { color: var(--accent); }

  .p-badge {
    position: absolute;
    top: -11px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--accent);
    color: white;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 100px;
    white-space: nowrap;
  }

  .p-tier { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }
  .p-amount { font-family: 'Bebas Neue', sans-serif; font-size: 48px; line-height: 1; color: var(--ink); }
  .p-muted { font-size: 12px; color: var(--muted); margin-bottom: 20px; }

  .p-features { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .p-features li { font-size: 13px; padding-left: 16px; position: relative; color: #3a3530; }
  .p-features li::before { content: '✓'; position: absolute; left: 0; color: var(--success); font-size: 11px; font-weight: 700; top: 1px; }
  .p-card.featured .p-features li { color: rgba(245,240,232,0.75); }
  .p-card.featured .p-features li::before { color: var(--accent); }

  /* ── FOOTER ── */
  footer {
    background: var(--ink);
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 36px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
  }

  .footer-logo { font-family: 'Bebas Neue', sans-serif; font-size: 24px; color: var(--paper); letter-spacing: 0.06em; }
  .footer-logo span { color: var(--accent); }

  .footer-copy { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: rgba(245,240,232,0.3); }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  @keyframes blink {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 1; }
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 640px) {
    nav { padding: 14px 20px; }
    .hero { padding: 48px 20px 36px; }
    .app-card-body { padding: 24px 20px 20px; }
    .form-grid { grid-template-columns: 1fr; }
    .type-grid { grid-template-columns: repeat(2, 1fr); }
    .pricing-cards { grid-template-columns: 1fr; }
    .output-section { padding: 0 20px; }
    .output-section.visible { padding: 0 16px; }
    footer { flex-direction: column; text-align: center; padding: 28px 20px; }
    .worksheet-body { padding: 20px; font-size: 13px; }
  }

  /* ── ERROR ── */
  .error-msg {
    background: #ffeae6;
    border: 1.5px solid var(--accent);
    border-radius: 10px;
    padding: 16px 20px;
    font-size: 13px;
    color: var(--accent);
    margin-top: 16px;
    display: none;
  }
  .error-msg.visible { display: block; }

  /* ── SYLLABUS BUTTONS ── */
  .syllabus-btn {
    padding: 14px 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    border: 1.5px solid var(--rule);
    border-radius: 10px;
    background: var(--paper);
    cursor: pointer;
    color: var(--muted);
    transition: all 0.15s;
    text-align: center;
    line-height: 1.3;
  }

  .syllabus-btn:hover { border-color: var(--ink); color: var(--ink); }

  .syllabus-btn.active {
    background: var(--ink);
    border-color: var(--ink);
    color: var(--paper);
  }

</style>
</head>
<body>

<!-- NAV -->
<nav>
  <a class="nav-logo" href="#">GRADE<span>MAXING</span></a>
  <span class="nav-tag">🇧🇳 Built for Brunei Students</span>
</nav>

<!-- API KEY WARNING BANNER -->
<div class="hero">
  <span class="hero-eyebrow">AI-Powered Study Sheets — Built Different 🎯</span>
  <h1>Stop Grinding.<br><em>Start Maxing.</em></h1>
  <p>Generate custom, print-ready worksheets for Brunei secondary students in seconds. SPN21 · IGCSE · O-Level. English & Bahasa Melayu.</p>
</div>

<!-- APP -->
<div class="app-card">
  <div class="app-card-header">
    <div class="dot red"></div>
    <div class="dot yellow"></div>
    <div class="dot green"></div>
    <span class="app-card-title">grademaxing.bn — let's get this grade</span>
  </div>
  <div class="app-card-body">

    <!-- SYLLABUS TRACK SELECTOR -->
    <div style="margin-bottom:24px;">
      <label style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:8px;">Syllabus / Curriculum Track</label>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;" id="syllabusSelector">
        <button class="syllabus-btn active" data-syllabus="SPN21" onclick="selectSyllabus(this)">
          <span style="font-size:20px;display:block;margin-bottom:4px;">🇧🇳</span>
          <strong>SPN21</strong>
          <span style="display:block;font-size:11px;opacity:0.65;margin-top:2px;font-weight:400;">Govt Schools</span>
        </button>
        <button class="syllabus-btn" data-syllabus="IGCSE" onclick="selectSyllabus(this)">
          <span style="font-size:20px;display:block;margin-bottom:4px;">📘</span>
          <strong>IGCSE</strong>
          <span style="display:block;font-size:11px;opacity:0.65;margin-top:2px;font-weight:400;">Cambridge Int'l</span>
        </button>
        <button class="syllabus-btn" data-syllabus="OLevel" onclick="selectSyllabus(this)">
          <span style="font-size:20px;display:block;margin-bottom:4px;">📗</span>
          <strong>O-Level</strong>
          <span style="display:block;font-size:11px;opacity:0.65;margin-top:2px;font-weight:400;">BC GCE</span>
        </button>
      </div>
      <div style="font-family:'DM Mono',monospace;font-size:10px;color:var(--muted);margin-top:8px;letter-spacing:0.04em;line-height:1.5;">
        ⚠️ Not sure? Check your child's report card or ask their school. Chapter lists are a helpful guide — not official MOE documents.
      </div>
    </div>

    <div class="form-grid">

      <!-- Subject -->
      <div class="form-group">
        <label>Subject</label>
        <select id="subject">
          <option value="">— Pick a subject —</option>
        </select>
      </div>

      <!-- Form Level -->
      <div class="form-group">
        <label>Form Level</label>
        <select id="level">
          <option value="">— Pick level —</option>
          <option value="Form 1">Form 1</option>
          <option value="Form 2">Form 2</option>
          <option value="Form 3">Form 3</option>
          <option value="Form 4">Form 4</option>
          <option value="Form 5">Form 5</option>
        </select>
      </div>


      <!-- Topic -->
      <div class="form-group full">
        <label>Topic / Chapter</label>
        <select id="topic" disabled>
          <option value="">— Pick subject &amp; level first —</option>
        </select>
        <div id="topicHint" style="font-size:11px;color:var(--muted);font-family:'DM Mono',monospace;margin-top:5px;letter-spacing:0.05em;display:none;">
          ✏️ Can't find your topic? <button onclick="enableCustomTopic()" style="background:none;border:none;color:var(--accent);cursor:pointer;font-family:'DM Mono',monospace;font-size:11px;text-decoration:underline;padding:0;">Type it manually</button>
        </div>
      </div>

      <!-- Worksheet Type -->
      <div class="form-group full">
        <label>Worksheet Type</label>
        <div class="type-grid">
          <button class="type-btn active" data-type="Practice Questions"><span>📝</span>Practice Questions</button>
          <button class="type-btn" data-type="Study Notes"><span>📖</span>Study Notes</button>
          <button class="type-btn" data-type="Revision Checklist"><span>✅</span>Revision Checklist</button>
          <button class="type-btn" data-type="Fill in the Blanks"><span>✏️</span>Fill in the Blanks</button>
        </div>
      </div>

      <!-- Difficulty -->
      <div class="form-group">
        <label>Difficulty</label>
        <div class="diff-toggle">
          <button class="diff-btn easy active" data-diff="Easy">Easy</button>
          <button class="diff-btn medium" data-diff="Medium">Medium</button>
          <button class="diff-btn hard" data-diff="Hard">Hard</button>
        </div>
      </div>

      <!-- Language -->
      <div class="form-group">
        <label>Language</label>
        <div class="lang-toggle">
          <button class="lang-btn active" data-lang="English">🇬🇧 English</button>
          <button class="lang-btn" data-lang="Bahasa Melayu">🇧🇳 Bahasa Melayu</button>
        </div>
      </div>

      <!-- Extra Notes -->
      <div class="form-group full">
        <label>Special Instructions (optional)</label>
        <textarea id="notes" placeholder="e.g. Focus on exam technique, include worked examples, follow SPN21 format, add answer key..."></textarea>
      </div>

    </div>

    <button class="generate-btn" id="generateBtn" onclick="generateWorksheet()">
      ⚡ GENERATE WORKSHEET
    </button>

    <div class="error-msg" id="errorMsg"></div>

  </div>
</div>

<!-- OUTPUT -->
<div class="output-section" id="outputSection">
  <div class="output-header">
    <div class="output-title">YOUR WORKSHEET</div>
    <div class="output-actions">
      <button class="btn-secondary" onclick="copyWorksheet()">📋 Copy</button>
      <button class="btn-primary" onclick="printWorksheet()">🖨️ Print / Save PDF</button>
    </div>
  </div>

  <div class="worksheet-display" id="worksheetDisplay">
    <div class="worksheet-header">
      <div class="ws-brand">GRADE<span>MAXING</span></div>
      <div class="ws-meta">
        <div class="ws-meta-title" id="wsTitle">WORKSHEET</div>
        <div class="ws-meta-sub" id="wsMeta"></div>
      </div>
    </div>
    <div class="worksheet-body" id="worksheetBody"></div>
  </div>
</div>

<!-- HOW IT WORKS -->
<div class="how-section">
  <h2>HOW IT <span>WORKS</span></h2>
  <div class="steps">
    <div class="step">
      <div class="step-num">1</div>
      <div class="step-title">Pick your subject & topic</div>
      <div class="step-desc">SPN21, IGCSE, O-Level — all covered bestie</div>
    </div>
    <div class="step">
      <div class="step-num">2</div>
      <div class="step-title">Set your preferences</div>
      <div class="step-desc">Set your level, difficulty, language. Your sheet, your rules.</div>
    </div>
    <div class="step">
      <div class="step-num">3</div>
      <div class="step-title">Generate in seconds</div>
      <div class="step-desc">AI cooks up a full worksheet in seconds. It's giving studious.</div>
    </div>
    <div class="step">
      <div class="step-num">4</div>
      <div class="step-title">Print or share</div>
      <div class="step-desc">Print it, share it, send it on the gc. Done.</div>
    </div>
  </div>
</div>

<!-- PRICING -->
<div class="pricing-strip">
  <h2>SIMPLE PRICING</h2>
  <p class="sub">No hidden fees. Cancel anytime. Built for Brunei students fr fr.</p>
  <div class="pricing-cards">

    <div class="p-card">
      <div class="p-tier">Free</div>
      <div class="p-amount">BND 0</div>
      <div class="p-muted">forever</div>
      <ul class="p-features">
        <li>3 worksheets / month</li>
        <li>English only</li>
        <li>2 subjects</li>
        <li>PDF download</li>
      </ul>
    </div>

    <div class="p-card featured">
      <div class="p-badge">Most Popular</div>
      <div class="p-tier">Pro</div>
      <div class="p-amount">BND 15</div>
      <div class="p-muted">per month</div>
      <ul class="p-features">
        <li>Unlimited worksheets</li>
        <li>English + Bahasa Melayu</li>
        <li>All subjects</li>
        <li>Answer keys included</li>
        <li>Shareable links</li>
      </ul>
    </div>

    <div class="p-card">
      <div class="p-tier">Centre</div>
      <div class="p-amount">BND 45</div>
      <div class="p-muted">per month</div>
      <ul class="p-features">
        <li>5 tutor seats</li>
        <li>All Pro features</li>
        <li>Custom branding</li>
        <li>Priority support</li>
      </ul>
    </div>

  </div>
</div>

<!-- FOOTER -->
<footer>
  <div class="footer-logo">GRADE<span>MAXING</span></div>
  <div class="footer-copy">Max Your Grades. No Cap. 🔥 — Brunei 🇧🇳 2026</div>
</footer>

<script>
  // ── SYLLABUS TRACK ──
  let selectedSyllabus = 'SPN21';

  function selectSyllabus(btn) {
    document.querySelectorAll('.syllabus-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedSyllabus = btn.dataset.syllabus;
    populateSubjects();
    populateTopics();
  }

  // ── CHAPTER DATABASE — ALL THREE TRACKS ──
  const SUBJECTS = {
    SPN21:  ['Mathematics','English Language','Bahasa Melayu','Combined Science','Islamic Religious Knowledge','History','Geography'],
    IGCSE:  ['Mathematics','English Language','Biology','Chemistry','Physics','History','Geography','Business Studies','ICT'],
    OLevel: ['Mathematics','English Language','Bahasa Melayu','Biology','Chemistry','Physics','Islamic Religious Knowledge','History','Geography','Commerce']
  };

  const CHAPTERS = {
    SPN21: {
      'Mathematics': {
        'Form 1': ['Whole Numbers','Number Patterns and Sequences','Fractions','Decimals','Percentages','Integers','Algebraic Expressions','Linear Equations','Ratios, Rates and Proportions','Basic Geometry','Perimeter and Area','Introduction to Statistics'],
        'Form 2': ['Directed Numbers','Squares, Square Roots, Cubes and Cube Roots','Algebraic Expressions II','Linear Equations II','Ratios, Rates and Proportions II','Pythagoras Theorem','Geometrical Constructions','Coordinates','Circles','Transformations','Statistics II'],
        'Form 3': ['Lines and Angles','Polygons','Circles II','Indices','Algebraic Expressions III','Algebraic Formulae','Linear Inequalities','Graphs of Functions','Trigonometry','Angles of Elevation and Depression','Statistics III'],
        'Form 4': ['Quadratic Expressions and Equations','Sets','Mathematical Reasoning','Straight Lines','Statistics IV','Probability I','Circles III','Trigonometry II','Plans and Elevations'],
        'Form 5': ['Number Bases','Graphs of Functions II','Transformations III','Matrices','Variations','Gradient and Area under a Graph','Probability II','Bearing','Earth as a Sphere','Plans and Elevations II']
      },
      'English Language': {
        'Form 1': ['Reading Comprehension — Narrative','Vocabulary in Context','Grammar: Nouns and Pronouns','Grammar: Verbs and Tenses','Grammar: Adjectives and Adverbs','Writing: Informal Letters','Writing: Descriptive Paragraphs','Spelling and Punctuation'],
        'Form 2': ['Reading Comprehension — Descriptive','Vocabulary Building','Grammar: Prepositions and Conjunctions','Grammar: Reported Speech','Grammar: Passive Voice','Writing: Formal Letters','Writing: Narrative Essays','Summary Writing'],
        'Form 3': ['Reading Comprehension — Argumentative','Advanced Vocabulary','Grammar: Conditionals','Grammar: Relative Clauses','Grammar: Modal Verbs','Writing: Argumentative Essays','Writing: Report Writing','Note-taking Skills'],
        'Form 4': ['Literature: Short Stories','Literature: Poetry','Essay Writing: Discursive','Essay Writing: Descriptive','Grammar Revision','Directed Writing','Summary and Response','Oral Skills'],
        'Form 5': ['Literature: Novel Study','Advanced Essay Writing','Critical Reading','Paper 1 — Reading Revision','Paper 2 — Writing Revision','Directed Writing Revision','Grammar Consolidation','Examination Preparation']
      },
      'Bahasa Melayu': {
        'Form 1': ['Teks Rencana','Teks Cerita','Teks Berita','Tatabahasa: Kata Nama','Tatabahasa: Kata Kerja','Tatabahasa: Kata Adjektif','Penulisan: Karangan Penceritaan','Penulisan: Karangan Deskriptif','Peribahasa Asas','Ejaan dan Tanda Baca'],
        'Form 2': ['Teks Ulasan','Teks Surat Rasmi','Teks Dialog','Tatabahasa: Kata Hubung','Tatabahasa: Ayat Majmuk','Tatabahasa: Imbuhan Awalan','Penulisan: Karangan Imaginatif','Penulisan: Surat Kiriman','Peribahasa','Pemahaman dan Rumusan'],
        'Form 3': ['Teks Ucapan','Teks Laporan','Teks Autobiografi','Tatabahasa: Imbuhan Akhiran','Tatabahasa: Kata Ganda','Tatabahasa: Ayat Pasif dan Aktif','Penulisan: Karangan Fakta','Simpulan Bahasa','Kemahiran Lisan'],
        'Form 4': ['Komsas: Puisi Tradisional','Komsas: Cerpen','Komsas: Drama','Tatabahasa Tinggi','Penulisan: Karangan Berformat','Penulisan: Karangan Tidak Berformat','Pemahaman Petikan','Rumusan','Lisan dan Sebutan'],
        'Form 5': ['Komsas: Novel','Komsas: Prosa Tradisional','Komsas: Puisi Moden','Ulasan Komsas','Penulisan Lanjutan','Tatabahasa Komprehensif','Pemahaman Peringkat Tinggi','Rumusan Lanjutan','Persediaan Peperiksaan']
      },
      'Combined Science': {
        'Form 1': ['Introduction to Science','Matter and Properties','Elements, Compounds and Mixtures','Cells — Basic Unit of Life','Human Body Systems','Plant Life','Forces and Motion','Energy','Light and Sound','Earth and Universe'],
        'Form 2': ['Nutrition and Digestion','Respiration','Reproduction','Ecosystems','Chemical Reactions','Acids, Bases and Salts','Electricity','Magnetism','Waves','Weather and Climate'],
        'Form 3': ['Genetics and Heredity','Periodic Table','Chemical Bonds','Organic Chemistry Basics','Heat','Pressure','Motion and Forces II','Environmental Science','Revision']
      },
      'Islamic Religious Knowledge': {
        'Form 1': ['Aqidah: Rukun Iman','Ibadah: Rukun Islam','Ibadah: Solat Fardhu','Ibadah: Puasa Ramadhan','Akhlak: Sifat Mahmudah','Al-Quran: Surah Pilihan','Sirah: Nabi Muhammad SAW','Fiqh: Bersuci dan Wudhu'],
        'Form 2': ['Aqidah: Sifat-sifat Allah','Ibadah: Zakat','Ibadah: Haji dan Umrah','Al-Quran: Tafsir','Sirah: Khulafa Ar-Rasyidin','Akhlak: Adab Harian','Fiqh: Kekeluargaan','Muamalat: Prinsip Asas'],
        'Form 3': ['Aqidah: Qada dan Qadar','Ibadah: Jenazah','Al-Quran: Ulumul Quran','Hadith: Hadith Pilihan','Sirah: Tamadun Islam','Akhlak: Akhlak Masyarakat','Fiqh: Jual Beli'],
        'Form 4': ['Aqidah Lanjutan','Ibadah Lanjutan','Fiqh Muamalat','Al-Quran dan Tafsir Lanjutan','Hadith dan Ulumul Hadith','Sirah Lanjutan','Undang-undang Islam'],
        'Form 5': ['Aqidah: Ulangkaji','Ibadah: Ulangkaji','Fiqh Lanjutan','Sirah dan Tamadun Islam','Al-Quran: Hafazan dan Tafsir','Akhlak Mulia','Persediaan Peperiksaan']
      },
      'History': {
        'Form 1': ['Early Human Civilisations','Ancient Civilisations of Asia','Coming of Islam','Malay Sultanates','Colonial Era in Southeast Asia','Brunei: Early Kingdom','Brunei: Sultanate Period','Brunei and Colonial Powers'],
        'Form 2': ['Industrial Revolution','World War I','Rise of Nationalism in Asia','Southeast Asian Nationalism','World War II','Japanese Occupation','Post-War Decolonisation','Formation of Nation States'],
        'Form 3': ['The Cold War','Southeast Asia Post-Independence','Formation of Malaysia','Brunei\\u2019s Path to Independence','Brunei Darussalam \\u2014 The Nation','ASEAN','Globalisation','Contemporary World Issues'],
        'Form 4': ['Brunei History — In Depth','British Influence in Brunei','Brunei Revolt 1962','Road to Independence','Wawasan Brunei 2035','Government and Constitution','Economy of Brunei'],
        'Form 5': ['Revision: Ancient to Colonial','Revision: World Wars','Revision: Nationalism','Revision: Brunei History','Essay Techniques','Source-based Questions','Examination Preparation']
      },
      'Geography': {
        'Form 1': ['Maps and Mapwork','The Earth\\u2019s Structure','Weather and Climate','Water Cycle and Rivers','Coasts','Population','Settlement','Agriculture'],
        'Form 2': ['Plate Tectonics and Earthquakes','Volcanoes','Tropical Rainforests','Deserts','Tourism','Industry','Transport','Environmental Issues'],
        'Form 3': ['Brunei Geography','Southeast Asian Geography','Economic Development','Energy Resources','Food Security','Urbanisation','Sustainable Development'],
        'Form 4': ['Physical Geography Revision','Human Geography Revision','Brunei in Depth','Regional Geography: Asia','Environmental Management','Geographical Skills'],
        'Form 5': ['Paper 1: Physical Geography','Paper 2: Human Geography','Mapwork and Practical Skills','Case Studies Review','Essay Writing in Geography','Examination Preparation']
      }
    },

    IGCSE: {
      'Mathematics': {
        'Form 1': ['Number: Types and Operations','Algebra: Introduction','Geometry: Lines and Angles','Measures and Mensuration','Statistics: Data Collection','Ratio and Proportion','Fractions, Decimals, Percentages'],
        'Form 2': ['Algebra: Expressions and Equations','Geometry: Triangles and Polygons','Pythagoras Theorem','Graphs and Functions','Probability: Basic Concepts','Statistics: Charts and Averages'],
        'Form 3': ['Algebra: Quadratics','Trigonometry: Sine, Cosine, Tangent','Circle Theorems','Vectors','Matrices','Transformation Geometry','Statistics: Cumulative Frequency'],
        'Form 4': ['Further Algebra','Further Trigonometry','Further Statistics','Calculus: Differentiation Intro','Set Language and Notation','Indices and Surds','Coordinate Geometry'],
        'Form 5': ['Exam Revision: Number and Algebra','Exam Revision: Geometry','Exam Revision: Statistics and Probability','Paper 1 Practice (Non-calculator)','Paper 2 Practice (Calculator)','Worked Solutions and Marking']
      },
      'English Language': {
        'Form 1': ['Reading: Skimming and Scanning','Reading: Inference Skills','Writing: Sentence Variety','Writing: Paragraphing','Vocabulary: Context Clues','Grammar: Tenses Review'],
        'Form 2': ['Reading: Summary Skills','Reading: Writer\\u2019s Craft','Writing: Descriptive Pieces','Writing: Narrative Pieces','Vocabulary: Figurative Language','Grammar: Complex Sentences'],
        'Form 3': ['Reading: Argumentative Texts','Directed Writing: Reports','Directed Writing: Articles','Directed Writing: Letters','Extended Writing: Essays','Comprehension Strategies'],
        'Form 4': ['Paper 1: Reading Passages','Paper 1: Directed Writing','Paper 2: Extended Writing','Transactional Writing Formats','Language Analysis','Exam Skills and Timing'],
        'Form 5': ['Past Paper Practice: Paper 1','Past Paper Practice: Paper 2','Common Errors and Corrections','Register and Audience','Examination Preparation','Marking Criteria Review']
      },
      'Biology': {
        'Form 4': ['Cell Structure and Organisation','Biological Molecules','Enzymes','Cell Membranes and Transport','Mitosis and the Cell Cycle','Nutrition in Humans','Nutrition in Plants','Respiration'],
        'Form 5': ['Gas Exchange','Excretion','Coordination and Response','Hormones','Homeostasis','Reproduction','Inheritance and Genetics','Evolution and Biodiversity']
      },
      'Chemistry': {
        'Form 4': ['Particles and Atomic Structure','Formula, Equations and Amounts','Electrons and Bonding','Energetics','Rates of Reaction','Reversible Reactions and Equilibrium','Acids, Bases and Salts'],
        'Form 5': ['The Periodic Table','Group 1 and Group 7','Transition Metals','Extracting Metals','Organic Chemistry: Alkanes and Alkenes','Alcohols and Carboxylic Acids','Polymers and Polymerisation']
      },
      'Physics': {
        'Form 4': ['Motion','Forces','Momentum','Work, Energy and Power','Pressure','Thermal Energy','Waves and Sound'],
        'Form 5': ['Light and Optics','Electrostatics','Current and Resistance','Circuits','Electromagnetism','Space Physics','Radioactivity and Nuclear Energy']
      },
      'History': {
        'Form 4': ['World War I: Causes','World War I: Events and Outcomes','Rise of Dictators: Stalin','Rise of Dictators: Hitler','Rise of Dictators: Mussolini','League of Nations','Road to World War II'],
        'Form 5': ['World War II: Key Events','The Cold War','Korean War and Vietnam War','Cuban Missile Crisis','End of Cold War','Source-based Skills','Examination Preparation']
      },
      'Geography': {
        'Form 4': ['Population Dynamics','Migration','Settlement and Urbanisation','Economic Activity','Agricultural Systems','Industrial Systems','Tourism'],
        'Form 5': ['Hazardous Environments','Coasts','Rivers','Energy and Water Resources','Environmental Management','Geographical Investigation Skills','Examination Preparation']
      },
      'Business Studies': {
        'Form 4': ['Business Activity and Objectives','Types of Business Organisation','Business Stakeholders','Business Communication','Production and Productivity','Marketing: Concepts and Mix'],
        'Form 5': ['Financial Information','Sources of Finance','Human Resources','Business and its Environment','Marketing Research','Examination Preparation']
      },
      'ICT': {
        'Form 4': ['Hardware and Software','Input and Output Devices','Storage','Networks and the Internet','Data Representation','Databases','Spreadsheets'],
        'Form 5': ['Programming Concepts','Algorithms and Flowcharts','Systems Analysis and Design','Security and Privacy','Impact of ICT on Society','Examination Preparation']
      }
    },

    OLevel: {
      'Mathematics': {
        'Form 4': ['Numbers and Computation','Algebraic Manipulation','Functions and Graphs','Geometry: Circles and Polygons','Trigonometry','Statistics and Probability','Vectors in 2D'],
        'Form 5': ['Further Algebra: Quadratics','Further Trigonometry','Further Statistics','Coordinate Geometry','Applications of Mathematics','Paper 1 and 2 Revision','Examination Preparation']
      },
      'English Language': {
        'Form 4': ['Comprehension: Factual and Inferential','Summary Writing','Directed Writing: Transactional','Composition Writing','Language and Grammar','Oral: Reading Aloud and Conversation'],
        'Form 5': ['Paper 1 Revision','Paper 2 Revision','Comprehension Strategies','Writing Accuracy and Style','Vocabulary in Use','Examination Preparation']
      },
      'Bahasa Melayu': {
        'Form 4': ['Pemahaman: Teks Pelbagai Genre','Rumusan','Penulisan: Karangan Berformat','Penulisan: Karangan Bebas','Tatabahasa Peringkat Tinggi','Lisan: Sebutan dan Intonasi'],
        'Form 5': ['Ulangkaji Kertas 1','Ulangkaji Kertas 2','Komsas Lanjutan','Strategi Menjawab Soalan','Latihan Kertas Lepas','Persediaan Peperiksaan']
      },
      'Biology': {
        'Form 4': ['Cell Biology','Nutrition','Respiration','Excretion','Coordination in Plants and Animals'],
        'Form 5': ['Reproduction','Genetics and Heredity','Evolution','Microorganisms','Biotechnology','Examination Preparation']
      },
      'Chemistry': {
        'Form 4': ['Atomic Structure and Bonding','Stoichiometry','Acids, Bases and Salts','Oxidation and Reduction','Energetics'],
        'Form 5': ['The Periodic Table','Metals and Extraction','Organic Chemistry','Electrochemistry','Environmental Chemistry','Examination Preparation']
      },
      'Physics': {
        'Form 4': ['Kinematics and Dynamics','Thermal Physics','Waves','Electricity and Magnetism'],
        'Form 5': ['Nuclear Physics','Light and Optics','Alternating Current','Electronics','Examination Preparation']
      },
      'Islamic Religious Knowledge': {
        'Form 4': ['Aqidah Lanjutan','Ibadah dan Muamalat','Fiqh: Kekeluargaan dan Masyarakat','Sirah Nabawi Lanjutan','Al-Quran: Tafsir dan Tadabbur'],
        'Form 5': ['Ulangkaji Aqidah','Ulangkaji Ibadah','Ulangkaji Fiqh','Akhlak dan Tasawwuf','Persediaan Peperiksaan']
      },
      'History': {
        'Form 4': ['Brunei History: Pre-Colonial to Colonial','Brunei Under British Influence','Road to Independence 1984','Nation Building Post-Independence','Wawasan Brunei 2035'],
        'Form 5': ['Southeast Asia in the 20th Century','Cold War and Its Impact on Asia','ASEAN: Formation and Role','Globalisation','Examination Preparation']
      },
      'Geography': {
        'Form 4': ['Physical Environments: Landforms','Ecosystems and Biomes','Population and Settlement','Economic Geography','Resource Management'],
        'Form 5': ['Environmental Hazards','Development and Inequality','Globalisation','Brunei in a Global Context','Examination Preparation']
      },
      'Commerce': {
        'Form 4': ['Trade and Commerce Basics','Types of Business','Marketing and Distribution','Financial Services','Insurance'],
        'Form 5': ['International Trade','Transport and Communication','Consumer Protection','Business Documents','Examination Preparation']
      }
    }
  };

  let customTopicMode = false;

  function populateSubjects() {
    const subjectEl = document.getElementById('subject');
    const levelEl = document.getElementById('level');
    const subjects = SUBJECTS[selectedSyllabus] || [];

    // Update subjects
    subjectEl.innerHTML = '<option value="">— Pick a subject —</option>';
    subjects.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s; opt.textContent = s;
      subjectEl.appendChild(opt);
    });

    // Update levels based on syllabus track
    const allLevels = ['Form 1','Form 2','Form 3','Form 4','Form 5'];
    // IGCSE and O-Level only have Form 4-5 chapters; SPN21 has Form 1-5
    const levels = (selectedSyllabus === 'SPN21')
      ? allLevels
      : ['Form 4','Form 5'];

    levelEl.innerHTML = '<option value="">— Pick level —</option>';
    levels.forEach(l => {
      const opt = document.createElement('option');
      opt.value = l; opt.textContent = l;
      levelEl.appendChild(opt);
    });

    // Reset topic
    populateTopics();
  }

  function enableCustomTopic() {
    customTopicMode = true;
    const topicEl = document.getElementById('topic');
    const hint = document.getElementById('topicHint');
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'topic';
    input.placeholder = 'Type your topic or chapter...';
    topicEl.replaceWith(input);
    hint.innerHTML = '← <button onclick="resetTopicDropdown()" style="background:none;border:none;color:var(--accent2);cursor:pointer;font-family:\\'DM Mono\\',monospace;font-size:11px;text-decoration:underline;padding:0;">Back to chapter list</button>';
  }

  function resetTopicDropdown() {
    customTopicMode = false;
    const topicEl = document.getElementById('topic');
    const select = document.createElement('select');
    select.id = 'topic';
    topicEl.replaceWith(select);
    const hint = document.getElementById('topicHint');
    hint.innerHTML = '✏️ Can\\'t find your topic? <button onclick="enableCustomTopic()" style="background:none;border:none;color:var(--accent);cursor:pointer;font-family:\\'DM Mono\\',monospace;font-size:11px;text-decoration:underline;padding:0;">Type it manually</button>';
    populateTopics();
  }

  function populateTopics() {
    if (customTopicMode) return;
    const subject = document.getElementById('subject').value;
    const level = document.getElementById('level').value;
    const topicEl = document.getElementById('topic');
    const hint = document.getElementById('topicHint');
    if (!topicEl || topicEl.tagName !== 'SELECT') return;

    topicEl.innerHTML = '';

    if (!subject || !level) {
      topicEl.disabled = true;
      topicEl.innerHTML = '<option value="">— Pick subject &amp; level first —</option>';
      if (hint) hint.style.display = 'none';
      return;
    }

    const chapters = CHAPTERS[selectedSyllabus]?.[subject]?.[level];

    if (!chapters || chapters.length === 0) {
      topicEl.disabled = false;
      topicEl.innerHTML = '<option value="">— Type your topic manually below —</option>';
      if (hint) hint.style.display = 'block';
      return;
    }

    topicEl.disabled = false;
    topicEl.innerHTML = '<option value="">— Select a chapter —</option>';
    chapters.forEach(ch => {
      const opt = document.createElement('option');
      opt.value = ch;
      opt.textContent = ch;
      topicEl.appendChild(opt);
    });
    if (hint) hint.style.display = 'block';
  }

  document.getElementById('subject').addEventListener('change', populateTopics);
  document.getElementById('level').addEventListener('change', populateTopics);

  // ── INIT ──
  // Init subjects on load
  populateSubjects();



  // ── STATE ──
  let selectedType = 'Practice Questions';
  let selectedDiff = 'Easy';
  let selectedLang = 'English';

  // ── TYPE BUTTONS ──
  document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedType = btn.dataset.type;
    });
  });

  // ── DIFFICULTY BUTTONS ──
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDiff = btn.dataset.diff;
    });
  });

  // ── LANGUAGE TOGGLE ──
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedLang = btn.dataset.lang;
    });
  });

  // ── GENERATE ──
  async function generateWorksheet() {
    const subject = document.getElementById('subject').value;
    const level = document.getElementById('level').value;
    const topicEl = document.getElementById('topic');
    const topic = topicEl ? topicEl.value.trim() : '';
    const notes = document.getElementById('notes').value.trim();
    const errorMsg = document.getElementById('errorMsg');

    // Validation
    if (!subject || !level || !topic) {
      errorMsg.textContent = '⚠️  Please fill in Subject, Level, and Topic before generating.';
      errorMsg.classList.add('visible');
      return;
    }

    errorMsg.classList.remove('visible');

    const btn = document.getElementById('generateBtn');
    btn.disabled = true;
    btn.textContent = 'GENERATING...';

    // Show loading
    const outputSection = document.getElementById('outputSection');
    const worksheetBody = document.getElementById('worksheetBody');
    const worksheetDisplay = document.getElementById('worksheetDisplay');

    outputSection.classList.add('visible');
    outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    worksheetBody.innerHTML = \`
      <div class="loading-state">
        <div class="spinner"></div>
        <div class="loading-text">Building your worksheet</div>
        <div class="loading-dots"><span>.</span><span>.</span><span>.</span></div>
      </div>
    \`;

    // Set header meta
    document.getElementById('wsTitle').textContent = \`\${subject.toUpperCase()} — \${level.toUpperCase()}\`;
    document.getElementById('wsMeta').textContent = \`\${topic.toUpperCase()} · \${selectedType.toUpperCase()} · \${selectedDiff.toUpperCase()} · \${selectedLang.toUpperCase()}\`;

    // Build prompt
    const isBM = selectedLang === 'Bahasa Melayu';

    const systemPrompt = \`You are an expert educator and curriculum specialist for Brunei's secondary school system. You create high-quality, professionally formatted worksheets that are perfectly aligned to the Brunei secondary curriculum including SPN21, IGCSE, and O-Level standards.

Your worksheets are:
- Clear, well-structured, and age-appropriate
- Properly formatted with sections, numbering, and spacing
- Curriculum-aligned and academically rigorous
- Immediately print-ready

\${isBM ? 'Write entirely in Bahasa Melayu. Use proper formal Malay.' : 'Write in clear, academic English.'}

Never add meta-commentary. Output ONLY the worksheet content itself.\`;

    const userPrompt = \`Create a \${selectedType} worksheet for the following:

Subject: \${subject}
Level: \${level} (Brunei Secondary)
Topic: \${topic}
Difficulty: \${selectedDiff}
Language: \${selectedLang}
Worksheet Type: \${selectedType}
\${notes ? \`Special Instructions: \${notes}\` : ''}

Format it as a complete, ready-to-print worksheet. Include:
- A clear title and header area (Name: ___, Date: ___, Class: ___)
- Well-numbered questions or sections
- Appropriate spacing for student answers
- \${selectedType === 'Practice Questions' ? 'At least 8-12 questions of varying formats (MCQ, short answer, structured)' : ''}
\${selectedType === 'Study Notes' ? '- Key concepts, definitions, examples, and summary points' : ''}
\${selectedType === 'Revision Checklist' ? '- Checkboxes ([ ]) for each topic/concept to be revised' : ''}
\${selectedType === 'Fill in the Blanks' ? '- Sentences with blanks (___) and a word bank' : ''}
- A footer with "Generated by Grade Maxing — grademaxing.bn"

Make it comprehensive, educationally sound, and Brunei curriculum-relevant.\`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          level,
          topic,
          type: selectedType,
          difficulty: selectedDiff,
          language: selectedLang,
          notes,
          syllabus: selectedSyllabus
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || \`Request failed (\${response.status})\`);
      }

      if (!data.worksheet) throw new Error('No content returned. Please try again.');

      worksheetBody.style.whiteSpace = 'pre-wrap';
      worksheetBody.textContent = data.worksheet;

    } catch (err) {
      worksheetBody.innerHTML = \`
        <div style="padding:32px;">
          <div style="color:var(--accent);font-family:'DM Mono',monospace;font-size:13px;margin-bottom:16px;">
            ⚠️ \${err.message}
          </div>
          <div style="font-size:12px;color:var(--muted);line-height:1.6;">
            Make sure the server is running and your API key is set in the Render dashboard.
          </div>
        </div>\`;
    }

    btn.disabled = false;
    btn.innerHTML = '⚡ GENERATE WORKSHEET';
  }

  // ── COPY ──
  async function copyWorksheet() {
    const text = document.getElementById('worksheetBody').textContent;
    if (!text || text.includes('loading-state')) return;
    try {
      await navigator.clipboard.writeText(text);
      const btn = event.target;
      btn.textContent = '✅ Copied!';
      setTimeout(() => btn.textContent = '📋 Copy', 2000);
    } catch(e) {
      alert('Copy failed. Please select and copy manually.');
    }
  }

  // ── PRINT ──
  function printWorksheet() {
    const title = document.getElementById('wsTitle').textContent;
    const meta = document.getElementById('wsMeta').textContent;
    const body = document.getElementById('worksheetBody').textContent;
    if (!body || body.includes('loading-state')) return;

    const printWin = window.open('', '_blank');
    printWin.document.write(\`
      <!DOCTYPE html>
      <html>
      <head>
        <title>\${title} — Grade Maxing</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=DM+Mono&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'DM Sans', sans-serif; font-size: 13px; line-height: 1.7; color: #111; max-width: 720px; margin: 0 auto; padding: 32px 28px; }
          .ws-header { border-bottom: 2px solid #111; padding-bottom: 14px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
          .ws-logo { font-size: 20px; font-weight: 900; letter-spacing: 2px; }
          .ws-logo span { color: #ff4d00; }
          .ws-info { text-align: right; font-family: 'DM Mono', monospace; font-size: 10px; color: #888; }
          .ws-info strong { font-size: 15px; color: #111; font-family: 'DM Sans', sans-serif; font-weight: 700; display: block; margin-bottom: 2px; }
          pre { white-space: pre-wrap; font-family: 'DM Sans', sans-serif; font-size: 13px; line-height: 1.75; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="ws-header">
          <div class="ws-logo">GRADE<span>MAXING</span></div>
          <div class="ws-info"><strong>\${title}</strong>\${meta}</div>
        </div>
        <pre>\${body}</pre>
      </body>
      </html>
    \`);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => printWin.print(), 500);
  }

  // ── ENTER KEY on notes ──
  document.getElementById('notes').addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.ctrlKey) generateWorksheet();
  });
</script>

</body>
</html>
`;
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(HTML);
});

app.post('/api/generate', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured.' });
  const { subject, level, topic, type, difficulty, language, notes, syllabus } = req.body;
  if (!subject || !level || !topic) return res.status(400).json({ error: 'Missing fields.' });
  const isBM = language === 'Bahasa Melayu';
  const systemPrompt = isBM ? 'Anda pakar pendidikan Brunei. Cipta lembaran kerja dalam Bahasa Melayu formal. Output kandungan sahaja.' : 'You are an expert educator for Brunei secondary students. Create high-quality worksheets aligned to SPN21/IGCSE/O-Level. Output ONLY worksheet content.';
  const parts = ['Create a ', type, ' worksheet. Syllabus: ', syllabus, '. Subject: ', subject, '. Level: ', level, '. Topic: ', topic, '. Difficulty: ', difficulty, '. Language: ', language, notes ? '. Instructions: ' + notes : '', '\n\nInclude: title, header (Name/Date/Class), numbered questions, answer space', type === 'Practice Questions' ? ', 8-12 varied questions (MCQ, short answer, structured)' : '', type === 'Study Notes' ? ', key concepts/definitions/examples/summary' : '', type === 'Revision Checklist' ? ', checkboxes [ ] for every concept' : '', type === 'Fill in the Blanks' ? ', blanks ___ with word bank' : '', '. Footer: Generated by Grade Maxing.'];
  const userPrompt = parts.join('');
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 2500, system: systemPrompt, messages: [{ role: 'user', content: userPrompt }] })
    });
    if (!response.ok) { const e = await response.json().catch(() => ({})); return res.status(response.status).json({ error: e?.error?.message || 'API failed.' }); }
    const data = await response.json();
    const text = data.content?.map(b => b.text || '').join('') || '';
    if (!text) return res.status(500).json({ error: 'Empty response. Try again.' });
    res.json({ worksheet: text });
  } catch (err) { res.status(500).json({ error: err.message || 'Server error.' }); }
});

app.listen(PORT, () => console.log('Grade Maxing live on port ' + PORT));
