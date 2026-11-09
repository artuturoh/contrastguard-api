/**
 * Centralized error handling middleware.
 */

export function notFoundHandler(req, res) {
  return res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: [
      'GET /health',
      'GET /',
      'POST /v1/audit',
      'POST /v1/demo',
      'POST /v1/palette',
      'POST /v1/batch'
    ]
  });
}

export function errorHandler(err, req, res, next) {
  // Handle invalid JSON body in request
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid JSON payload in request body.'
    });
  }

  console.error('Unhandled server error:', err);
  return res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred while processing the color contrast calculation.'
  });
}
