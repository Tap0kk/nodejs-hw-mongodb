import { BadRequest } from 'http-errors';

export const validateBody = schema => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return next(new BadRequest(error.message));
  }
  next();
};
