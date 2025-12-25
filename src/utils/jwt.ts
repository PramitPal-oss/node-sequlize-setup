import { env } from '@config/env';
import jwt from 'jsonwebtoken';

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRES_IN = env.EXPIRATION_TIME;

if (!JWT_SECRET || !JWT_EXPIRES_IN) {
  throw new Error('JWT_SECRET and EXPIRATION_TIME must be defined in environment variables');
}

export const generateToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: Number(JWT_EXPIRES_IN),
  });
};
