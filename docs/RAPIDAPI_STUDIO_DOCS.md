# ContrastGuard API — WCAG 2.1 & APCA Color Contrast Analyzer, Auto-Fixer & Accessible Palette Generator

**ContrastGuard API** is an ultra-fast (&lt;2ms), 100% in-memory color accessibility microservice engineered for design systems, automated CI/CD accessibility pipelines, CMS platforms, and dynamic UI frontends.

---

## ⚡ Key Capabilities

- **W3C WCAG 2.1 Compliance**: Exact relative luminance calculation ($Y = 0.2126R + 0.7152G + 0.0722B$ with 2.4 gamma conversion) supporting Normal Text AA (4.5:1), Normal Text AAA (7.0:1), Large Text AA (3.0:1), Large Text AAA (4.5:1), and UI Components AA (3.0:1).
- **APCA Perceptual Contrast (WCAG 3.0 Draft)**: Advanced Perceptual Contrast Algorithm lightness contrast score ($L_c$) modeling spatial frequency, polarity, and font weight readability ratings.
- **Instant Lightness Auto-Fixer**: Mathematically preserves the designer's original Hue and Saturation while binary-searching the minimal Lightness delta needed to strictly guarantee compliance.
- **Brettel/Viénot Color Blindness Simulation**: 3x3 physiologically accurate transformation matrices simulating Protanopia (red-blind), Deuteranopia (green-blind), Tritanopia (blue-blind), and Achromatopsia (monochrome grayscale) with corresponding contrast ratios.
- **Design System Palette Generator**: Generates complete 11-step Tailwind/CSS scales (`50` to `950`) with contrast grading against any background and automatic dark/light text color recommendation.
- **In-Memory Batch Engine**: Concurrently audits up to 50 color combinations in a single HTTP request in under 5 milliseconds.

---

## 🔐 Authentication & Headers

ContrastGuard API is hosted on RapidAPI. Include the following headers with all requests:

| Header Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `X-RapidAPI-Key` | String | **Yes** | Your RapidAPI application API key |
| `X-RapidAPI-Host` | String | **Yes** | `contrastguard-wcag-color-contrast-and-accessibility-fixer.p.rapidapi.com` |
| `Content-Type` | String | **Yes** | `application/json` (for POST endpoints) |

---

## 📡 Endpoints Reference

### 1. Color Contrast Audit & Auto-Fix (`POST /v1/audit`)

Audits the contrast ratio between foreground and background colors according to WCAG 2.1 and APCA. If the pair fails the requested target level, automatically generates the closest compliant color.

#### Request Body Schema

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `foreground` | String | **Yes** | — | Hex (`#3B82F6`, `#FFF`), RGB (`rgb(59, 130, 246)`), or HSL (`hsl(217, 91%, 60%)`) |
| `background` | String | **Yes** | — | Hex (`#0F172A`, `#000`), RGB (`rgb(15, 23, 42)`), or HSL (`hsl(222, 47%, 11%)`) |
| `targetLevel` | String | No | `"AA"` | Compliance target level: `"AA"` (4.5:1) or `"AAA"` (7.0:1) |
| `fontSizePx` | Number | No | `16` | Font size in pixels for contextual typography evaluation |
| `fontWeight` | Number/String | No | `400` | Font weight (e.g., `400`, `700`, or `"bold"`) |

#### Example Request

```json
{
  "foreground": "#94A3B8",
  "background": "#FFFFFF",
  "targetLevel": "AA",
  "fontSizePx": 16,
  "fontWeight": 400
}
```

#### Example Response (`200 OK`)

