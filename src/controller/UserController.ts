import { catchAsync } from '@utils/catchAsync';
import { Request, Response } from 'express';
import { UserModel } from 'models';
import { createUserWithApps } from 'service/UserService';

export const CreateUserController = catchAsync(async (req: Request, res: Response) => {
  const user = await createUserWithApps(req.body as UserModel);

  res.status(201).json({
    success: true,
    data: user,
    message: 'User created successfully',
  });
});
