/**
 * High-Converting Dark-Mode SaaS Landing Page + Interactive Accessibility Studio.
 * Zero external scripts or CDNs; 100% self-contained for lightning speed and security.
 */

export function renderLandingHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ContrastGuard API — WCAG 2.1 & APCA Color Contrast Analyzer, Auto-Fixer & Accessible Palette Generator</title>
  <meta name="description" content="Production-grade, ultra-fast (<2ms) in-memory WCAG 2.1 AA/AAA and APCA color contrast analyzer, auto-fixer, color blindness simulator, and palette generator.">
  <style>
    :root {
      --bg-dark: #090D16;
      --bg-card: rgba(18, 24, 38, 0.7);
      --bg-card-hover: rgba(24, 32, 52, 0.85);
      --border-color: rgba(255, 255, 255, 0.08);
      --border-accent: rgba(16, 185, 129, 0.4);
      --text-main: #FFFFFF;
      --text-muted: #94A3B8;
      --text-dim: #64748B;
      --accent-emerald: #10B981;
      --accent-cyan: #06B6D4;
      --accent-blue: #3B82F6;
      --accent-purple: #8B5CF6;
      --accent-rose: #F43F5E;
      --accent-amber: #F59E0B;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }

    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      line-height: 1.5;
      overflow-x: hidden;
    }

    /* Ambient Glow Backgrounds */
    .glow-top {
      position: absolute;
      top: -120px;
      left: 50%;
      transform: translateX(-50%);
      width: 900px;
      height: 450px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 40%, rgba(9, 13, 22, 0) 70%);
      pointer-events: none;
      z-index: 0;
    }

    /* Container */
    .container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 24px;
      position: relative;
      z-index: 1;
    }

    /* Navigation Bar */
    header {
      padding: 20px 0;
      border-bottom: 1px solid var(--border-color);
      backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(9, 13, 22, 0.85);
    }
    .nav-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: #fff;
    }
    .brand-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, var(--accent-emerald), var(--accent-cyan));
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 19px;
      color: #090D16;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
    }
    .brand-name {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .brand-name span {
      background: linear-gradient(90deg, var(--accent-emerald), var(--accent-cyan));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .nav-links a {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: color 0.2s;
    }
    .nav-links a:hover {
      color: #FFF;
    }
    .badge-speed {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: var(--accent-emerald);
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .pulse-dot {
      width: 6px;
      height: 6px;
      background: var(--accent-emerald);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--accent-emerald);
    }
    .btn-rapidapi {
      background: linear-gradient(135deg, #0052CC 0%, #0065FF 100%);
      color: #FFF;
      text-decoration: none;
      padding: 9px 18px;
      border-radius: 8px;
      font-size: 13.5px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 14px rgba(0, 101, 255, 0.3);
      transition: all 0.2s;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .btn-rapidapi:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(0, 101, 255, 0.45);
    }

    /* Hero Section */
    .hero {
      padding: 64px 0 48px;
      text-align: center;
    }
    .hero-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.25);
      color: var(--accent-cyan);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      padding: 6px 14px;
      border-radius: 999px;
      margin-bottom: 20px;
    }
    .hero h1 {
      font-size: clamp(32px, 5vw, 56px);
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -1.5px;
      max-width: 960px;
      margin: 0 auto 20px;
      color: #FFFFFF;
    }
    .hero h1 .gradient-text {
      background: linear-gradient(90deg, #10B981, #06B6D4, #3B82F6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-subtitle {
      font-size: 17px;
      color: var(--text-muted);
      max-width: 780px;
      margin: 0 auto 32px;
    }
    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 32px;
      flex-wrap: wrap;
      margin-bottom: 36px;
    }
    .stat-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--text-muted);
      background: rgba(255, 255, 255, 0.03);
      padding: 6px 14px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
    }
    .stat-pill strong {
      color: #FFF;
    }

    /* Interactive Studio Section */
    .studio-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 18px;
      padding: 32px;
      backdrop-filter: blur(20px);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
      margin-bottom: 64px;
    }
    .studio-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 20px;
      margin-bottom: 28px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .studio-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .studio-title h2 {
      font-size: 22px;
      font-weight: 700;
    }
    .studio-meta {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .latency-pill {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.25);
      color: var(--accent-emerald);
      padding: 5px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      font-family: monospace;
    }

    /* Studio Layout */
    .studio-grid {
      display: grid;
      grid-template-columns: 1fr 1.35fr;
      gap: 32px;
    }
    @media (max-width: 960px) {
      .studio-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Studio Controls (Left) */
    .control-group {
      margin-bottom: 22px;
    }
    .control-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
    }
    .color-input-wrapper {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    input[type="color"] {
      -webkit-appearance: none;
      border: none;
      width: 44px;
      height: 44px;
      border-radius: 10px;
      cursor: pointer;
      background: none;
      padding: 0;
    }
    input[type="color"]::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    input[type="color"]::-webkit-color-swatch {
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
    }
    .hex-input {
      flex: 1;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
      color: #FFF;
      font-family: monospace;
      font-size: 15px;
      font-weight: 600;
      padding: 10px 14px;
      border-radius: 10px;
      outline: none;
      transition: border 0.2s;
    }
    .hex-input:focus {
      border-color: var(--accent-cyan);
    }
    .preset-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 12px;
    }
    .btn-preset {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 11.5px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-preset:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #FFF;
      border-color: rgba(255, 255, 255, 0.2);
    }

    .level-toggle {
      display: grid;
      grid-template-columns: 1fr 1fr;
      background: rgba(0, 0, 0, 0.3);
      padding: 4px;
      border-radius: 10px;
      border: 1px solid var(--border-color);
      gap: 6px;
    }
    .level-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 8px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .level-btn.active {
      background: var(--accent-emerald);
      color: #090D16;
      box-shadow: 0 2px 10px rgba(16, 185, 129, 0.3);
    }

    /* Live Preview & Badges (Right) */
    .preview-box {
      border-radius: 14px;
      padding: 24px;
      margin-bottom: 24px;
      border: 1px solid var(--border-color);
      transition: background-color 0.2s, color 0.2s;
      min-height: 180px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .preview-heading {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .preview-body {
      font-size: 14px;
      margin-bottom: 16px;
      opacity: 0.95;
    }
    .preview-actions {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }
    .preview-button {
      padding: 8px 18px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      border: 1px solid currentColor;
      background: transparent;
      cursor: pointer;
    }

    /* Contrast Metrics Bar */
    .metrics-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(0, 0, 0, 0.3);
      padding: 16px 20px;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 14px;
    }
    .ratio-display {
      display: flex;
      align-items: baseline;
      gap: 10px;
    }
    .ratio-num {
      font-size: 36px;
      font-weight: 800;
      letter-spacing: -1px;
      color: #FFF;
      font-family: monospace;
    }
    .grade-badge {
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .grade-pass {
      background: rgba(16, 185, 129, 0.2);
      color: var(--accent-emerald);
      border: 1px solid rgba(16, 185, 129, 0.4);
    }
    .grade-fail {
      background: rgba(244, 63, 94, 0.2);
      color: var(--accent-rose);
      border: 1px solid rgba(244, 63, 94, 0.4);
    }
    .apca-pill {
      font-size: 12.5px;
      color: var(--text-muted);
      background: rgba(255, 255, 255, 0.04);
      padding: 6px 12px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
    }
    .apca-pill strong {
      color: var(--accent-cyan);
      font-family: monospace;
    }

    /* WCAG Checklist Grid */
    .checklist-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 22px;
    }
    @media (max-width: 640px) {
      .checklist-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .check-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 12px;
      text-align: center;
    }
    .check-title {
      font-size: 11px;
      text-transform: uppercase;
      color: var(--text-dim);
      font-weight: 700;
      margin-bottom: 4px;
    }
    .check-req {
      font-size: 11px;
      color: var(--text-muted);
      margin-bottom: 6px;
    }
    .status-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .status-pass {
      background: rgba(16, 185, 129, 0.15);
      color: var(--accent-emerald);
    }
    .status-fail {
      background: rgba(244, 63, 94, 0.15);
      color: var(--accent-rose);
    }

    /* Auto Fixer Section */
    .autofix-box {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    .autofix-info {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .autofix-icon {
      width: 36px;
      height: 36px;
      background: var(--accent-emerald);
      color: #090D16;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: bold;
      flex-shrink: 0;
    }
    .autofix-text h4 {
      font-size: 14px;
      font-weight: 600;
    }
    .autofix-text p {
      font-size: 12px;
      color: var(--text-muted);
    }
    .btn-apply-fix {
      background: var(--accent-emerald);
      color: #090D16;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-apply-fix:hover {
      box-shadow: 0 0 16px rgba(16, 185, 129, 0.4);
      transform: translateY(-1px);
    }

    /* Color Blindness Simulation Section */
    .cb-section {
      margin-bottom: 22px;
    }
    .cb-heading {
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--text-dim);
      margin-bottom: 10px;
      letter-spacing: 0.5px;
    }
    .cb-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    @media (max-width: 640px) {
      .cb-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .cb-card {
      border-radius: 10px;
      padding: 10px;
      text-align: center;
      border: 1px solid var(--border-color);
      transition: transform 0.2s;
    }
    .cb-card-title {
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .cb-card-sub {
      font-size: 10px;
      margin-bottom: 6px;
    }
    .cb-card-ratio {
      font-size: 12px;
      font-family: monospace;
      font-weight: 700;
    }

    /* JSON Drawer */
    .json-preview {
      background: #05080E;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 14px;
      max-height: 220px;
      overflow-y: auto;
      font-family: 'Courier New', Courier, monospace;
      font-size: 11.5px;
      color: #38BDF8;
      white-space: pre-wrap;
    }

    /* Feature Grid Section */
    .features {
      padding: 48px 0 64px;
    }
    .section-title {
      text-align: center;
      margin-bottom: 40px;
    }
    .section-title h3 {
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 10px;
    }
    .section-title p {
      color: var(--text-muted);
      font-size: 15px;
      max-width: 600px;
      margin: 0 auto;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
    @media (max-width: 860px) {
      .features-grid {
        grid-template-columns: 1fr;
      }
    }
    .feat-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 24px;
      transition: all 0.2s;
    }
    .feat-card:hover {
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
    .feat-icon {
      font-size: 26px;
      margin-bottom: 14px;
    }
    .feat-card h4 {
      font-size: 17px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #FFF;
    }
    .feat-card p {
      font-size: 13.5px;
      color: var(--text-muted);
      line-height: 1.6;
    }

    /* RapidAPI CTA Box */
    .cta-banner {
      background: linear-gradient(135deg, rgba(0, 101, 255, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%);
      border: 1px solid rgba(0, 101, 255, 0.4);
      border-radius: 18px;
      padding: 48px 32px;
      text-align: center;
      margin-bottom: 64px;
      position: relative;
      overflow: hidden;
    }
    .cta-banner h3 {
      font-size: 30px;
      font-weight: 800;
      margin-bottom: 12px;
    }
    .cta-banner p {
      font-size: 16px;
      color: var(--text-muted);
      max-width: 680px;
      margin: 0 auto 28px;
    }

    /* Footer */
    footer {
      border-top: 1px solid var(--border-color);
      padding: 32px 0 48px;
      text-align: center;
      color: var(--text-dim);
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="glow-top"></div>

  <!-- Header -->
  <header>
    <div class="container nav-wrapper">
      <a href="/" class="brand">
        <div class="brand-icon">CG</div>
        <div class="brand-name">Contrast<span>Guard</span></div>
      </a>
      <div class="nav-links">
        <span class="badge-speed"><span class="pulse-dot"></span> 100% In-Memory • &lt;2ms</span>
        <a href="#studio">Live Studio</a>
        <a href="#features">Color Science</a>
        <a href="#endpoints">API Reference</a>
        <a href="https://rapidapi.com/artuturoh/api/contrastguard-wcag-color-contrast-and-accessibility-fixer" target="_blank" rel="noopener" class="btn-rapidapi">
          Get API Key on RapidAPI ⚡
        </a>
      </div>
    </div>
  </header>

  <main class="container">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-eyebrow">⚡ Ultra-Fast In-Memory Accessibility Engine</div>
      <h1>WCAG 2.1 & APCA <span class="gradient-text">Color Contrast Analyzer</span>, Auto-Fixer & Palette Generator</h1>
      <p class="hero-subtitle">
        Eliminate accessibility penalties with exact mathematical relative luminance, WCAG 2.1 AA/AAA validation,
        APCA perceptual contrast scoring, 1-click HSL lightness auto-fixing, and Brettel/Viénot color blindness simulations in &lt;2ms.
      </p>

      <div class="hero-stats">
        <div class="stat-pill"><strong>WCAG 2.1</strong> AA / AAA Standard</div>
        <div class="stat-pill"><strong>APCA Lc</strong> WCAG 3.0 Candidate</div>
        <div class="stat-pill"><strong>Brettel/Viénot</strong> 4-Condition Vision Simulation</div>
        <div class="stat-pill"><strong>Tailwind</strong> 11-Step Shade Generator</div>
      </div>
    </section>

    <!-- Interactive Live Accessibility Studio -->
    <section id="studio" class="studio-card">
      <div class="studio-header">
        <div class="studio-title">
          <h2>🎨 Interactive Accessibility Studio</h2>
        </div>
        <div class="studio-meta">
          <span class="latency-pill" id="latencyBadge">⚡ latency: 0.32ms</span>
          <span class="badge-speed">Live Server Connected</span>
        </div>
      </div>

      <div class="studio-grid">
        <!-- Controls (Left) -->
        <div class="studio-controls">
          <div class="control-group">
            <div class="control-label">
              <span>Foreground Color</span>
              <span id="fgHslLabel" style="font-family: monospace;">hsl(217.2, 91.2%, 59.8%)</span>
            </div>
            <div class="color-input-wrapper">
              <input type="color" id="fgColorPicker" value="#3B82F6" title="Choose Foreground Color">
              <input type="text" id="fgHexInput" class="hex-input" value="#3B82F6" maxlength="9">
            </div>
          </div>

          <div class="control-group">
            <div class="control-label">
              <span>Background Color</span>
              <span id="bgHslLabel" style="font-family: monospace;">hsl(222.2, 47.4%, 11.2%)</span>
            </div>
            <div class="color-input-wrapper">
              <input type="color" id="bgColorPicker" value="#0F172A" title="Choose Background Color">
              <input type="text" id="bgHexInput" class="hex-input" value="#0F172A" maxlength="9">
            </div>
          </div>

          <div class="control-group">
            <div class="control-label"><span>Quick Presets</span></div>
            <div class="preset-buttons">
              <button type="button" class="btn-preset" onclick="setColors('#3B82F6', '#0F172A')">Dark Modern</button>
              <button type="button" class="btn-preset" onclick="setColors('#10B981', '#064E3B')">Emerald Deep</button>
              <button type="button" class="btn-preset" onclick="setColors('#94A3B8', '#FFFFFF')">Low Contrast (Fails)</button>
              <button type="button" class="btn-preset" onclick="setColors('#FFFFFF', '#18181B')">OLED Dark</button>
              <button type="button" class="btn-preset" onclick="setColors('#0F172A', '#F8FAFC')">Light Slate</button>
            </div>
          </div>

          <div class="control-group">
            <div class="control-label"><span>Target WCAG Level</span></div>
            <div class="level-toggle">
              <button type="button" id="btnLevelAA" class="level-btn active" onclick="setTargetLevel('AA')">AA (4.5:1)</button>
              <button type="button" id="btnLevelAAA" class="level-btn" onclick="setTargetLevel('AAA')">AAA (7.0:1)</button>
            </div>
          </div>
        </div>

        <!-- Live Output & Preview (Right) -->
        <div class="studio-output">
          <!-- Rendered Component Preview Box -->
          <div id="previewBox" class="preview-box" style="background-color: #0F172A; color: #3B82F6;">
            <div>
              <div class="preview-heading">Accessible Typography Preview</div>
              <div class="preview-body">
                Fast, automated accessibility auditing ensures your digital interfaces remain readable
                for every single human, regardless of device or visual acuity.
              </div>
            </div>
            <div class="preview-actions">
              <button type="button" class="preview-button" id="previewBtn">Interactive Button</button>
              <span style="font-size: 12px; font-weight: 600; text-transform: uppercase;">16px / Regular 400</span>
            </div>
          </div>

          <!-- Main Metrics Bar -->
          <div class="metrics-bar">
            <div class="ratio-display">
              <span class="ratio-num" id="ratioNum">4.85:1</span>
              <span class="grade-badge grade-pass" id="gradeBadge">AA PASS</span>
            </div>
            <div class="apca-pill">
              APCA Lc: <strong id="apcaLc">-68.2</strong>
              <div id="apcaRating" style="font-size: 11px; color: var(--text-dim);">Acceptable for large text</div>
            </div>
          </div>

          <!-- WCAG Checklist -->
          <div class="checklist-grid">
            <div class="check-card">
              <div class="check-title">AA Normal</div>
              <div class="check-req">&ge; 4.5:1</div>
              <span class="status-badge status-pass" id="badgeNormalAA">PASS</span>
            </div>
            <div class="check-card">
              <div class="check-title">AAA Normal</div>
              <div class="check-req">&ge; 7.0:1</div>
              <span class="status-badge status-fail" id="badgeNormalAAA">FAIL</span>
            </div>
            <div class="check-card">
              <div class="check-title">AA Large</div>
              <div class="check-req">&ge; 3.0:1</div>
              <span class="status-badge status-pass" id="badgeLargeAA">PASS</span>
            </div>
            <div class="check-card">
              <div class="check-title">UI Elements</div>
              <div class="check-req">&ge; 3.0:1</div>
              <span class="status-badge status-pass" id="badgeUiAA">PASS</span>
            </div>
          </div>

          <!-- Auto-Fixer Box -->
          <div id="autofixBox" class="autofix-box" style="display: none;">
            <div class="autofix-info">
              <div class="autofix-icon">✨</div>
              <div class="autofix-text">
                <h4 id="autofixTitle">Auto-Fix Recommendation Available</h4>
                <p id="autofixDesc">Suggested color strictly achieves target ratio while preserving hue and saturation.</p>
              </div>
            </div>
            <button type="button" class="btn-apply-fix" id="btnApplyFix" onclick="applyAutoFix()">
              Apply Auto-Fix
            </button>
          </div>

          <!-- Color Blindness Simulation -->
          <div class="cb-section">
            <div class="cb-heading">Vision Deficiency Simulation (Brettel/Viénot)</div>
            <div class="cb-grid" id="cbGrid">
              <!-- Rendered via JS -->
            </div>
          </div>

          <!-- Live API Response -->
          <div style="margin-top: 18px;">
            <div class="control-label">
              <span>Live API JSON Response</span>
              <button type="button" class="btn-preset" onclick="copyJson()">Copy JSON</button>
            </div>
            <pre class="json-preview" id="jsonPreview">{ "loading": true }</pre>
          </div>
        </div>
      </div>
    </section>

    <!-- Color Science Engine Features -->
    <section id="features" class="features">
      <div class="section-title">
        <h3>Pure Color Science Architecture</h3>
        <p>100% in-memory mathematical algorithms designed for sub-millisecond execution and zero-dependency reliability.</p>
      </div>

      <div class="features-grid">
        <div class="feat-card">
          <div class="feat-icon">📐</div>
          <h4>W3C Relative Luminance</h4>
          <p>
            Implements the exact W3C WCAG 2.1 sRGB-to-Linear RGB luminance transformation formula:
            Y = 0.2126R + 0.7152G + 0.0722B with 2.4 gamma curve correction.
          </p>
        </div>

        <div class="feat-card">
          <div class="feat-icon">👁️</div>
          <h4>APCA (WCAG 3.0 Candidate)</h4>
          <p>
            Advanced Perceptual Contrast Algorithm modeling human spatial frequency, font weight,
            and background polarity with Lc lightness scores.
          </p>
        </div>

        <div class="feat-card">
          <div class="feat-icon">⚡</div>
          <h4>HSL Lightness Auto-Fixer</h4>
          <p>
            Binary-search solver that preserves the designer's exact Hue and Saturation while
            finding the minimal Lightness delta needed to strictly guarantee compliance.
          </p>
        </div>

        <div class="feat-card">
          <div class="feat-icon">🧬</div>
          <h4>Brettel/Viénot Matrices</h4>
          <p>
            Physiologically accurate 3x3 dichromacy transformation matrices simulating Protanopia,
            Deuteranopia, Tritanopia, and Achromatopsia monochrome.
          </p>
        </div>

        <div class="feat-card">
          <div class="feat-icon">🎨</div>
          <h4>Tailwind 11-Step Palette</h4>
          <p>
            Generates cohesive design-system scales (50 to 950) with automated WCAG grading
            and recommended dark/light text color selection per step.
          </p>
        </div>

        <div class="feat-card">
          <div class="feat-icon">🚀</div>
          <h4>Sub-Millisecond Batching</h4>
          <p>
            Audit up to 50 color pairs concurrently in memory with full breakdown,
            contrast ratios, and auto-fix suggestions in less than 5ms total execution time.
          </p>
        </div>
      </div>
    </section>

    <!-- RapidAPI CTA Banner -->
    <section id="endpoints" class="cta-banner">
      <h3>Ready to Automate Accessibility in Your CI/CD & Apps?</h3>
      <p>
        Integrate ContrastGuard API seamlessly via RapidAPI. Get your API key in seconds with generous free tier
        and enterprise-grade high availability.
      </p>
      <a href="https://rapidapi.com/artuturoh/api/contrastguard-wcag-color-contrast-and-accessibility-fixer" target="_blank" rel="noopener" class="btn-rapidapi" style="font-size: 15px; padding: 12px 28px;">
        Get API Key on RapidAPI ⚡
      </a>
    </section>
  </main>

  <!-- Footer -->
  <footer>
    <div class="container">
      <p>ContrastGuard API — WCAG 2.1 & APCA Color Contrast Analyzer, Auto-Fixer & Accessible Palette Generator.</p>
      <p style="margin-top: 6px; font-size: 12px;">Engineered for high performance, accuracy, and accessibility.</p>
    </div>
  </footer>

  <!-- Interactive Studio Script -->
  <script>
    let currentTargetLevel = 'AA';
    let suggestedHex = null;
    let latestApiResponse = null;

    const fgColorPicker = document.getElementById('fgColorPicker');
    const fgHexInput = document.getElementById('fgHexInput');
    const bgColorPicker = document.getElementById('bgColorPicker');
    const bgHexInput = document.getElementById('bgHexInput');
    const previewBox = document.getElementById('previewBox');
    const ratioNum = document.getElementById('ratioNum');
    const gradeBadge = document.getElementById('gradeBadge');
    const apcaLc = document.getElementById('apcaLc');
    const apcaRating = document.getElementById('apcaRating');
    const badgeNormalAA = document.getElementById('badgeNormalAA');
    const badgeNormalAAA = document.getElementById('badgeNormalAAA');
    const badgeLargeAA = document.getElementById('badgeLargeAA');
    const badgeUiAA = document.getElementById('badgeUiAA');
    const autofixBox = document.getElementById('autofixBox');
    const btnApplyFix = document.getElementById('btnApplyFix');
    const cbGrid = document.getElementById('cbGrid');
    const jsonPreview = document.getElementById('jsonPreview');
    const latencyBadge = document.getElementById('latencyBadge');
    const fgHslLabel = document.getElementById('fgHslLabel');
    const bgHslLabel = document.getElementById('bgHslLabel');

    function setColors(fg, bg) {
      fgColorPicker.value = fg;
      fgHexInput.value = fg;
      bgColorPicker.value = bg;
      bgHexInput.value = bg;
      triggerAudit();
    }

    function setTargetLevel(lvl) {
      currentTargetLevel = lvl;
      document.getElementById('btnLevelAA').classList.toggle('active', lvl === 'AA');
      document.getElementById('btnLevelAAA').classList.toggle('active', lvl === 'AAA');
      triggerAudit();
    }

    // Sync input events
    fgColorPicker.addEventListener('input', (e) => {
      fgHexInput.value = e.target.value.toUpperCase();
      triggerAudit();
    });
    fgHexInput.addEventListener('change', (e) => {
      let val = e.target.value.trim();
      if (!val.startsWith('#') && (val.length === 3 || val.length === 6)) val = '#' + val;
      if (/^#[0-9A-Fa-f]{3,8}$/.test(val)) {
        fgColorPicker.value = val.substring(0, 7);
      }
      triggerAudit();
    });

    bgColorPicker.addEventListener('input', (e) => {
      bgHexInput.value = e.target.value.toUpperCase();
      triggerAudit();
    });
    bgHexInput.addEventListener('change', (e) => {
      let val = e.target.value.trim();
      if (!val.startsWith('#') && (val.length === 3 || val.length === 6)) val = '#' + val;
      if (/^#[0-9A-Fa-f]{3,8}$/.test(val)) {
        bgColorPicker.value = val.substring(0, 7);
      }
      triggerAudit();
    });

    function applyAutoFix() {
      if (suggestedHex) {
        fgColorPicker.value = suggestedHex;
        fgHexInput.value = suggestedHex;
        triggerAudit();
      }
    }

    function copyJson() {
      if (latestApiResponse) {
        navigator.clipboard.writeText(JSON.stringify(latestApiResponse, null, 2)).then(() => {
          alert('JSON response copied to clipboard!');
        });
      }
    }

    let debounceTimer = null;
    function triggerAudit() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(runAudit, 50);
    }

    async function runAudit() {
      const fg = fgHexInput.value.trim();
      const bg = bgHexInput.value.trim();

      // Immediate visual update for preview box
      previewBox.style.backgroundColor = bg;
      previewBox.style.color = fg;
      document.getElementById('previewBtn').style.borderColor = fg;

      const t0 = performance.now();
      try {
        const response = await fetch('/v1/demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            foreground: fg,
            background: bg,
            targetLevel: currentTargetLevel,
            fontSizePx: 16,
            fontWeight: 400
          })
        });

        const data = await response.json();
        const t1 = performance.now();
        const roundTripMs = (t1 - t0).toFixed(2);
        latencyBadge.textContent = '⚡ api: ' + (data.meta?.execution_time_ms ?? roundTripMs) + 'ms (net ' + roundTripMs + 'ms)';

        if (!response.ok) {
          jsonPreview.textContent = JSON.stringify(data, null, 2);
          return;
        }

        latestApiResponse = data;
        jsonPreview.textContent = JSON.stringify(data, null, 2);

        // Update HSL labels
        if (data.foreground?.hsl) fgHslLabel.textContent = data.foreground.hsl;
        if (data.background?.hsl) bgHslLabel.textContent = data.background.hsl;

        // Contrast ratio and grade
        ratioNum.textContent = data.formattedRatio || (data.contrastRatio + ':1');
        gradeBadge.textContent = data.wcag21.grade;
        const passesTarget = currentTargetLevel === 'AAA' ? data.wcag21.normalTextAAA : data.wcag21.normalTextAA;
        gradeBadge.className = 'grade-badge ' + (passesTarget ? 'grade-pass' : 'grade-fail');

        // APCA
        apcaLc.textContent = data.apca.lc > 0 ? '+' + data.apca.lc : data.apca.lc;
        apcaRating.textContent = data.apca.rating;

        // WCAG Checklist
        const setBadge = (el, pass) => {
          el.textContent = pass ? 'PASS' : 'FAIL';
          el.className = 'status-badge ' + (pass ? 'status-pass' : 'status-fail');
        };
        setBadge(badgeNormalAA, data.wcag21.normalTextAA);
        setBadge(badgeNormalAAA, data.wcag21.normalTextAAA);
        setBadge(badgeLargeAA, data.wcag21.largeTextAA);
        setBadge(badgeUiAA, data.wcag21.uiComponentsAA);

        // Auto Fixer
        if (data.autoFix && data.autoFix.needed) {
          suggestedHex = data.autoFix.suggestedForegroundHex;
          autofixBox.style.display = 'flex';
          document.getElementById('autofixTitle').textContent =
            'Fix available: ' + suggestedHex + ' (' + data.autoFix.fixedContrastRatio + ':1)';
          document.getElementById('autofixDesc').textContent =
            'Lightness shifted by ' + data.autoFix.deltaLightness + '% while locking hue & saturation.';
        } else {
          autofixBox.style.display = 'none';
          suggestedHex = null;
        }

        // Color Blindness Simulation
        renderColorBlindness(data.colorBlindnessSimulation);

      } catch (err) {
        console.error('Audit request failed:', err);
      }
    }

    function renderColorBlindness(sims) {
      if (!sims) return;
      const conditions = [
        { key: 'protanopia', label: 'Protanopia', sub: 'Red-Blind (1% males)' },
        { key: 'deuteranopia', label: 'Deuteranopia', sub: 'Green-Blind (5% males)' },
        { key: 'tritanopia', label: 'Tritanopia', sub: 'Blue-Blind (rare)' },
        { key: 'achromatopsia', label: 'Achromatopsia', sub: 'Monochrome Grayscale' }
      ];

      cbGrid.innerHTML = conditions.map(c => {
        const sim = sims[c.key];
        if (!sim) return '';
        return '<div class="cb-card" style="background-color: ' + sim.backgroundHex + '; color: ' + sim.foregroundHex + ';">' +
          '<div class="cb-card-title">' + c.label + '</div>' +
          '<div class="cb-card-sub">' + c.sub + '</div>' +
          '<div class="cb-card-ratio">' + sim.contrastRatio + ':1</div>' +
        '</div>';
      }).join('');
    }

    // Initial audit on load
    window.addEventListener('DOMContentLoaded', () => {
      triggerAudit();
    });
  </script>
</body>
</html>`;
}

export { renderLandingHtml as renderStudioHtml };


