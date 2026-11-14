import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { validateCreateTask, validateUpdateTask } from '../middleware/validateTask';

const router = Router();

// Retrieve all tasks
router.get('/', taskController.getAllTasks);

// Retrieve a single task by ID
router.get('/:id', taskController.getTaskById);

// Create a new task
router.post('/', validateCreateTask, taskController.createTask);

// Update an existing task
router.put('/:id', validateUpdateTask, taskController.updateTask);

// Delete a task
router.delete('/:id', taskController.deleteTask);

export default router;
