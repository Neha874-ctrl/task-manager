import request from 'supertest';
import app from '../../src/app';
import { taskService } from '../../src/services/task.service';

describe('Task REST API Integration Tests', () => {
  beforeEach(() => {
    taskService.clearAllTasks();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task with status 201', async () => {
      const payload = {
        title: 'Configure Jenkins Agent',
        description: 'Connect Ubuntu worker to Jenkins master',
        status: 'pending',
        priority: 'high'
      };

      const res = await request(app)
        .post('/api/tasks')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.title).toBe(payload.title);
      expect(res.body.data.description).toBe(payload.description);
      expect(res.body.data.status).toBe('pending');
      expect(res.body.data.priority).toBe('high');
    });

    it('should fail with status 400 when title is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          description: 'No title provided'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Validation failed');
      expect(res.body.errors).toContain("Field 'title' is required and must be a non-empty string.");
    });

    it('should fail with status 400 when title is blank', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: '   '
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toContain("Field 'title' is required and must be a non-empty string.");
    });

    it('should fail with status 400 when status is invalid', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Invalid Status Test',
          status: 'finished'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([expect.stringContaining("Field 'status' must be one of")])
      );
    });

    it('should fail with status 400 when priority is invalid', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Invalid Priority Test',
          priority: 'urgent'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([expect.stringContaining("Field 'priority' must be one of")])
      );
    });
  });

  describe('GET /api/tasks', () => {
    it('should return empty list when no tasks exist', async () => {
      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    it('should retrieve all tasks', async () => {
      taskService.createTask({ title: 'Task A' });
      taskService.createTask({ title: 'Task B' });

      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
    });

    it('should filter tasks by status query parameter', async () => {
      taskService.createTask({ title: 'Pending Task', status: 'pending' });
      taskService.createTask({ title: 'Completed Task', status: 'completed' });

      const res = await request(app).get('/api/tasks?status=completed');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe('Completed Task');
    });

    it('should filter tasks by priority query parameter', async () => {
      taskService.createTask({ title: 'Low Task', priority: 'low' });
      taskService.createTask({ title: 'High Task', priority: 'high' });

      const res = await request(app).get('/api/tasks?priority=high');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe('High Task');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should retrieve a task by ID', async () => {
      const created = taskService.createTask({
        title: 'Specific Task',
        description: 'Details here'
      });

      const res = await request(app).get(`/api/tasks/${created.id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(created.id);
      expect(res.body.data.title).toBe('Specific Task');
    });

    it('should return 404 if task is not found', async () => {
      const res = await request(app).get('/api/tasks/unknown-id-12345');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain("Task with id 'unknown-id-12345' not found");
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update an existing task', async () => {
      const created = taskService.createTask({
        title: 'Old Title',
        description: 'Old Description',
        status: 'pending'
      });

      const res = await request(app)
        .put(`/api/tasks/${created.id}`)
        .send({
          title: 'New Title',
          status: 'in-progress'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('New Title');
      expect(res.body.data.status).toBe('in-progress');
      expect(res.body.data.description).toBe('Old Description');
    });

    it('should return 404 when updating non-existent task', async () => {
      const res = await request(app)
        .put('/api/tasks/unknown-id')
        .send({ title: 'New Title' });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 when empty body is sent for update', async () => {
      const created = taskService.createTask({ title: 'Test Task' });

      const res = await request(app)
        .put(`/api/tasks/${created.id}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 when updating with invalid status', async () => {
      const created = taskService.createTask({ title: 'Test Task' });

      const res = await request(app)
        .put(`/api/tasks/${created.id}`)
        .send({ status: 'invalid-status' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete an existing task', async () => {
      const created = taskService.createTask({ title: 'To Be Deleted' });

      const res = await request(app).delete(`/api/tasks/${created.id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('deleted successfully');

      // Verify deletion
      const checkRes = await request(app).get(`/api/tasks/${created.id}`);
      expect(checkRes.status).toBe(404);
    });

    it('should return 404 when deleting a non-existent task', async () => {
      const res = await request(app).delete('/api/tasks/unknown-id');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('404 Route handling', () => {
    it('should return 404 for undefined routes', async () => {
      const res = await request(app).get('/api/invalid-route');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Resource not found');
    });
  });
});
