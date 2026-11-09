import { Router } from 'express';
import { auditColors } from '../controllers/auditController.js';
import { createPalette } from '../controllers/paletteController.js';
import { batchAudit } from '../controllers/batchController.js';
import { demoRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Core audit endpoint (protected by RapidAPI secret if configured)
router.post('/audit', auditColors);

// Public demo endpoint for live landing page studio (rate limited, bypasses RapidAPI secret)
router.post('/demo', demoRateLimiter, auditColors);

// Palette generation endpoint
router.post('/palette', createPalette);

// Concurrently batch audit up to 50 pairs
router.post('/batch', batchAudit);

export default router;
