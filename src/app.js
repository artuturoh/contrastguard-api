import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rapidapiAuth } from './middleware/rapidapiAuth.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { healthCheck, homePage } from './controllers/homeController.js';
import v1Router from './routes/v1.js';

const app = express();

// Security Headers with Helmet (CSP configured to allow inline styles/scripts for Interactive Studio)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"]
      }
    },
    crossOriginEmbedderPolicy: false
  })
);

// Cross-Origin Resource Sharing
app.use(cors());

// Parse JSON request bodies (fast in-memory parsing)
app.use(express.json({ limit: '100kb' }));

// Health Check Endpoint (Always bypassed from auth)
app.get('/health', healthCheck);

// Root Endpoint (Content-Negotiated: HTML Studio or JSON metadata)
app.get('/', homePage);

// Smart RapidAPI Authentication Middleware on /v1 routes
app.use('/v1', rapidapiAuth, v1Router);

// 404 Not Found Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

export default app;
