import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/error.types';
import { TaskPriority, TaskStatus } from '../types/task.types';

const VALID_STATUSES: TaskStatus[] = ['pending', 'in-progress', 'completed'];
const VALID_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

export const validateCreateTask = (req: Request, _res: Response, next: NextFunction): void => {
  const { title, description, status, priority } = req.body;
  const errors: string[] = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push("Field 'title' is required and must be a non-empty string.");
  } else if (title.trim().length > 150) {
    errors.push("Field 'title' must not exceed 150 characters.");
  }

  if (description !== undefined && typeof description !== 'string') {
    errors.push("Field 'description' must be a string if provided.");
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    errors.push(`Field 'status' must be one of: ${VALID_STATUSES.join(', ')}.`);
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    errors.push(`Field 'priority' must be one of: ${VALID_PRIORITIES.join(', ')}.`);
  }

  if (errors.length > 0) {
    return next(new AppError('Validation failed', 400, errors));
  }

  next();
};

export const validateUpdateTask = (req: Request, _res: Response, next: NextFunction): void => {
  const { title, description, status, priority } = req.body;
  const errors: string[] = [];

  if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
    return next(new AppError('At least one field (title, description, status, priority) must be provided for update.', 400));
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push("Field 'title' must be a non-empty string if provided.");
    } else if (title.trim().length > 150) {
      errors.push("Field 'title' must not exceed 150 characters.");
    }
  }

  if (description !== undefined && typeof description !== 'string') {
    errors.push("Field 'description' must be a string if provided.");
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    errors.push(`Field 'status' must be one of: ${VALID_STATUSES.join(', ')}.`);
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    errors.push(`Field 'priority' must be one of: ${VALID_PRIORITIES.join(', ')}.`);
  }

  if (errors.length > 0) {
    return next(new AppError('Validation failed', 400, errors));
  }

  next();
};
