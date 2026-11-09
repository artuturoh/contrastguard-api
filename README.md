# ContrastGuard API 🛡️

> **WCAG 2.1 & APCA Color Contrast Analyzer, Auto-Fixer & Accessible Palette Generator**  
> *Production-grade, ultra-fast (<2ms), 100% in-memory color accessibility microservice.*

[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![WCAG 2.1](https://img.shields.io/badge/WCAG-2.1%20AA%2FAAA-blue.svg)](https://www.w3.org/TR/WCAG21/)
[![APCA](https://img.shields.io/badge/APCA-WCAG%203.0%20Draft-cyan.svg)](https://www.w3.org/WAI/GL/task-forces/silver/wiki/Visual_Contrast_of_Text_Subgroup)
[![Tests](https://img.shields.io/badge/Tests-41%20Passing-success.svg)](test/)

---

## ⚡ Highlights

- **Pure Mathematical Precision**: 100% in-memory algorithms implementing exact W3C WCAG 2.1 sRGB to Linear RGB relative luminance ($Y = 0.2126R + 0.7152G + 0.0722B$).
- **WCAG 3.0 APCA Perceptual Contrast**: Perceptual Lightness Contrast ($L_c$) calculation modeling spatial frequency, background polarity, and human vision non-linearities.
- **HSL Lightness Auto-Fixer**: Automatically rescues failing contrast pairs by locking original Hue & Saturation and binary-searching minimal Lightness deltas.
- **Brettel/Viénot Color Blindness Simulation**: 3x3 transformation matrices simulating Protanopia, Deuteranopia, Tritanopia, and Achromatopsia with live simulated contrast ratios.
- **Tailwind Design System Scales**: 11-step shade generator (`50` to `950`) with automatic contrast grading and optimal dark/light text color selection.
- **High-Throughput Batch Auditing**: Concurrently evaluates up to 50 pairs per request in &lt;5ms.
- **Dark-Mode Studio UI**: Built-in interactive accessibility studio served at `GET /` with live visual preview, color pickers, and auto-fix applicator.
- **RapidAPI Ready**: Built-in `X-RapidAPI-Proxy-Secret` authentication with dedicated `/v1/demo` rate-limited bypass for live public playgrounds.

---

## 🛠️ Architecture & Tech Stack

```
contrastguard-api/
├── package.json
├── README.md
├── docs/
│   └── RAPIDAPI_STUDIO_DOCS.md       # Copy-paste ready RapidAPI Studio documentation
├── src/
│   ├── app.js                         # Express configuration, Helmet CSP, CORS
│   ├── server.js                      # Server entry point (0.0.0.0:PORT)
│   ├── middleware/
│   │   ├── rapidapiAuth.js            # Smart RapidAPI proxy secret validator
│   │   ├── rateLimiter.js             # Rate limiters (20 req/min for demo)
│   │   └── errorHandler.js            # 404 & centralized error handlers
│   ├── controllers/
│   │   ├── auditController.js         # POST /v1/audit & POST /v1/demo
│   │   ├── paletteController.js       # POST /v1/palette
│   │   ├── batchController.js         # POST /v1/batch
│   │   └── homeController.js          # GET / (HTML studio + JSON) & GET /health
│   ├── routes/
│   │   └── v1.js                      # /v1 API routes
│   ├── services/
│   │   └── studioHtml.js              # Dark-mode SaaS Landing Page + Interactive Studio
│   └── utils/
│       ├── colorScience.js            # WCAG 2.1, APCA, Auto-Fix, Brettel/Viénot
│       └── colorParser.js             # Hex (3/4/6/8), RGB, HSL parser
└── test/
    └── api.test.js                    # 41 integration tests with node:test & supertest
```

---

## 🚀 Quickstart

### 1. Requirements
- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

### 2. Installation
```bash
git clone https://github.com/artuturoh/contrastguard-api.git
cd contrastguard-api
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Run Production Server
```bash
npm start
```
The server binds to `0.0.0.0:3000` (or `process.env.PORT`).

### 5. Run Automated Test Suite
```bash
npm test
```
Executes all 41 integration tests using Node's native test runner (`node --test`) and `supertest`.

---

## 🔐 Environment Configuration

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Number | `3000` | Port to bind the HTTP server to |
| `RAPIDAPI_PROXY_SECRET` | String | *Optional* | If set, requires `X-RapidAPI-Proxy-Secret` matching this value on `/v1/*` routes (except `/v1/demo`, `/health`, and `/`) |

---

## 📡 Endpoints Overview

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | Real-time service uptime, version, and health status |
| `GET` | `/` | Public | Dark-mode SaaS Landing Page & Live Studio (HTML) or Service Info (JSON) |
| `POST` | `/v1/audit` | RapidAPI Secret* | Audits contrast ratio, WCAG 2.1, APCA, Auto-Fix, and Color Blindness |
| `POST` | `/v1/demo` | Rate Limited (20/min) | Public playground endpoint for live website visitors |
| `POST` | `/v1/palette` | RapidAPI Secret* | Generates 11-step design system palette (`50` to `950`) |
| `POST` | `/v1/batch` | RapidAPI Secret* | Concurrently audits 1 to 50 color pairs in memory |

*\* RapidAPI Secret required only if `process.env.RAPIDAPI_PROXY_SECRET` is configured.*

---

## 💻 API Examples

### Audit Color Contrast (`POST /v1/audit`)
```bash
curl -X POST http://localhost:3000/v1/audit \
  -H "Content-Type: application/json" \
  -d '{
    "foreground": "#3B82F6",
    "background": "#0F172A",
    "targetLevel": "AA",
    "fontSizePx": 16,
    "fontWeight": 400
  }'
```

### Generate 11-Step Design System Palette (`POST /v1/palette`)
```bash
curl -X POST http://localhost:3000/v1/palette \
  -H "Content-Type: application/json" \
  -d '{
    "baseColor": "#3B82F6",
    "background": "#FFFFFF"
  }'
```

### Batch Audit 50 Color Pairs (`POST /v1/batch`)
```bash
curl -X POST http://localhost:3000/v1/batch \
  -H "Content-Type: application/json" \
  -d '{
    "pairs": [
      { "id": "btn_pri", "foreground": "#FFF", "background": "#2563EB" },
      { "id": "btn_sec", "foreground": "#0F172A", "background": "#F1F5F9" }
    ]
  }'
```

---

## 🔬 Mathematical Formulas

### 1. W3C WCAG 2.1 Relative Luminance
For each channel $C \in \{R, G, B\}$ normalized to $s = C/255$:
$$s_{linear} = \begin{cases} \frac{s}{12.92} & s \le 0.04045 \\ \left(\frac{s + 0.055}{1.055}\right)^{2.4} & s > 0.04045 \end{cases}$$
$$Y = 0.2126 \cdot R_{linear} + 0.7152 \cdot G_{linear} + 0.0722 \cdot B_{linear}$$
$$CR = \frac{L_1 + 0.05}{L_2 + 0.05} \quad (L_1 \ge L_2)$$

### 2. Brettel & Viénot 1997 Dichromacy Transformation
Simulated in linear RGB space using standard physiologic matrices:
- **Protanopia (L-cone absence)**:
  $$\begin{bmatrix} R' \\ G' \\ B' \end{bmatrix} = \begin{bmatrix} 0.56667 & 0.43333 & 0.00000 \\ 0.55833 & 0.44167 & 0.00000 \\ 0.00000 & 0.24167 & 0.75833 \end{bmatrix} \begin{bmatrix} R \\ G \\ B \end{bmatrix}$$
- **Deuteranopia (M-cone absence)**:
  $$\begin{bmatrix} R' \\ G' \\ B' \end{bmatrix} = \begin{bmatrix} 0.62500 & 0.37500 & 0.00000 \\ 0.70000 & 0.30000 & 0.00000 \\ 0.00000 & 0.30000 & 0.70000 \end{bmatrix} \begin{bmatrix} R \\ G \\ B \end{bmatrix}$$
- **Tritanopia (S-cone absence)**:
  $$\begin{bmatrix} R' \\ G' \\ B' \end{bmatrix} = \begin{bmatrix} 0.95000 & 0.05000 & 0.00000 \\ 0.00000 & 0.43333 & 0.56667 \\ 0.00000 & 0.47500 & 0.52500 \end{bmatrix} \begin{bmatrix} R \\ G \\ B \end{bmatrix}$$

---

## 📄 License

MIT License. Designed and maintained for production accessibility engineering.
