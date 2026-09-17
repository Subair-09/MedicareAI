import type { Request, Response } from 'express';
import { app } from './app';

export default function handler(req: Request, res: Response) {
  // In Vercel serverless deployments, rewrites route /api/:path* to this function.
  // Normalize req.url to ensure the /api prefix is preserved for Express route matching.
  if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  }
  return app(req, res);
}
