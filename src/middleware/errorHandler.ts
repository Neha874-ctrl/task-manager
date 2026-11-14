import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/error.types';
import { ApiResponse } from '../types/task.types';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(err.errors && err.errors.length > 0 ? { errors: err.errors } : {})
    });
    return;
  }

  // Handle SyntaxError (e.g. invalid JSON payload)
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      error: 'Malformed JSON payload in request body'
    });
    return;
  }

  // Catch-all unhandled server error
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
};
