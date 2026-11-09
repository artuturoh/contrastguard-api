import { parseColor } from '../utils/colorParser.js';
import {
  calculateContrastRatio,
  evaluateWcag21,
  calculateApca,
  autoFixColor,
  simulateColorBlindness
} from '../utils/colorScience.js';

/**
 * Controller for POST /v1/batch.
 * Concurrently audits up to 50 color combinations in memory.
 */
export function batchAudit(req, res) {
  const startTime = process.hrtime.bigint();

  const { pairs } = req.body || {};

  if (!pairs || !Array.isArray(pairs)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'The "pairs" field must be a JSON array containing between 1 and 50 color pair objects.'
    });
  }

  if (pairs.length === 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'The "pairs" array cannot be empty. Please provide at least 1 color pair.'
    });
  }

  if (pairs.length > 50) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Batch limit exceeded. Maximum allowed pairs per request is 50.'
    });
  }

  const results = pairs.map((pair, index) => {
    const id = pair.id ?? `pair_${index + 1}`;
    const { foreground, background, targetLevel = 'AA', fontSizePx = 16, fontWeight = 400 } = pair;

    if (!foreground || !background) {
      return {
        id,
        status: 'error',
        message: 'Both "foreground" and "background" are required.'
      };
    }

    let fgColor, bgColor;
    try {
      fgColor = parseColor(foreground);
    } catch (err) {
      return {
        id,
        status: 'error',
        message: `Invalid foreground: ${err.message}`
      };
    }

    try {
      bgColor = parseColor(background);
    } catch (err) {
      return {
        id,
        status: 'error',
        message: `Invalid background: ${err.message}`
      };
    }

    const normalizedTarget = String(targetLevel).toUpperCase() === 'AAA' ? 'AAA' : 'AA';
    const parsedFontSize = Math.max(1, parseFloat(fontSizePx) || 16);
    const parsedFontWeight = typeof fontWeight === 'string' && fontWeight.toLowerCase() === 'bold'
      ? 700
      : parseInt(fontWeight, 10) || 400;

    const contrastRatio = calculateContrastRatio(fgColor, bgColor);
    const wcag21 = evaluateWcag21(contrastRatio, normalizedTarget, parsedFontSize, parsedFontWeight);
    const apca = calculateApca(fgColor, bgColor);
    const targetRatio = normalizedTarget === 'AAA' ? 7.0 : 4.5;
    const autoFix = autoFixColor(fgColor, bgColor, targetRatio);
    const colorBlindnessSimulation = simulateColorBlindness(fgColor, bgColor);

    return {
      id,
      status: 'success',
      foreground: fgColor.hex,
      background: bgColor.hex,
      contrastRatio,
      formattedRatio: `${contrastRatio.toFixed(2)}:1`,
      wcagGrade: wcag21.grade,
      contextPass: wcag21.contextPass,
      normalTextAA: wcag21.normalTextAA,
      normalTextAAA: wcag21.normalTextAAA,
      apcaLc: apca.lc,
      autoFix: {
        needed: autoFix.needed,
        suggestedForegroundHex: autoFix.suggestedForegroundHex,
        fixedContrastRatio: autoFix.fixedContrastRatio
      },
      colorBlindnessSimulation
    };
  });

  const endTime = process.hrtime.bigint();
  const execution_time_ms = Number((Number(endTime - startTime) / 1e6).toFixed(3));

  return res.status(200).json({
    count: pairs.length,
    results,
    meta: {
      execution_time_ms,
      timestamp: new Date().toISOString()
    }
  });
}
