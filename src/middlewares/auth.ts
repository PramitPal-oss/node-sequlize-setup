import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.access_token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    console.log(decoded);

    req.user = decoded; // { userId, email }

    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
