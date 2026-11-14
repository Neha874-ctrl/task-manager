import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import routes from './routes';

const app: Application = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Base info endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the Node.js Task Manager REST API',
    documentation: '/api/tasks',
    health: '/health'
  });
});

// Mount Routes
app.use(routes);

// 404 Handler for undefined routes
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

export default app;