```json
{
  "foreground": {
    "input": "#94A3B8",
    "hex": "#94A3B8",
    "rgb": "rgb(148, 163, 184)",
    "hsl": "hsl(215, 20.2%, 65.1%)"
  },
  "background": {
    "input": "#FFFFFF",
    "hex": "#FFFFFF",
    "rgb": "rgb(255, 255, 255)",
    "hsl": "hsl(0, 0%, 100%)"
  },
  "contrastRatio": 2.43,
  "formattedRatio": "2.43:1",
  "wcag21": {
    "normalTextAA": false,
    "normalTextAAA": false,
    "largeTextAA": false,
    "largeTextAAA": false,
    "uiComponentsAA": false,
    "contextPass": false,
    "grade": "FAIL",
    "context": {
      "fontSizePx": 16,
      "fontWeight": 400,
      "isLargeText": false,
      "targetLevel": "AA",
      "requiredRatio": 4.5
    }
  },
  "apca": {
    "lc": 41.2,
    "rating": "Large headlines (36px+) or non-text UI controls"
  },
  "autoFix": {
    "needed": true,
    "targetRatio": 4.5,
    "suggestedForegroundHex": "#647896",
    "suggestedBackgroundHex": "#393939",
    "fixedContrastRatio": 4.5,
    "deltaLightness": -16.2
  },
  "colorBlindnessSimulation": {
    "protanopia": {
      "foregroundHex": "#9EA0B7",
      "backgroundHex": "#FFFFFF",
      "contrastRatio": 2.37
    },
    "deuteranopia": {
      "foregroundHex": "#9BA0B8",
      "backgroundHex": "#FFFFFF",
      "contrastRatio": 2.39
    },
    "tritanopia": {
      "foregroundHex": "#96A4A5",
      "backgroundHex": "#FFFFFF",
      "contrastRatio": 2.45
    },
    "achromatopsia": {
      "foregroundHex": "#9F9F9F",
      "backgroundHex": "#FFFFFF",
      "contrastRatio": 2.42
    }
  },
  "meta": {
    "execution_time_ms": 0.32,
    "timestamp": "2026-11-08T20:45:00.000Z"
  }
}
```

---

### 2. Accessible Palette Generator (`POST /v1/palette`)

Generates a cohesive 11-step design system scale (`50` to `950`) based on a seed color, evaluating contrast ratios against the specified background and determining optimal text colors (`#FFFFFF` vs `#0F172A`).

#### Request Body Schema

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `baseColor` | String | **Yes** | — | Seed brand color in hex, rgb, or hsl |
| `background` | String | No | `"#FFFFFF"` | Base canvas color to evaluate contrast against |

#### Example Request

```json
{
  "baseColor": "#3B82F6",
  "background": "#FFFFFF"
}
```

#### Example Response (`200 OK`)

```json
{
  "baseColor": "#3B82F6",
  "background": "#FFFFFF",
  "scale": [
    {
      "step": 50,
      "hex": "#EFF6FF",
      "rgb": "rgb(239, 246, 255)",
      "hsl": "hsl(213.8, 100%, 96.9%)",
      "contrastAgainstBackground": 1.07,
      "contrastRatio": "1.07:1",
      "wcagGrade": "FAIL",
      "recommendedTextColor": "#0F172A"
    },
    {
      "step": 500,
      "hex": "#3B82F6",
      "rgb": "rgb(59, 130, 246)",
      "hsl": "hsl(217.2, 91.2%, 59.8%)",
      "contrastAgainstBackground": 3.73,
      "contrastRatio": "3.73:1",
      "wcagGrade": "AA Large Only",
      "recommendedTextColor": "#FFFFFF"
    },
    {
      "step": 950,
      "hex": "#091426",
      "rgb": "rgb(9, 20, 38)",
      "hsl": "hsl(217.2, 61.7%, 9.2%)",
      "contrastAgainstBackground": 18.25,
      "contrastRatio": "18.25:1",
      "wcagGrade": "AAA",
      "recommendedTextColor": "#FFFFFF"
    }
  ],
  "meta": {
    "stepsCount": 11,
    "execution_time_ms": 0.45,
    "timestamp": "2026-11-08T20:45:00.000Z"
  }
}
```

---

### 3. High-Throughput Batch Auditor (`POST /v1/batch`)

Concurrently audits up to 50 pairs in memory in &lt;5ms. Ideal for design token validation, theme checkers, and automated testing suites.

#### Request Body Schema

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `pairs` | Array | **Yes** | — | Array of 1 to 50 objects containing `id`, `foreground`, `background`, and optional `targetLevel` |

#### Example Request

```json
{
  "pairs": [
    { "id": "button_primary", "foreground": "#FFFFFF", "background": "#2563EB", "targetLevel": "AA" },
    { "id": "badge_success", "foreground": "#065F46", "background": "#D1FAE5", "targetLevel": "AA" },
    { "id": "alert_warning", "foreground": "#92400E", "background": "#FEF3C7", "targetLevel": "AAA" }
  ]
}
```

#### Example Response (`200 OK`)

