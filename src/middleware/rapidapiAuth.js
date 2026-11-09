/**
 * Smart RapidAPI Security Middleware.
 *
 * Enforces `X-RapidAPI-Proxy-Secret` authentication on `/v1/*` endpoints
 * when `process.env.RAPIDAPI_PROXY_SECRET` is configured.
 *
 * Exceptions:
 * - Always bypasses `/health` and `/`.
 * - Bypasses `/v1/demo` (which is separately rate-limited to 20 req/min) so the public
 *   landing page studio can execute live audits.
 */

export function rapidapiAuth(req, res, next) {
  const secret = process.env.RAPIDAPI_PROXY_SECRET;

  // If no secret configured, bypass (e.g. local development or open deployment)
  if (!secret) {
    return next();
  }

  const fullPath = (req.baseUrl || '') + (req.path || '');

  // Always bypass root and health check
  if (fullPath === '/' || fullPath === '/health') {
    return next();
  }

  // Allow live interactive landing page studio on /v1/demo without secret
  if (fullPath === '/v1/demo' || fullPath.startsWith('/v1/demo/')) {
    return next();
  }

  // Check /v1/* protected routes
  if (fullPath.startsWith('/v1')) {
    const incomingSecret = req.headers['x-rapidapi-proxy-secret'];

    if (!incomingSecret || incomingSecret !== secret) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid RapidAPI proxy secret header (X-RapidAPI-Proxy-Secret).'
      });
    }
  }

  return next();
}
