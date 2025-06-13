import * as authService from '../services/auth.js';
import createError from 'http-errors';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import transporter from '../utils/email.js'; 

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body, res);
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const result = await authService.refresh(refreshToken, res);
    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    await authService.logout(refreshToken);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    await authService.sendResetEmail(email);

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: null,
    });
  } catch (error) {
    console.error('Send reset email error:', error);
    next(error);
  }
};

export const resetPwd = async (req, res, next) => {
  const { token, password } = req.body;

  try {
    await authService.resetPassword(token, password);
    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
    });
  } catch (error) {
    next(error); 
  }
};
