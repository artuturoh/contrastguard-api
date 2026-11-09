/**
 * Pure mathematical color science engine for ContrastGuard API.
 * 100% in-memory, ultra-fast (<2ms), zero external dependencies.
 *
 * Implements:
 * - W3C WCAG 2.1 Relative Luminance & Contrast Ratio calculation
 * - WCAG 3.0 draft APCA (Advanced Perceptual Contrast Algorithm) Lc score
 * - HSL Lightness binary-search Auto-Fixer
 * - Brettel/Viénot color blindness transformation matrices
 * - 11-step design system palette generator
 */

import { parseColor, rgbToHex, rgbToHsl, hslToRgb, clamp } from './colorParser.js';

/**
 * Convert standard 8-bit sRGB channel (0-255) to Linear RGB luminance component per W3C WCAG 2.1.
 */
export function srgbChannelToLinear(val) {
  const c = clamp(val, 0, 255) / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Convert Linear RGB component back to 8-bit sRGB channel (0-255).
 */
export function linearChannelToSrgb(val) {
  const c = Math.max(0, val);
  const s = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return clamp(Math.round(s * 255), 0, 255);
}

/**
 * Compute relative luminance Y per W3C WCAG 2.1 specification.
 * Returns float in [0.0, 1.0].
 */
export function getRelativeLuminance(rgb) {
  const rLin = srgbChannelToLinear(rgb.r);
  const gLin = srgbChannelToLinear(rgb.g);
  const bLin = srgbChannelToLinear(rgb.b);
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/**
 * Compute exact WCAG 2.1 contrast ratio between two colors.
 * Returns number rounded to 2 decimals, between 1.00 and 21.00.
 */
export function calculateContrastRatio(colorA, colorB) {
  const lumA = getRelativeLuminance(colorA);
  const lumB = getRelativeLuminance(colorB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Number(ratio.toFixed(2));
}

/**
 * Evaluate WCAG 2.1 compliance details for a contrast ratio.
 */
export function evaluateWcag21(ratio, targetLevel = 'AA', fontSizePx = 16, fontWeight = 400) {
  const isBold = typeof fontWeight === 'string'
    ? fontWeight.toLowerCase() === 'bold' || parseInt(fontWeight, 10) >= 700
    : Number(fontWeight) >= 700;

  // WCAG 2.1: Large text is at least 18pt (24px) or 14pt (18.66px) bold
  const isLargeText = (fontSizePx >= 24) || (fontSizePx >= 18.66 && isBold);

  const normalTextAA = ratio >= 4.5;
  const normalTextAAA = ratio >= 7.0;
  const largeTextAA = ratio >= 3.0;
  const largeTextAAA = ratio >= 4.5;
  const uiComponentsAA = ratio >= 3.0;

  const upperLevel = String(targetLevel).toUpperCase();
  let requiredRatio = 4.5;
  if (upperLevel === 'AAA') {
    requiredRatio = isLargeText ? 4.5 : 7.0;
  } else {
    requiredRatio = isLargeText ? 3.0 : 4.5;
  }

  const contextPass = ratio >= requiredRatio;

  let grade = 'FAIL';
  if (ratio >= 7.0) {
    grade = 'AAA';
  } else if (ratio >= 4.5) {
    grade = 'AA';
  } else if (ratio >= 3.0) {
    grade = 'AA Large Only';
  }

  return {
    normalTextAA,
    normalTextAAA,
    largeTextAA,
    largeTextAAA,
    uiComponentsAA,
    contextPass,
    grade,
    isLargeText,
    requiredRatio
  };
}

/**
 * Compute APCA (Advanced Perceptual Contrast Algorithm - WCAG 3.0 candidate).
 * Returns perceptual Lc value and readability rating.
 */
export function calculateApca(fgRgb, bgRgb) {
  // Convert sRGB to APCA Y with soft clamp
  const toApcaY = (rgb) => {
    const rLin = Math.pow(rgb.r / 255, 2.4);
    const gLin = Math.pow(rgb.g / 255, 2.4);
    const bLin = Math.pow(rgb.b / 255, 2.4);
    let y = 0.2126729 * rLin + 0.7151522 * gLin + 0.0721750 * bLin;
    if (y < 0.022) {
      y += Math.pow(0.022 - y, 1.414);
    }
    return y;
  };

  const yTxt = toApcaY(fgRgb);
  const yBg = toApcaY(bgRgb);

  let lc = 0;
  if (yBg >= yTxt) {
    // Dark text on light background (positive contrast)
    const sBg = Math.pow(yBg, 0.56);
    const sTxt = Math.pow(yTxt, 0.62);
    const raw = (sBg - sTxt) * 1.14;
    lc = raw < 0.1 ? 0 : (raw - 0.027) * 100;
  } else {
    // Light text on dark background (negative contrast)
    const sBg = Math.pow(yBg, 0.65);
    const sTxt = Math.pow(yTxt, 0.57);
    const raw = (sBg - sTxt) * 1.14;
    lc = raw > -0.1 ? 0 : (raw + 0.027) * 100;
  }

  const roundedLc = Number(lc.toFixed(1));
  const absLc = Math.abs(roundedLc);

  let rating = 'Fails perceptual readability';
  if (absLc >= 90) {
    rating = 'Preferred for body text (fluent reading at 14px+)';
  } else if (absLc >= 75) {
    rating = 'Acceptable for body text (16px+) or headlines (14px+ bold)';
  } else if (absLc >= 60) {
    rating = 'Acceptable for large text (24px+) or bold (18px+)';
  } else if (absLc >= 45) {
    rating = 'Large headlines (36px+) or non-text UI controls';
  } else if (absLc >= 30) {
    rating = 'Decorative or non-essential text';
  }

  return {
    lc: roundedLc,
    rating
  };
}

/**
 * Auto-Fixer: Find nearest accessible color by shifting Lightness in HSL space.
 * Preserves original Hue and Saturation while strictly achieving target ratio.
 */
export function autoFixColor(fgColor, bgColor, targetRatio = 4.5) {
  const currentRatio = calculateContrastRatio(fgColor, bgColor);
  if (currentRatio >= targetRatio) {
    return {
      needed: false,
      targetRatio,
      suggestedForegroundHex: fgColor.hex,
      suggestedBackgroundHex: bgColor.hex,
      fixedContrastRatio: currentRatio,
      deltaLightness: 0
    };
  }

  // 1. Compute suggested foreground
  const fgHsl = fgColor.hsl;
  const candidateLighterFg = findLightnessBoundary(fgHsl.h, fgHsl.s, fgHsl.l, 100, bgColor, targetRatio, true);
  const candidateDarkerFg = findLightnessBoundary(fgHsl.h, fgHsl.s, 0, fgHsl.l, bgColor, targetRatio, false);

  let bestFgHex = fgColor.hex;
  let bestFgRatio = currentRatio;
  let bestFgDelta = Infinity;

  if (candidateLighterFg) {
    const delta = Math.abs(candidateLighterFg.l - fgHsl.l);
    if (delta < bestFgDelta) {
      bestFgHex = candidateLighterFg.hex;
      bestFgRatio = candidateLighterFg.ratio;
      bestFgDelta = delta;
    }
  }

  if (candidateDarkerFg) {
    const delta = Math.abs(candidateDarkerFg.l - fgHsl.l);
    if (delta < bestFgDelta) {
      bestFgHex = candidateDarkerFg.hex;
      bestFgRatio = candidateDarkerFg.ratio;
      bestFgDelta = delta;
    }
  }

  // Fallback if neither single-direction reached target with same H/S (e.g. extreme saturations)
  if (bestFgRatio < targetRatio) {
    const whiteRatio = calculateContrastRatio({ r: 255, g: 255, b: 255 }, bgColor);
    const blackRatio = calculateContrastRatio({ r: 0, g: 0, b: 0 }, bgColor);
    if (whiteRatio >= blackRatio) {
      bestFgHex = '#FFFFFF';
      bestFgRatio = whiteRatio;
      bestFgDelta = Math.abs(100 - fgHsl.l);
    } else {
      bestFgHex = '#000000';
      bestFgRatio = blackRatio;
      bestFgDelta = Math.abs(0 - fgHsl.l);
    }
  }

  // 2. Compute suggested background
  const bgHsl = bgColor.hsl;
  const candidateLighterBg = findLightnessBoundary(bgHsl.h, bgHsl.s, bgHsl.l, 100, fgColor, targetRatio, true);
  const candidateDarkerBg = findLightnessBoundary(bgHsl.h, bgHsl.s, 0, bgHsl.l, fgColor, targetRatio, false);

  let bestBgHex = bgColor.hex;
  let bestBgDelta = Infinity;

  if (candidateLighterBg) {
    const delta = Math.abs(candidateLighterBg.l - bgHsl.l);
    if (delta < bestBgDelta) {
      bestBgHex = candidateLighterBg.hex;
      bestBgDelta = delta;
    }
  }

  if (candidateDarkerBg) {
    const delta = Math.abs(candidateDarkerBg.l - bgHsl.l);
    if (delta < bestBgDelta) {
      bestBgHex = candidateDarkerBg.hex;
      bestBgDelta = delta;
    }
  }

  if (bestBgHex === bgColor.hex) {
    const whiteRatio = calculateContrastRatio(fgColor, { r: 255, g: 255, b: 255 });
    const blackRatio = calculateContrastRatio(fgColor, { r: 0, g: 0, b: 0 });
    bestBgHex = whiteRatio >= blackRatio ? '#FFFFFF' : '#000000';
  }

  return {
    needed: true,
    targetRatio,
    suggestedForegroundHex: bestFgHex,
    suggestedBackgroundHex: bestBgHex,
    fixedContrastRatio: bestFgRatio,
    deltaLightness: Number((bestFgDelta * (candidateDarkerFg && bestFgHex === candidateDarkerFg.hex ? -1 : 1)).toFixed(1))
  };
}

/**
 * Binary search for the lightness threshold that satisfies targetRatio against fixedColor.
 */
function findLightnessBoundary(h, s, lowL, highL, fixedColor, targetRatio, isIncreasing) {
  let low = lowL;
  let high = highL;
  let bestResult = null;

  // Check if extreme satisfies requirement
  const extremeL = isIncreasing ? highL : lowL;
  const extremeRgb = hslToRgb(h, s, extremeL);
  const extremeRatio = calculateContrastRatio(extremeRgb, fixedColor);
  if (extremeRatio < targetRatio) {
    return null;
  }

  // Binary search for 16 iterations (precision < 0.002%)
  for (let i = 0; i < 18; i++) {
    const mid = (low + high) / 2;
    const rgb = hslToRgb(h, s, mid);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const parsedHex = parseColor(hex);
    const ratio = calculateContrastRatio(parsedHex, fixedColor);

    if (ratio >= targetRatio) {
      bestResult = { l: Number(mid.toFixed(1)), hex, ratio };
      if (isIncreasing) {
        high = mid; // Try closer to original
      } else {
        low = mid; // Try closer to original
      }
    } else {
      if (isIncreasing) {
        low = mid;
      } else {
        high = mid;
      }
    }
  }

  // Ensure discrete hex rounding doesn't drop below targetRatio
  if (bestResult) {
    let rgb = parseColor(bestResult.hex);
    let ratio = calculateContrastRatio(rgb, fixedColor);
    let currentL = bestResult.l;

    while (ratio < targetRatio && currentL >= 0 && currentL <= 100) {
      currentL += isIncreasing ? 0.5 : -0.5;
      const stepRgb = hslToRgb(h, s, clamp(currentL, 0, 100));
      const stepHex = rgbToHex(stepRgb.r, stepRgb.g, stepRgb.b);
      rgb = parseColor(stepHex);
      ratio = calculateContrastRatio(rgb, fixedColor);
      bestResult = { l: Number(currentL.toFixed(1)), hex: stepHex, ratio };
    }
  }

  return bestResult;
}

/**
 * Color Blindness Simulation (Brettel & Viénot 1997 / Machado transformation matrices).
 * Simulates protanopia, deuteranopia, tritanopia, and achromatopsia.
 */
export function simulateColorBlindness(fgColor, bgColor) {
  // Brettel / Viénot 3x3 matrices in linear RGB
  const MATRICES = {
    protanopia: [
      [0.56667, 0.43333, 0.00000],
      [0.55833, 0.44167, 0.00000],
      [0.00000, 0.24167, 0.75833]
    ],
    deuteranopia: [
      [0.62500, 0.37500, 0.00000],
      [0.70000, 0.30000, 0.00000],
      [0.00000, 0.30000, 0.70000]
    ],
    tritanopia: [
      [0.95000, 0.05000, 0.00000],
      [0.00000, 0.43333, 0.56667],
      [0.00000, 0.47500, 0.52500]
    ]
  };

  const transformRgb = (rgb, matrix) => {
    const rLin = srgbChannelToLinear(rgb.r);
    const gLin = srgbChannelToLinear(rgb.g);
    const bLin = srgbChannelToLinear(rgb.b);

    const rTrans = matrix[0][0] * rLin + matrix[0][1] * gLin + matrix[0][2] * bLin;
    const gTrans = matrix[1][0] * rLin + matrix[1][1] * gLin + matrix[1][2] * bLin;
    const bTrans = matrix[2][0] * rLin + matrix[2][1] * gLin + matrix[2][2] * bLin;

    const rSrgb = linearChannelToSrgb(rTrans);
    const gSrgb = linearChannelToSrgb(gTrans);
    const bSrgb = linearChannelToSrgb(bTrans);

    return {
      r: rSrgb,
      g: gSrgb,
      b: bSrgb,
      hex: rgbToHex(rSrgb, gSrgb, bSrgb)
    };
  };

  const transformAchromatopsia = (rgb) => {
    // Relative luminance grayscale
    const lum = getRelativeLuminance(rgb);
    const gray = linearChannelToSrgb(lum);
    return {
      r: gray,
      g: gray,
      b: gray,
      hex: rgbToHex(gray, gray, gray)
    };
  };

  const buildSimulation = (transFn) => {
    const simFg = transFn(fgColor);
    const simBg = transFn(bgColor);
    const ratio = calculateContrastRatio(simFg, simBg);
    return {
      foregroundHex: simFg.hex,
      backgroundHex: simBg.hex,
      contrastRatio: ratio
    };
  };

  return {
    protanopia: buildSimulation((c) => transformRgb(c, MATRICES.protanopia)),
    deuteranopia: buildSimulation((c) => transformRgb(c, MATRICES.deuteranopia)),
    tritanopia: buildSimulation((c) => transformRgb(c, MATRICES.tritanopia)),
    achromatopsia: buildSimulation(transformAchromatopsia)
  };
}

/**
 * 11-step design system shade scale generator (50 to 950).
 */
export function generatePalette(baseColorInput, backgroundInput = '#FFFFFF') {
  const base = parseColor(baseColorInput);
  const bg = parseColor(backgroundInput);

  // Standard Tailwind/design system lightness targets
  const STEPS = [
    { name: 50, targetL: 97, satFactor: 0.8 },
    { name: 100, targetL: 92, satFactor: 0.85 },
    { name: 200, targetL: 83, satFactor: 0.92 },
    { name: 300, targetL: 72, satFactor: 0.96 },
    { name: 400, targetL: 61, satFactor: 0.98 },
    { name: 500, targetL: 50, satFactor: 1.0 },
    { name: 600, targetL: 41, satFactor: 1.0 },
    { name: 700, targetL: 32, satFactor: 0.98 },
    { name: 800, targetL: 23, satFactor: 0.95 },
    { name: 900, targetL: 15, satFactor: 0.92 },
    { name: 950, targetL: 8, satFactor: 0.88 }
  ];

  const scale = STEPS.map((step) => {
    const adjustedSat = clamp(base.hsl.s * step.satFactor, 0, 100);
    const rgb = hslToRgb(base.hsl.h, adjustedSat, step.targetL);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const stepColor = parseColor(hex);

    const contrastBg = calculateContrastRatio(stepColor, bg);
    const wcag = evaluateWcag21(contrastBg, 'AA');

    // Recommended text color: white vs dark slate
    const whiteRatio = calculateContrastRatio(stepColor, { r: 255, g: 255, b: 255 });
    const darkRatio = calculateContrastRatio(stepColor, { r: 15, g: 23, b: 42 }); // #0F172A
    const recommendedTextColor = whiteRatio >= darkRatio ? '#FFFFFF' : '#0F172A';

    return {
      step: step.name,
      hex,
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${stepColor.hsl.h}, ${stepColor.hsl.s}%, ${stepColor.hsl.l}%)`,
      contrastAgainstBackground: contrastBg,
      contrastRatio: `${contrastBg.toFixed(2)}:1`,
      wcagGrade: wcag.grade,
      recommendedTextColor
    };
  });

  return {
    baseColor: base.hex,
    background: bg.hex,
    scale
  };
}
