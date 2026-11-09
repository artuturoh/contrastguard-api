# ContrastGuard API — Official RapidAPI Hub Documentation

> **WCAG 2.1 & APCA Color Contrast Analyzer, Auto-Fixer & Accessible Palette Generator**  
> *Ultra-fast (<1ms), 100% in-memory accessibility microservice with zero databases or external dependencies.*

---

## 1. Executive Overview

**ContrastGuard API** is an enterprise-grade, sub-millisecond, pure in-memory color accessibility engine. Designed specifically for engineering teams needing deterministic compliance with the **European Accessibility Act (EAA)**, **Section 508**, and **Americans with Disabilities Act (ADA Title III)**, ContrastGuard removes guesswork from digital accessibility.

Unlike legacy contrast libraries that merely output pass/fail flags, ContrastGuard API delivers complete color intelligence:
- **Dual Compliance Engine**: Dual-audits colors using both current legal standards (**W3C WCAG 2.1 relative luminance**) and next-generation perceptual science (**WCAG 3.0 draft APCA Lc**).
- **Instant HSL Lightness Auto-Fixer**: Mathematically rescues inaccessible color pairings by locking original designer Hue and Saturation while binary-searching minimal Lightness deltas.
- **Physiologic Color Blindness Simulation**: Employs exact Brettel/Viénot linear RGB transformation matrices to simulate Protanopia, Deuteranopia, Tritanopia, and Achromatopsia, computing real-time contrast ratios for each condition.
- **Automated Design-System Palette Engine**: Turns any seed color into an 11-step Tailwind/CSS scale (`50` through `950`) with pre-computed WCAG grades and optimal foreground text selection.
- **High-Throughput Batch Auditing**: Audits up to 50 color combinations concurrently in memory in under 5ms, purpose-built for CI/CD pre-commit hooks, Figma plugins, and generative AI UI tools.

RapidAPI Hub listing: [ContrastGuard API on RapidAPI](https://rapidapi.com/artuturoh/api/contrastguard-wcag-color-contrast-and-accessibility-fixer)

---

## 2. Authentication & RapidAPI Headers

All requests to `/v1/*` endpoints routed through RapidAPI require your RapidAPI Application Key:

| Header Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `X-RapidAPI-Key` | String | **Yes** | Your RapidAPI application API key |
| `X-RapidAPI-Host` | String | **Yes** | `contrastguard-wcag-color-contrast-and-accessibility-fixer.p.rapidapi.com` |
| `Content-Type` | String | **Yes** | `application/json` (for POST endpoints) |

---

## 3. Core Capabilities Summary

| Endpoint | Method | Typical Latency | Key Use Cases |
| :--- | :--- | :--- | :--- |
| `/v1/audit` | `POST` | `< 0.5 ms` | Auditing color contrast, contextual typography evaluation, APCA perceptual score, HSL auto-fixing, and color blindness simulations. |
| `/v1/palette` | `POST` | `< 0.8 ms` | Generating accessible 11-step Tailwind/CSS shade scales (`50` to `950`) from a single brand color with automated text recommendations. |
| `/v1/batch` | `POST` | `< 2.5 ms` | Concurrently linting design token files, theme dictionaries, or complete component libraries (up to 50 pairs in a single request). |
| `/health` | `GET` | `< 0.1 ms` | Health monitoring, Kubernetes liveness probes, and uptime status checks. |

---

## 4. Endpoint 1: `POST /v1/audit` — Audit & Auto-Fix Color Pair

Analyzes two colors for WCAG 2.1 and APCA compliance. If the colors fail the required ratio, the in-memory engine calculates the closest accessible color pair without altering the base color's hue or saturation.

### Input Parameters

| Field | Type | Required | Default | Description | Supported Formats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `foreground` | String | **Yes** | — | Foreground / text color | 3-digit hex (`#FFF`), 6-digit hex (`#3B82F6`), `rgb(59, 130, 246)`, `hsl(217, 91%, 60%)` |
| `background` | String | **Yes** | — | Background / surface color | 3-digit hex (`#000`), 6-digit hex (`#0F172A`), `rgb(15, 23, 42)`, `hsl(222, 47%, 11%)` |
| `targetLevel` | String | No | `"AA"` | Target compliance standard | `"AA"` (4.5:1 normal, 3.0:1 large) or `"AAA"` (7.0:1 normal, 4.5:1 large) |
| `fontSizePx` | Number | No | `16` | Font size in pixels | Float or Integer (e.g., `14`, `16`, `24`) |
| `fontWeight` | Number/String | No | `400` | Font weight | Integer (e.g., `400`, `700`) or string (`"normal"`, `"bold"`) |

### Example Request (`POST /v1/audit`)

```json
{
  "foreground": "#94A3B8",
  "background": "#FFFFFF",
  "targetLevel": "AA",
  "fontSizePx": 16,
  "fontWeight": 400
}
```

### Example Response (`200 OK`)

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
    "execution_time_ms": 0.28,
    "timestamp": "2026-11-08T21:00:00.000Z"
  }
}
```

---

## 5. Endpoint 2: `POST /v1/palette` — 11-Step Accessible Shade Scale

Generates a complete 11-step design system scale (`50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`, `950`) based on a seed color. Each step is evaluated for contrast against your chosen canvas background and tagged with the optimal contrast text color (`#FFFFFF` or `#0F172A`).

