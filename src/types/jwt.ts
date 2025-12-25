import jwt from 'jsonwebtoken';

export interface JwtUserPayload extends jwt.JwtPayload {
  userId: number;
  email: string;
}
