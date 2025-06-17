import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

export const createContactSchema = Joi.object({
  name: Joi.string().trim().required(),
  phoneNumber: Joi.string().trim().required(),
  email: Joi.string().email().trim().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
  parentId: Joi.string()
    .custom((value, helper) => {
      if (value && !isValidObjectId(value)) {
        return helper.message('Parent id should be a valid mongo id');
      }
      return value;
    })
    .optional(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().trim().optional(),
  phoneNumber: Joi.string().trim().optional(),
  email: Joi.string().email().trim().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').optional(),
}).min(1);