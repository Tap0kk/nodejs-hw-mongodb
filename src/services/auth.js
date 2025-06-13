 import bcrypt from 'bcryptjs'; 
import createHttpError from 'http-errors';
import User from '../models/user.js';
import Session from '../models/session.js';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import transporter from '../utils/email.js';
import { generateResetToken, verifyResetToken } from '../utils/tokenService.js';

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
  SMTP_FROM,
  JWT_SECRET,
  APP_DOMAIN,
} = process.env;

export const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw createHttpError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const login = async ({ email, password }, res) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  await Session.deleteMany({ userId: user._id });

  const accessToken = generateResetToken({ id: user._id });
  const refreshToken = generateResetToken({ id: user._id });

  const now = Date.now();
  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(now + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(now + 30 * 24 * 60 * 60 * 1000),
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  });

  return { accessToken };
};

export const refresh = async (refreshToken, res) => {
  if (!refreshToken) throw createHttpError(401, 'No refresh token provided');

  const session = await Session.findOne({ refreshToken });
  if (!session) throw createHttpError(403, 'Invalid refresh token');

  const user = await User.findById(session.userId);
  if (!user) throw createHttpError(404, 'User not found');

  await Session.deleteOne({ _id: session._id });

  const accessToken = generateResetToken({ id: user._id });
  const newRefreshToken = generateResetToken({ id: user._id });

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return { accessToken };
};

export const logout = async (refreshToken) => {
  if (!refreshToken) throw createHttpError(401, 'No refresh token provided');
  await Session.deleteOne({ refreshToken });
};

export const sendResetEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  );

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: 'Password Reset Request',
      text: `Click the following link to reset your password: ${resetLink}`,
      html: `
        <p>Hello ${user.name || 'User'},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 5 minutes.</p>
      `,
    });
  } catch (error) {
    console.error('❌ Email send error:', error);
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw createHttpError(403, 'Reset token has expired.');
    }
    throw createHttpError(400, 'Invalid reset token.');
  }
};
