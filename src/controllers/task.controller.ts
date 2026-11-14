import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/task.service';
import { AppError } from '../types/error.types';
import { ApiResponse, Task, TaskPriority, TaskStatus } from '../types/task.types';

export class TaskController {
  public getAllTasks = (req: Request, res: Response<ApiResponse<Task[]>>, next: NextFunction): void => {
    try {
      const status = typeof req.query.status === 'string' ? (req.query.status as TaskStatus) : undefined;
      const priority = typeof req.query.priority === 'string' ? (req.query.priority as TaskPriority) : undefined;

      const tasks = taskService.getAllTasks({ status, priority });

      res.status(200).json({
        success: true,
        data: tasks,
        message: `Retrieved ${tasks.length} task(s)`
      });
    } catch (error) {
      next(error);
    }
  };

  public getTaskById = (req: Request, res: Response<ApiResponse<Task>>, next: NextFunction): void => {
    try {
      const id = req.params.id as string;
      const task = taskService.getTaskById(id);

      if (!task) {
        throw new AppError(`Task with id '${id}' not found`, 404);
      }

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      next(error);
    }
  };

  public createTask = (req: Request, res: Response<ApiResponse<Task>>, next: NextFunction): void => {
    try {
      const task = taskService.createTask(req.body);

      res.status(201).json({
        success: true,
        data: task,
        message: 'Task created successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  public updateTask = (req: Request, res: Response<ApiResponse<Task>>, next: NextFunction): void => {
    try {
      const id = req.params.id as string;
      const updatedTask = taskService.updateTask(id, req.body);

      if (!updatedTask) {
        throw new AppError(`Task with id '${id}' not found`, 404);
      }

      res.status(200).json({
        success: true,
        data: updatedTask,
        message: 'Task updated successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteTask = (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
    try {
      const id = req.params.id as string;
      const deleted = taskService.deleteTask(id);

      if (!deleted) {
        throw new AppError(`Task with id '${id}' not found`, 404);
      }

      res.status(200).json({
        success: true,
        message: `Task with id '${id}' deleted successfully`
      });
    } catch (error) {
      next(error);
    }
  };
}

export const taskController = new TaskController();
