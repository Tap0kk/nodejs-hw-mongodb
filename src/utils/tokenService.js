import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';

const JWT_SECRET = getEnvVar('JWT_SECRET');
const RESET_TOKEN_EXPIRES_IN = '5m'; 

export function generateResetToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: RESET_TOKEN_EXPIRES_IN });
}

export function verifyResetToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

console.log('JWT_SECRET:', JWT_SECRET);