### Input Parameters

| Field | Type | Required | Default | Description | Supported Formats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `baseColor` | String | **Yes** | — | Brand seed color | Hex, RGB, or HSL |
| `background` | String | No | `"#FFFFFF"` | Base surface to evaluate contrast against | Hex, RGB, or HSL |

### Example Request (`POST /v1/palette`)

```json
{
  "baseColor": "#3B82F6",
  "background": "#FFFFFF"
}
```

### Example Response (`200 OK`)

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
      "step": 100,
      "hex": "#DBEAFE",
      "rgb": "rgb(219, 234, 254)",
      "hsl": "hsl(214.3, 94.6%, 92.7%)",
      "contrastAgainstBackground": 1.22,
      "contrastRatio": "1.22:1",
      "wcagGrade": "FAIL",
      "recommendedTextColor": "#0F172A"
    },
    {
      "step": 200,
      "hex": "#BFDBFE",
      "rgb": "rgb(191, 219, 254)",
      "hsl": "hsl(213.3, 96.9%, 87.3%)",
      "contrastAgainstBackground": 1.48,
      "contrastRatio": "1.48:1",
      "wcagGrade": "FAIL",
      "recommendedTextColor": "#0F172A"
    },
    {
      "step": 300,
      "hex": "#93C5FD",
      "rgb": "rgb(147, 197, 253)",
      "hsl": "hsl(211.7, 96.4%, 78.4%)",
      "contrastAgainstBackground": 2.01,
      "contrastRatio": "2.01:1",
      "wcagGrade": "FAIL",
      "recommendedTextColor": "#0F172A"
    },
    {
      "step": 400,
      "hex": "#60A5FA",
      "rgb": "rgb(96, 165, 250)",
      "hsl": "hsl(213.2, 93.9%, 67.8%)",
      "contrastAgainstBackground": 2.81,
      "contrastRatio": "2.81:1",
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
      "step": 600,
      "hex": "#2563EB",
      "rgb": "rgb(37, 99, 235)",
      "hsl": "hsl(221.2, 83.2%, 53.3%)",
      "contrastAgainstBackground": 5.12,
      "contrastRatio": "5.12:1",
      "wcagGrade": "AA",
      "recommendedTextColor": "#FFFFFF"
    },
    {
      "step": 700,
      "hex": "#1D4ED8",
      "rgb": "rgb(29, 78, 216)",
      "hsl": "hsl(224.3, 76.3%, 48.0%)",
      "contrastAgainstBackground": 6.84,
      "contrastRatio": "6.84:1",
      "wcagGrade": "AA",
      "recommendedTextColor": "#FFFFFF"
    },
    {
      "step": 800,
      "hex": "#1E40AF",
      "rgb": "rgb(30, 64, 175)",
      "hsl": "hsl(225.9, 70.7%, 40.2%)",
      "contrastAgainstBackground": 8.91,
      "contrastRatio": "8.91:1",
      "wcagGrade": "AAA",
      "recommendedTextColor": "#FFFFFF"
    },
    {
      "step": 900,
      "hex": "#1E3A8A",
      "rgb": "rgb(30, 58, 138)",
      "hsl": "hsl(224.4, 64.3%, 32.9%)",
      "contrastAgainstBackground": 12.15,
      "contrastRatio": "12.15:1",
      "wcagGrade": "AAA",
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
    "timestamp": "2026-11-08T21:00:00.000Z"
  }
}
```

---

## 6. Endpoint 3: `POST /v1/batch` — Bulk Theme & Token Auditing

Validates an entire color system or UI token dictionary concurrently in a single HTTP call. Supports up to 50 color pairs per request with execution latency typically under 3ms.

### Input Parameters

| Field | Type | Required | Bounds | Description |
| :--- | :--- | :--- | :--- | :--- |
| `pairs` | Array | **Yes** | 1 to 50 items | Array of color pair objects containing `id`, `foreground`, `background`, and optional `targetLevel`, `fontSizePx`, `fontWeight`. |

### Example Request (`POST /v1/batch`)

```json
{
  "pairs": [
    {
      "id": "btn_primary_default",
      "foreground": "#FFFFFF",
      "background": "#2563EB",
      "targetLevel": "AA"
    },
    {
      "id": "alert_success_text",
      "foreground": "#065F46",
      "background": "#D1FAE5",
      "targetLevel": "AA"
    },
    {
      "id": "body_text_muted",
      "foreground": "#94A3B8",
      "background": "#0F172A",
      "targetLevel": "AAA"
    }
  ]
}
```

### Example Response (`200 OK`)

```json
{
  "count": 3,
  "results": [
    {
      "id": "btn_primary_default",
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
    },
    {
      "id": "alert_success_text",
      "status": "success",
      "foreground": "#065F46",
      "background": "#D1FAE5",
      "contrastRatio": 7.42,
      "formattedRatio": "7.42:1",
      "wcagGrade": "AAA",
      "contextPass": true,
      "normalTextAA": true,
      "normalTextAAA": true,
      "apcaLc": 84.1,
      "autoFix": {
        "needed": false,
        "suggestedForegroundHex": "#065F46",
        "fixedContrastRatio": 7.42
      }
    },
    {
      "id": "body_text_muted",
      "status": "success",
      "foreground": "#94A3B8",
      "background": "#0F172A",
      "contrastRatio": 6.82,
      "formattedRatio": "6.82:1",
      "wcagGrade": "AA",
      "contextPass": false,
      "normalTextAA": true,
      "normalTextAAA": false,
      "apcaLc": -74.8,
      "autoFix": {
        "needed": true,
        "suggestedForegroundHex": "#9DB0C8",
        "fixedContrastRatio": 7.02
      }
    }
  ],
  "meta": {
    "execution_time_ms": 1.15,
    "timestamp": "2026-11-08T21:00:00.000Z"
  }
}
```

---

## 7. Production Code Snippets

### Node.js (Native Fetch, ES Modules)

```javascript
import process from 'node:process';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || 'YOUR_RAPIDAPI_KEY';
const RAPIDAPI_HOST = 'contrastguard-wcag-color-contrast-and-accessibility-fixer.p.rapidapi.com';

