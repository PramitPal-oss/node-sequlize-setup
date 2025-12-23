import { authLimiter } from '@middlewares/rateLimit';
import { validate } from '@middlewares/validate';
import { CreateUserController } from 'controller/UserController';
import { Router } from 'express';
import { userSchemaCreate } from 'validator/UserValidation';

const authRoutes = Router();

authRoutes.post('/signIn', authLimiter, validate(userSchemaCreate), CreateUserController);

export default authRoutes;