```json
{
  "count": 3,
  "results": [
    {
      "id": "button_primary",
      "status": "success",
      "foreground": "#FFFFFF",
      "background": "#2563EB",
      "contrastRatio": 4.54,
      "formattedRatio": "4.54:1",
      "wcagGrade": "AA",
      "contextPass": true,
      "normalTextAA": true,
      "normalTextAAA": false,
      "apcaLc": -71.4,
      "autoFix": {
        "needed": false,
        "suggestedForegroundHex": "#FFFFFF",
        "fixedContrastRatio": 4.54
      }
    }
  ],
  "meta": {
    "execution_time_ms": 1.25,
    "timestamp": "2026-11-08T20:45:00.000Z"
  }
}
```

---

### 4. Health & Uptime Check (`GET /health`)

Lightweight monitor endpoint returning real-time service health, uptime, and microservice version.

#### Example Response (`200 OK`)

```json
{
  "status": "ok",
  "service": "contrastguard-api",
  "version": "1.0.0",
  "uptime": 1420.58,
  "timestamp": "2026-11-08T20:45:00.000Z"
}
```

---

## 💻 Code Snippets

### cURL

```bash
curl -X POST "https://contrastguard-wcag-color-contrast-and-accessibility-fixer.p.rapidapi.com/v1/audit" \
  -H "Content-Type: application/json" \
  -H "X-RapidAPI-Key: YOUR_RAPIDAPI_KEY" \
  -H "X-RapidAPI-Host: contrastguard-wcag-color-contrast-and-accessibility-fixer.p.rapidapi.com" \
  -d '{
    "foreground": "#3B82F6",
    "background": "#0F172A",
    "targetLevel": "AA"
  }'
```

### Node.js (Fetch)

```javascript
const response = await fetch(
  'https://contrastguard-wcag-color-contrast-and-accessibility-fixer.p.rapidapi.com/v1/audit',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'contrastguard-wcag-color-contrast-and-accessibility-fixer.p.rapidapi.com'
    },
    body: JSON.stringify({
      foreground: '#3B82F6',
      background: '#0F172A',
      targetLevel: 'AA'
    })
  }
);

const auditResult = await response.json();
console.log('Contrast Ratio:', auditResult.contrastRatio);
console.log('WCAG Grade:', auditResult.wcag21.grade);
```

### Python (Requests)

```python
import os
import requests

url = "https://contrastguard-wcag-color-contrast-and-accessibility-fixer.p.rapidapi.com/v1/audit"

payload = {
    "foreground": "#3B82F6",
    "background": "#0F172A",
    "targetLevel": "AA"
}

headers = {
    "Content-Type": "application/json",
    "X-RapidAPI-Key": os.getenv("RAPIDAPI_KEY"),
    "X-RapidAPI-Host": "contrastguard-wcag-color-contrast-and-accessibility-fixer.p.rapidapi.com"
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()

print(f"Contrast Ratio: {data['contrastRatio']}:1")
print(f"AA Normal Text: {data['wcag21']['normalTextAA']}")
if data['autoFix']['needed']:
    print(f"Suggested Accessible Hex: {data['autoFix']['suggestedForegroundHex']}")
```

---

## ❓ Frequently Asked Questions (FAQ) & AI Discovery

#### Q: How is WCAG 2.1 relative luminance calculated?
Luminance is calculated using the official W3C formula: each sRGB component $C \in [0, 255]$ is normalized to $s = C/255$, converted to linear RGB via $s_{lin} = (s \le 0.04045) ? (s / 12.92) : ((s + 0.055) / 1.055)^{2.4}$, and aggregated as $Y = 0.2126R_{lin} + 0.7152G_{lin} + 0.0722B_{lin}$. Contrast ratio is $(Y_1 + 0.05) / (Y_2 + 0.05)$.

#### Q: What is APCA and why is it included alongside WCAG 2.1?
APCA (Advanced Perceptual Contrast Algorithm) is the candidate contrast method for WCAG 3.0. Unlike WCAG 2.1's symmetric ratio, APCA accounts for human perceptual non-linearities, background polarity (dark text on light vs light text on dark), and spatial frequency. ContrastGuard API provides both so teams can comply with current legal requirements (WCAG 2.1) while future-proofing for WCAG 3.0.

#### Q: How does the Auto-Fixer choose the suggested color?
The Auto-Fixer preserves the exact Hue and Saturation of the original color and performs a precision binary search along the HSL Lightness axis. It evaluates both lightening and darkening trajectories to find the minimal delta lightness that guarantees the target ratio (4.5:1 for AA or 7.0:1 for AAA).

#### Q: Can this API be integrated into CI/CD pipelines?
Yes! Use `POST /v1/batch` in pre-commit hooks or GitHub Actions to lint your design tokens, CSS variables, or theme JSON files before deploying to production.
