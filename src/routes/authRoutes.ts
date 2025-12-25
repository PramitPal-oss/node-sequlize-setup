import { authLimiter } from '@middlewares/rateLimit';
import { validate } from '@middlewares/validate';
import { CreateUserController, LoginUserController } from 'controller/UserController';
import { Router } from 'express';
import { loginUserSchema, userSchemaCreate } from 'validator/UserValidation';

const authRoutes = Router();

authRoutes.post('/signIn', authLimiter, validate(userSchemaCreate), CreateUserController);
authRoutes.post('/login', authLimiter, validate(loginUserSchema), LoginUserController);

export default authRoutes;
