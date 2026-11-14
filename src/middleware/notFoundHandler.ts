import { Request, Response } from 'express';
import { ApiResponse } from '../types/task.types';

export const notFoundHandler = (req: Request, res: Response<ApiResponse>): void => {
  res.status(404).json({
    success: false,
    error: `Resource not found: ${req.method} ${req.originalUrl}`
  });
};
