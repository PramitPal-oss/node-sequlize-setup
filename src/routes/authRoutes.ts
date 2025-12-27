import { authMiddleware } from '@middlewares/auth';
import { authLimiter } from '@middlewares/rateLimit';
import { validate } from '@middlewares/validate';
import {
  CreateUserController,
  forgotPasswordController,
  LoginUserController,
  logoutController,
  resetPasswordController,
} from 'controllers/UserController';
import { Router } from 'express';
import { forgotPasswordSchema, loginUserSchema, resetPasswordSchema, userSchemaCreate } from 'validator/UserValidation';

const authRoutes = Router();

authRoutes.post('/signIn', authLimiter, validate(userSchemaCreate), CreateUserController);
authRoutes.post('/login', authLimiter, validate(loginUserSchema), LoginUserController);
authRoutes.post('/forgotPassword', authLimiter, validate(forgotPasswordSchema), forgotPasswordController);

authRoutes.post('/resetPassword/:token', authLimiter, validate(resetPasswordSchema), resetPasswordController);

authRoutes.post('./logout', authLimiter, authMiddleware, logoutController);

export default authRoutes;
