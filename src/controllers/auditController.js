import { parseColor } from '../utils/colorParser.js';
import {
  calculateContrastRatio,
  evaluateWcag21,
  calculateApca,
  autoFixColor,
  simulateColorBlindness
} from '../utils/colorScience.js';

/**
 * Controller for POST /v1/audit and POST /v1/demo.
 */
export function auditColors(req, res) {
  const startTime = process.hrtime.bigint();

  const {
    foreground,
    background,
    targetLevel = 'AA',
    fontSizePx = 16,
    fontWeight = 400
  } = req.body || {};

  if (!foreground || !background) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Both "foreground" and "background" color parameters are required.'
    });
  }

  let fgColor;
  let bgColor;

  try {
    fgColor = parseColor(foreground);
  } catch (err) {
    return res.status(400).json({
      error: 'Bad Request',
      message: `Invalid "foreground" color: ${err.message}`
    });
  }

  try {
    bgColor = parseColor(background);
  } catch (err) {
    return res.status(400).json({
      error: 'Bad Request',
      message: `Invalid "background" color: ${err.message}`
    });
  }

  const normalizedTarget = String(targetLevel).toUpperCase() === 'AAA' ? 'AAA' : 'AA';
  const parsedFontSize = Math.max(1, parseFloat(fontSizePx) || 16);
  const parsedFontWeight = typeof fontWeight === 'string' && fontWeight.toLowerCase() === 'bold'
    ? 700
    : parseInt(fontWeight, 10) || 400;

  // Exact WCAG 2.1 Contrast Ratio
  const contrastRatio = calculateContrastRatio(fgColor, bgColor);
  const formattedRatio = `${contrastRatio.toFixed(2)}:1`;

  // WCAG 2.1 Compliance
  const wcag21 = evaluateWcag21(contrastRatio, normalizedTarget, parsedFontSize, parsedFontWeight);

  // APCA (WCAG 3.0 draft)
  const apca = calculateApca(fgColor, bgColor);

  // Auto-Fixer
  const targetRatio = normalizedTarget === 'AAA' ? 7.0 : 4.5;
  const autoFix = autoFixColor(fgColor, bgColor, targetRatio);

  // Color Blindness Simulations
  const colorBlindnessSimulation = simulateColorBlindness(fgColor, bgColor);

  const endTime = process.hrtime.bigint();
  const execution_time_ms = Number((Number(endTime - startTime) / 1e6).toFixed(3));

  return res.status(200).json({
    foreground: {
      input: foreground,
      hex: fgColor.hex,
      rgb: `rgb(${fgColor.r}, ${fgColor.g}, ${fgColor.b})`,
      hsl: `hsl(${fgColor.hsl.h}, ${fgColor.hsl.s}%, ${fgColor.hsl.l}%)`
    },
    background: {
      input: background,
      hex: bgColor.hex,
      rgb: `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`,
      hsl: `hsl(${bgColor.hsl.h}, ${bgColor.hsl.s}%, ${bgColor.hsl.l}%)`
    },
    contrastRatio,
    formattedRatio,
    wcag21: {
      normalTextAA: wcag21.normalTextAA,
      normalTextAAA: wcag21.normalTextAAA,
      largeTextAA: wcag21.largeTextAA,
      largeTextAAA: wcag21.largeTextAAA,
      uiComponentsAA: wcag21.uiComponentsAA,
      contextPass: wcag21.contextPass,
      grade: wcag21.grade,
      context: {
        fontSizePx: parsedFontSize,
        fontWeight: parsedFontWeight,
        isLargeText: wcag21.isLargeText,
        targetLevel: normalizedTarget,
        requiredRatio: wcag21.requiredRatio
      }
    },
    apca: {
      lc: apca.lc,
      rating: apca.rating
    },
    autoFix: {
      needed: autoFix.needed,
      targetRatio: autoFix.targetRatio,
      suggestedForegroundHex: autoFix.suggestedForegroundHex,
      suggestedBackgroundHex: autoFix.suggestedBackgroundHex,
      fixedContrastRatio: autoFix.fixedContrastRatio,
      deltaLightness: autoFix.deltaLightness
    },
    colorBlindnessSimulation,
    meta: {
      execution_time_ms,
      timestamp: new Date().toISOString()
    }
  });
}
