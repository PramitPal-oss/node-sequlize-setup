import { authLimiter } from '@middlewares/rateLimit';
import { validate } from '@middlewares/validate';
import { CreateUserController, forgotPasswordController, LoginUserController } from 'controller/UserController';
import { Router } from 'express';
import { forgotPasswordSchema, loginUserSchema, userSchemaCreate } from 'validator/UserValidation';

const authRoutes = Router();

authRoutes.post('/signIn', authLimiter, validate(userSchemaCreate), CreateUserController);
authRoutes.post('/login', authLimiter, validate(loginUserSchema), LoginUserController);
authRoutes.post('/forgotPassword', authLimiter, validate(forgotPasswordSchema), forgotPasswordController);

export default authRoutes;
