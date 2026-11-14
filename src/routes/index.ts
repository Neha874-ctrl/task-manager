import { Router } from 'express';
import healthRoutes from './health.routes';
import taskRoutes from './task.routes';

const router = Router();

// API Routes
router.use('/api/tasks', taskRoutes);
router.use('/health', healthRoutes);

export default router;
