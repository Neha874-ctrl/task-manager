import { Request, Response } from 'express';

export const getHealth = (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
};
