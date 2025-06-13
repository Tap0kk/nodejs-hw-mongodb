import { verifyResetToken } from '../utils/tokenService.js';
import createHttpError from 'http-errors';
import User from '../models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    console.log('✅ Auth header:', authHeader);

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw createHttpError(401, 'Not authorized');
    }

    const decoded = verifyResetToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Auth error:', error);
    if (error.name === 'TokenExpiredError') {
      return next(createHttpError(401, 'Access token expired'));
    }
    return next(createHttpError(401, 'Not authorized'));
  }
};
