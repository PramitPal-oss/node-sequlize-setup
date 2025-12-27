import { catchAsync } from '@utils/catchAsync';
import { Request, Response } from 'express';
import {
  ForgotpasswordInterface,
  LoginInterface,
  ResetPasswordInterface,
  UserInterface,
} from 'interface/authInterface';
import { createUserWithApps, forgotPassword, loginUser, logoutServie, resetPassword } from 'service/authService';

export const CreateUserController = catchAsync(async (req: Request, res: Response) => {
  const { first_name, last_name, email } = await createUserWithApps(req.body as UserInterface);

  res.status(201).json({
    success: true,
    data: { first_name, last_name, email },
    message: 'User created successfully',
  });
});

export const LoginUserController = catchAsync(async (req: Request, res: Response) => {
  const { username, password, app_ids } = req.body as LoginInterface;

  const { user, token } = await loginUser({ username, password, app_ids });
  const { first_name, last_name, email } = user;

  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  res.status(200).json({
    success: true,
    data: { first_name, last_name, email, token },
    message: 'User logged in successfully',
  });
});

export const forgotPasswordController = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body as ForgotpasswordInterface;
  await forgotPassword(email, req);

  res.status(200).json({
    success: true,
    message: 'Password reset link sent successfully',
  });
});

export const resetPasswordController = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body as ResetPasswordInterface;

  const { user, token: jwtToken } = await resetPassword(token, password);

  res.cookie('access_token', jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  res.status(200).json({
    message: 'Password reset successful',
    user,
  });
});

export const logoutController = catchAsync(async (req: Request, res: Response) => {
  await logoutServie({
    userId: req.user?.userId,
    logoutAll: true,
  });

  res.clearCookie('access_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({
    message: 'Logged out successfully',
  });
});
