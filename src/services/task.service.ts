import { randomUUID } from 'crypto';
import { CreateTaskDTO, Task, TaskPriority, TaskStatus, UpdateTaskDTO } from '../types/task.types';

export class TaskService {
  private tasks: Map<string, Task> = new Map();

  constructor() {
    // Optionally seed initial demo tasks in development
    if (process.env.NODE_ENV !== 'test') {
      this.seedInitialTasks();
    }
  }

  private seedInitialTasks(): void {
    const initialTasks: CreateTaskDTO[] = [
      {
        title: 'Set up Jenkins Pipeline',
        description: 'Configure automated CI/CD pipeline with GitHub webhook triggers',
        status: 'in-progress',
        priority: 'high'
      },
      {
        title: 'Containerize Task Manager API',
        description: 'Create multi-stage Dockerfile using Alpine base image',
        status: 'completed',
        priority: 'high'
      },
      {
        title: 'Write Unit and Integration Tests',
        description: 'Achieve high test coverage using Jest and Supertest',
        status: 'pending',
        priority: 'medium'
      }
    ];

    for (const task of initialTasks) {
      this.createTask(task);
    }
  }

  /**
   * Retrieve all tasks with optional status and priority filtering
   */
  public getAllTasks(filter?: { status?: TaskStatus; priority?: TaskPriority }): Task[] {
    let list = Array.from(this.tasks.values());

    if (filter?.status) {
      list = list.filter(t => t.status === filter.status);
    }

    if (filter?.priority) {
      list = list.filter(t => t.priority === filter.priority);
    }

    // Sort descending by creation date
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Retrieve a single task by ID
   */
  public getTaskById(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  /**
   * Create a new task
   */
  public createTask(dto: CreateTaskDTO): Task {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: randomUUID(),
      title: dto.title.trim(),
      description: dto.description?.trim() || '',
      status: dto.status || 'pending',
      priority: dto.priority || 'medium',
      createdAt: now,
      updatedAt: now
    };

    this.tasks.set(newTask.id, newTask);
    return newTask;
  }

  /**
   * Update an existing task
   */
  public updateTask(id: string, dto: UpdateTaskDTO): Task | undefined {
    const existing = this.tasks.get(id);
    if (!existing) {
      return undefined;
    }

    const updatedTask: Task = {
      ...existing,
      ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
      ...(dto.description !== undefined ? { description: dto.description.trim() } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
      updatedAt: new Date().toISOString()
    };

    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  /**
   * Delete a task by ID
   */
  public deleteTask(id: string): boolean {
    return this.tasks.delete(id);
  }

  /**
   * Clear all tasks (used for testing resets)
   */
  public clearAllTasks(): void {
    this.tasks.clear();
  }
}

// Singleton instance for application runtime
export const taskService = new TaskService();
