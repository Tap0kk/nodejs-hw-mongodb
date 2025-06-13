import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().trim().required(),
  phoneNumber: Joi.string().trim().required(),
  email: Joi.string().email().trim().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
  isFavourite: Joi.boolean().optional(),
  photo: Joi.any().optional(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().trim(),
  phoneNumber: Joi.string().trim(),
  email: Joi.string().email().trim(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
  isFavourite: Joi.boolean(),
  photo: Joi.any().optional(),
}).min(1);

export const sendResetEmailSchema = Joi.object({
  email: Joi.string().email().trim().required(),
});

export const resetPwdSchema = Joi.object({
  token: Joi.string().trim().required(),
  password: Joi.string().min(6).max(64).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'string.max': 'Password cannot exceed 64 characters',
  }),
});
