import { catchAsync } from '@utils/catchAsync';
import { Request, Response } from 'express';
import { LoginInterface, UserInterface } from 'interface/UserInterface';
import { createUserWithApps, loginUser } from 'service/UserService';

export const CreateUserController = catchAsync(async (req: Request, res: Response) => {
  const user = await createUserWithApps(req.body as UserInterface);

  res.status(201).json({
    success: true,
    data: user,
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
