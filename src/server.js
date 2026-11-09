import app from './app.js';

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`ContrastGuard API listening on http://${HOST}:${PORT}`);
  console.log(`Health check: http://${HOST}:${PORT}/health`);
  console.log(`Interactive Studio: http://${HOST}:${PORT}/`);
});

// Graceful shutdown handling
const shutdown = () => {
  console.log('Shutting down ContrastGuard API gracefully...');
  server.close(() => {
    console.log('Server process terminated.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export { server, app };
