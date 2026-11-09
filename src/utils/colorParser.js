/**
 * Pure in-memory color parser for ContrastGuard API.
 * Supports:
 * - 3-digit hex (#RGB, RGB)
 * - 4-digit hex (#RGBA, RGBA)
 * - 6-digit hex (#RRGGBB, RRGGBB)
 * - 8-digit hex (#RRGGBBAA, RRGGBBAA)
 * - rgb(r, g, b) / rgba(r, g, b, a) / rgb(r g b)
 * - hsl(h, s%, l%) / hsla(h, s%, l%, a)
 * - Common CSS named colors
 */

const NAMED_COLORS = {
  black: '#000000',
  white: '#FFFFFF',
  red: '#FF0000',
  green: '#008000',
  blue: '#0000FF',
  yellow: '#FFFF00',
  cyan: '#00FFFF',
  magenta: '#FF00FF',
  silver: '#C0C0C0',
  gray: '#808080',
  grey: '#808080',
  maroon: '#800000',
  olive: '#808000',
  lime: '#00FF00',
  purple: '#800080',
  teal: '#008080',
  navy: '#000080',
  orange: '#FFA500',
  pink: '#FFC0CB',
  gold: '#FFD700',
  indigo: '#4B0082',
  violet: '#EE82EE',
  transparent: '#000000'
};

/**
 * Clamp a number between min and max.
 */
export function clamp(val, min = 0, max = 255) {
  return Math.min(Math.max(val, min), max);
}

/**
 * Convert RGB (0-255) to 6-digit uppercase Hex (#RRGGBB).
 */
export function rgbToHex(r, g, b) {
  const toHex = (c) => clamp(Math.round(c), 0, 255).toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert RGB (0-255) to HSL ({ h: 0-360, s: 0-100, l: 0-100 }).
 */
export function rgbToHsl(r, g, b) {
  const rNorm = clamp(r, 0, 255) / 255;
  const gNorm = clamp(g, 0, 255) / 255;
  const bNorm = clamp(b, 0, 255) / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Number((h * 360).toFixed(1)),
    s: Number((s * 100).toFixed(1)),
    l: Number((l * 100).toFixed(1))
  };
}

/**
 * Convert HSL (h: 0-360, s: 0-100, l: 0-100) to RGB ({ r, g, b }).
 */
export function hslToRgb(h, s, l) {
  const hNorm = ((h % 360) + 360) % 360 / 360;
  const sNorm = clamp(s, 0, 100) / 100;
  const lNorm = clamp(l, 0, 100) / 100;

  if (sNorm === 0) {
    const val = Math.round(lNorm * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p, q, t) => {
    let tAdj = t;
    if (tAdj < 0) tAdj += 1;
    if (tAdj > 1) tAdj -= 1;
    if (tAdj < 1 / 6) return p + (q - p) * 6 * tAdj;
    if (tAdj < 1 / 2) return q;
    if (tAdj < 2 / 3) return p + (q - p) * (2 / 3 - tAdj) * 6;
    return p;
  };

  const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
  const p = 2 * lNorm - q;

  const r = Math.round(hue2rgb(p, q, hNorm + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, hNorm) * 255);
  const b = Math.round(hue2rgb(p, q, hNorm - 1 / 3) * 255);

  return {
    r: clamp(r, 0, 255),
    g: clamp(g, 0, 255),
    b: clamp(b, 0, 255)
  };
}

/**
 * Parse any valid CSS color string into normalized RGB, Hex, and HSL.
 * Throws an Error with descriptive message if invalid.
 */
export function parseColor(colorInput) {
  if (typeof colorInput !== 'string') {
    throw new Error('Color must be a string');
  }

  const raw = colorInput.trim().toLowerCase();
  if (!raw) {
    throw new Error('Color string cannot be empty');
  }

  // Check named colors
  if (NAMED_COLORS[raw]) {
    return parseColor(NAMED_COLORS[raw]);
  }

  // Match Hex
  const hexMatch = raw.match(/^#?([0-9a-f]{3,8})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    let r = 0, g = 0, b = 0;

    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 4) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
      // alpha hex[3] ignored for contrast ratio base
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else if (hex.length === 8) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
      // alpha hex.substring(6, 8) ignored
    } else {
      throw new Error(`Invalid hex color length: "${colorInput}". Expected 3, 4, 6, or 8 characters.`);
    }

    const hexFormatted = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);
    return { r, g, b, hex: hexFormatted, hsl };
  }

  // Match rgb() or rgba()
  const rgbMatch = raw.match(/^rgba?\(\s*([0-9.%]+)[\s,]+([0-9.%]+)[\s,]+([0-9.%]+)(?:[\s,/]+([0-9.%]+))?\s*\)$/i);
  if (rgbMatch) {
    const parseComponent = (str) => {
      if (str.endsWith('%')) {
        const pct = parseFloat(str);
        if (isNaN(pct)) throw new Error(`Invalid percentage component: ${str}`);
        return clamp(Math.round((pct / 100) * 255), 0, 255);
      }
      const val = parseFloat(str);
      if (isNaN(val)) throw new Error(`Invalid rgb component: ${str}`);
      return clamp(Math.round(val), 0, 255);
    };

    const r = parseComponent(rgbMatch[1]);
    const g = parseComponent(rgbMatch[2]);
    const b = parseComponent(rgbMatch[3]);
    const hex = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);
    return { r, g, b, hex, hsl };
  }

  // Match hsl() or hsla()
  const hslMatch = raw.match(/^hsla?\(\s*([0-9.]+)(?:deg)?[\s,]+([0-9.]+)%?[\s,]+([0-9.]+)%?(?:[\s,/]+[0-9.%]+)?\s*\)$/i);
  if (hslMatch) {
    const h = parseFloat(hslMatch[1]);
    const s = parseFloat(hslMatch[2]);
    const l = parseFloat(hslMatch[3]);

    if (isNaN(h) || isNaN(s) || isNaN(l)) {
      throw new Error(`Invalid hsl component in: ${colorInput}`);
    }

    const rgb = hslToRgb(h, s, l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    return {
      r: rgb.r,
      g: rgb.g,
      b: rgb.b,
      hex,
      hsl: {
        h: Number((((h % 360) + 360) % 360).toFixed(1)),
        s: Number(clamp(s, 0, 100).toFixed(1)),
        l: Number(clamp(l, 0, 100).toFixed(1))
      }
    };
  }

  throw new Error(`Invalid color format: "${colorInput}". Expected hex (#RRGGBB, #RGB), rgb(r, g, b), or hsl(h, s%, l%).`);
}
