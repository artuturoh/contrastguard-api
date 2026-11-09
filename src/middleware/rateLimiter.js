import rateLimit from 'express-rate-limit';

/**
 * Demo rate limiter: 20 requests per minute per IP.
 * Used exclusively for /v1/demo to protect public playground while keeping it fast and accessible.
 */
export const demoRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too Many Requests',
    message: 'Demo rate limit exceeded (20 requests per minute). Please upgrade to RapidAPI for unlimited access.'
  }
});

/**
 * Standard API rate limiter: 600 requests per 15 minutes.
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too Many Requests',
    message: 'Global rate limit exceeded. Please try again later.'
  }
});
