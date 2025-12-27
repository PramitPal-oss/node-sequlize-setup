import { authMiddleware } from '@middlewares/auth';
import { apiLimiter } from '@middlewares/rateLimit';
import { validate } from '@middlewares/validate';
import {
  createTodoController,
  deleteTodoController,
  getAllTodoController,
  updateTodoController,
} from 'controllers/TodoController';

import { Router } from 'express';
import { todoSchemaCreate, todoSchemaUpdate } from 'validator/TodoValidation';

const todoRoutes = Router();

todoRoutes.get('/read', apiLimiter, authMiddleware, getAllTodoController);

todoRoutes.post('/create', apiLimiter, authMiddleware, validate(todoSchemaCreate), createTodoController);

todoRoutes.patch('/update/:id', apiLimiter, authMiddleware, validate(todoSchemaUpdate), updateTodoController);

todoRoutes.delete('/delete/:id', apiLimiter, authMiddleware, deleteTodoController);

export default todoRoutes;
