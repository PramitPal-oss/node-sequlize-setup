import { catchAsync } from '@utils/catchAsync';
import { sendEmail } from '@utils/email';
import { Request, Response } from 'express';
import { ForgotpasswordInterface, LoginInterface, UserInterface } from 'interface/authInterface';
import { createUserWithApps, forgotPassword, loginUser } from 'service/UserService';

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
  const resetToken = await forgotPassword(email);

  console.log(resetToken, 'Controller');

  const requestURL = `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${requestURL}.\nIf you didn't forget your password, please ignore this email!`;

  await sendEmail({ to: email, subject: 'Your password reset token (valid for 10 min)', text: message });

  res.status(200).json({
    success: true,
    message: 'Password reset link sent successfully',
  });
});
