import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { VercelRequest, VercelResponse } from '@vercel/node';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware for logging
app.use((req, res, next) => {
  const start = Date.now();
  const originalJson = res.json;

  res.json = function(body) {
    res.locals.responseBody = body;
    return originalJson.call(this, body);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    log(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
  });

  next();
});

// Health check endpoint
app.get('/health', (_, res) => res.status(200).json({ status: 'OK' }));

// Vercel serverless handler
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const appWithRoutes = await registerRoutes(app);

    if (process.env.NODE_ENV === 'development') {
      await setupVite(appWithRoutes);
    } else {
      serveStatic(appWithRoutes);
    }

    return appWithRoutes(req, res);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Local development server
if (process.env.NODE_ENV !== 'production') {
  (async () => {
    const appWithRoutes = await registerRoutes(app);
    const port = process.env.PORT || 5000;

    if (process.env.NODE_ENV === 'development') {
      await setupVite(appWithRoutes);
    } else {
      serveStatic(appWithRoutes);
    }

    appWithRoutes.listen(port, () => {
      log(`Server running on http://localhost:${port}`);
    });
  })();
}