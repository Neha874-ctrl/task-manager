import { Router } from 'express';
import { getHealth } from '../controllers/health.controller';

const router = Router();

// Health check endpoint
router.get('/', getHealth);

export default router;
