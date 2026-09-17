import './server/polyfills';
import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { app } from './server/app';

const PORT = 3000;

async function startServer() {
  // Vite Middleware Setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 MediCare Hospital Server running on http://0.0.0.0:${PORT}`);
  });
}

// Only start standalone server when run directly (not in Vercel serverless functions)
if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('Fatal server startup error:', err);
    process.exit(1);
  });
}

export { app };
export default app;
