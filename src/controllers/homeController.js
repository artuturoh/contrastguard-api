import { renderLandingHtml } from '../views/landingHtml.js';

/**
 * Controller for GET /health.
 */
export function healthCheck(req, res) {
  return res.status(200).json({
    status: 'ok',
    service: 'contrastguard-api',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
}

/**
 * Controller for GET / with content negotiation (HTML Studio vs JSON metadata).
 */
export function homePage(req, res) {
  // If request specifically prefers text/html
  if (req.accepts('html')) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(renderLandingHtml());
  }

  // Otherwise return JSON API metadata
  return res.status(200).json({
    service: 'contrastguard-api',
    name: 'ContrastGuard API — WCAG 2.1 & APCA Color Contrast Analyzer, Auto-Fixer & Accessible Palette Generator',
    version: '1.0.0',
    status: 'online',
    description: 'Ultra-fast (<2ms), 100% in-memory color contrast auditing, auto-fixing, APCA perceptual scoring, and design system scale generator.',
    rapidapi: {
      playground: 'https://rapidapi.com/artuturoh/api/contrastguard-wcag-color-contrast-and-accessibility-fixer',
      docs: '/docs'
    },
    endpoints: {
      health: { method: 'GET', path: '/health', description: 'Microservice health check and uptime' },
      audit: { method: 'POST', path: '/v1/audit', description: 'Analyze contrast ratio, WCAG 2.1 AA/AAA, APCA Lc, auto-fix, and color blindness' },
      demo: { method: 'POST', path: '/v1/demo', description: 'Public playground endpoint for live landing page auditing (rate limited to 20 req/min)' },
      palette: { method: 'POST', path: '/v1/palette', description: 'Generate 11-step Tailwind/CSS accessible shade scales from base color' },
      batch: { method: 'POST', path: '/v1/batch', description: 'Concurrently audit up to 50 color pairs in memory in <5ms' }
    },
    timestamp: new Date().toISOString()
  });
}