async function auditColorContrast() {
  const url = `https://${RAPIDAPI_HOST}/v1/audit`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': RAPIDAPI_HOST
    },
    body: JSON.stringify({
      foreground: '#3B82F6',
      background: '#0F172A',
      targetLevel: 'AA',
      fontSizePx: 16,
      fontWeight: 400
    })
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Contrast Ratio:', data.formattedRatio);
  console.log('WCAG Grade:', data.wcag21.grade);
  console.log('APCA Score:', data.apca.lc);

  if (data.autoFix.needed) {
    console.log('Suggested Accessible Foreground:', data.autoFix.suggestedForegroundHex);
  }
}

auditColorContrast().catch(console.error);
```

### Python 3 (Requests)

```python
import os
import requests

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY", "YOUR_RAPIDAPI_KEY")
RAPIDAPI_HOST = "contrastguard-wcag-color-contrast-and-accessibility-fixer.p.rapidapi.com"

url = f"https://{RAPIDAPI_HOST}/v1/audit"

payload = {
    "foreground": "#3B82F6",
    "background": "#0F172A",
    "targetLevel": "AA",
    "fontSizePx": 16,
    "fontWeight": 400
}

headers = {
    "Content-Type": "application/json",
    "X-RapidAPI-Key": RAPIDAPI_KEY,
    "X-RapidAPI-Host": RAPIDAPI_HOST
}

