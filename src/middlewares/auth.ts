import { env } from '@config/env';
import { AppError } from '@utils/AppError';
import { catchAsync } from '@utils/catchAsync';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from 'models/user.model';
import { JwtUserPayload } from 'types/jwt';

export const authMiddleware = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

  const token = req.cookies?.access_token || bearerToken;

  if (!token) return next(new AppError('No Token Found!', 401, 'Unauthorized'));

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
