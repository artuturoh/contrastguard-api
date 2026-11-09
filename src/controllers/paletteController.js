import { parseColor } from '../utils/colorParser.js';
import { generatePalette } from '../utils/colorScience.js';

/**
 * Controller for POST /v1/palette.
 * Generates an 11-step Tailwind/CSS design system palette with accessibility metrics.
 */
export function createPalette(req, res) {
  const startTime = process.hrtime.bigint();

  const { baseColor, background = '#FFFFFF' } = req.body || {};

  if (!baseColor) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'The "baseColor" parameter is required.'
    });
  }

  try {
    parseColor(baseColor);
  } catch (err) {
    return res.status(400).json({
      error: 'Bad Request',
      message: `Invalid "baseColor": ${err.message}`
    });
  }

  try {
    parseColor(background);
  } catch (err) {
    return res.status(400).json({
      error: 'Bad Request',
      message: `Invalid "background": ${err.message}`
    });
  }

  const palette = generatePalette(baseColor, background);

  const endTime = process.hrtime.bigint();
  const execution_time_ms = Number((Number(endTime - startTime) / 1e6).toFixed(3));

  return res.status(200).json({
    baseColor: palette.baseColor,
    background: palette.background,
    scale: palette.scale,
    meta: {
      stepsCount: palette.scale.length,
      execution_time_ms,
      timestamp: new Date().toISOString()
    }
  });
}