response = requests.post(url, json=payload, headers=headers, timeout=5)
response.raise_for_status()

data = response.json()
print(f"Contrast Ratio: {data['contrastRatio']}:1")
print(f"AA Normal Pass: {data['wcag21']['normalTextAA']}")
print(f"APCA Readability: {data['apca']['rating']}")

if data["autoFix"]["needed"]:
    print(f"Suggested Accessible Hex: {data['autoFix']['suggestedForegroundHex']}")
    print(f"Fixed Contrast Ratio: {data['autoFix']['fixedContrastRatio']}:1")
```

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

---

## 8. Developer & AI Assistant FAQ

#### What exact formula is used for WCAG 2.1 relative luminance?
WCAG 2.1 specification defines relative luminance $Y$ as:
$$Y = 0.2126 \cdot R_{lin} + 0.7152 \cdot G_{lin} + 0.0722 \cdot B_{lin}$$
where each 8-bit sRGB channel $C \in [0, 255]$ is converted to linear RGB via:
$$C_{lin} = \begin{cases} \frac{C / 255}{12.92} & \frac{C}{255} \le 0.04045 \\ \left(\frac{C / 255 + 0.055}{1.055}\right)^{2.4} & \frac{C}{255} > 0.04045 \end{cases}$$
The contrast ratio is calculated as $(L_1 + 0.05) / (L_2 + 0.05)$, where $L_1$ is the lighter luminance and $L_2$ is the darker luminance.

#### What is APCA and why should developers check it alongside WCAG 2.1?
APCA (Advanced Perceptual Contrast Algorithm) is the candidate standard for WCAG 3.0. Unlike WCAG 2.1's linear luminance ratio, APCA models human visual perception, spatial frequency (font size and stroke thickness), and polarity (light-on-dark vs dark-on-light). ContrastGuard API returns both metrics simultaneously so teams achieve legal compliance under current laws while future-proofing design systems for WCAG 3.0.

#### How does the Auto-Fixer determine the suggested hex value?
The Auto-Fixer preserves the exact Hue ($H$) and Saturation ($S$) of the original color and executes a binary search along the Lightness ($L$) axis in HSL space. It assesses both lightening and darkening vectors to locate the minimal lightness shift ($|\Delta L|$) required to satisfy the chosen target ratio. A discrete hex verification step ensures that 8-bit color quantization never drops below the strict ratio threshold.

#### What color blindness conditions are simulated?
The engine implements physiologically accurate $3 \times 3$ linear RGB transformation matrices (Brettel & Viénot model):
1. **Protanopia**: L-cone deficiency (red-blind, ~1% of males)
2. **Deuteranopia**: M-cone deficiency (green-blind, ~5% of males)
3. **Tritanopia**: S-cone deficiency (blue-blind, rare)
4. **Achromatopsia**: Rod monochromacy (total color blindness, relative luminance grayscale)
Each simulation returns the simulated foreground/background hex values and recalculated contrast ratios to ensure legibility across all user segments.

#### Can ContrastGuard API be integrated into CI/CD pipelines?
Yes. The `POST /v1/batch` endpoint is optimized for automated testing. You can pass design token JSON files or theme configuration objects directly to the endpoint in pre-commit hooks or GitHub Actions to block breaking contrast changes before deployment.

#### Does this API store or log color queries?
No. ContrastGuard API is 100% in-memory and stateless. Colors are parsed, mathematically computed, and returned immediately without database persistence or logging of color data.
