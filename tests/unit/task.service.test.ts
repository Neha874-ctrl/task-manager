import { TaskService } from '../../src/services/task.service';

describe('TaskService (Unit Tests)', () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = new TaskService();
    taskService.clearAllTasks();
  });

  describe('createTask', () => {
    it('should create a task with default status and priority', () => {
      const task = taskService.createTask({
        title: 'Learn TypeScript'
      });

      expect(task).toBeDefined();
      expect(task.id).toBeDefined();
      expect(task.title).toBe('Learn TypeScript');
      expect(task.description).toBe('');
      expect(task.status).toBe('pending');
      expect(task.priority).toBe('medium');
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
    });

    it('should create a task with custom status, description, and priority', () => {
      const task = taskService.createTask({
        title: 'Deploy to Kubernetes',
        description: 'Prepare Helm charts and manifests',
        status: 'in-progress',
        priority: 'high'
      });

      expect(task.title).toBe('Deploy to Kubernetes');
      expect(task.description).toBe('Prepare Helm charts and manifests');
      expect(task.status).toBe('in-progress');
      expect(task.priority).toBe('high');
    });

    it('should trim title and description whitespace', () => {
      const task = taskService.createTask({
        title: '   Trimmed Title   ',
        description: '   Trimmed Description   '
      });

      expect(task.title).toBe('Trimmed Title');
      expect(task.description).toBe('Trimmed Description');
    });
  });

  describe('getAllTasks', () => {
    it('should return an empty array when no tasks exist', () => {
      const tasks = taskService.getAllTasks();
      expect(tasks).toEqual([]);
    });

    it('should return all created tasks', () => {
      taskService.createTask({ title: 'Task 1' });
      taskService.createTask({ title: 'Task 2' });

      const tasks = taskService.getAllTasks();
      expect(tasks).toHaveLength(2);
    });

    it('should filter tasks by status', () => {
      taskService.createTask({ title: 'Task 1', status: 'pending' });
      taskService.createTask({ title: 'Task 2', status: 'completed' });
      taskService.createTask({ title: 'Task 3', status: 'pending' });

      const pendingTasks = taskService.getAllTasks({ status: 'pending' });
      expect(pendingTasks).toHaveLength(2);
      expect(pendingTasks.every(t => t.status === 'pending')).toBe(true);

      const completedTasks = taskService.getAllTasks({ status: 'completed' });
      expect(completedTasks).toHaveLength(1);
      expect(completedTasks[0].title).toBe('Task 2');
    });

    it('should filter tasks by priority', () => {
      taskService.createTask({ title: 'Low Task', priority: 'low' });
      taskService.createTask({ title: 'High Task', priority: 'high' });

      const highTasks = taskService.getAllTasks({ priority: 'high' });
      expect(highTasks).toHaveLength(1);
      expect(highTasks[0].title).toBe('High Task');
    });
  });

  describe('getTaskById', () => {
    it('should return a task when valid id is provided', () => {
      const created = taskService.createTask({ title: 'Find Me' });
      const found = taskService.getTaskById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
      expect(found?.title).toBe('Find Me');
    });

    it('should return undefined when task does not exist', () => {
      const found = taskService.getTaskById('non-existent-id');
      expect(found).toBeUndefined();
    });
  });

  describe('updateTask', () => {
    it('should update task fields successfully', () => {
      const created = taskService.createTask({
        title: 'Original Title',
        description: 'Original Description',
        status: 'pending',
        priority: 'low'
      });

      const updated = taskService.updateTask(created.id, {
        title: 'Updated Title',
        status: 'completed',
        priority: 'high'
      });

      expect(updated).toBeDefined();
      expect(updated?.title).toBe('Updated Title');
      expect(updated?.description).toBe('Original Description');
      expect(updated?.status).toBe('completed');
      expect(updated?.priority).toBe('high');
      expect(new Date(updated!.updatedAt).getTime()).toBeGreaterThanOrEqual(new Date(created.createdAt).getTime());
    });

    it('should return undefined when updating non-existent task', () => {
      const updated = taskService.updateTask('non-existent-id', {
        title: 'New Title'
      });

      expect(updated).toBeUndefined();
    });
  });

  describe('deleteTask', () => {
    it('should delete task and return true', () => {
      const created = taskService.createTask({ title: 'Delete Me' });
      const result = taskService.deleteTask(created.id);

      expect(result).toBe(true);
      expect(taskService.getTaskById(created.id)).toBeUndefined();
    });

    it('should return false when deleting non-existent task', () => {
      const result = taskService.deleteTask('non-existent-id');
      expect(result).toBe(false);
    });
  });
});
