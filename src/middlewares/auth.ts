import { env } from '@config/env';
import { AppError } from '@utils/AppError';
import { catchAsync } from '@utils/catchAsync';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from 'models/user.model';
import { JwtUserPayload } from 'types/jwt';

export const authMiddleware = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.access_token || req.headers.authorization?.split(' ')[1];

  if (!token) return next(new AppError('Unauthorized!', 400, 'Unauthorized'));

  const decoded = jwt.verify(token, env.JWT_SECRET!) as JwtUserPayload;

  const user = await UserModel.scope('withPassword').findOne({
    where: {
      id: decoded.userId,
    },
  });

  if (!user) return next(new AppError('No user found!', 400, 'NoUserFound'));

  const isPasswordChanged = await user.checkjWtTime(decoded.iat!);

  if (isPasswordChanged)
    return next(new AppError('Password changed recently. Please log in again.', 401, 'PasswordChanged'));

  req.user = decoded; // { userId, email }

  next();
});
