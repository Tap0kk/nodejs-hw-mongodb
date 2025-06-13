import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  sendResetEmail,
  resetPwd,
} from '../controllers/auth.js';
import upload from '../middlewares/upload.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validations/authValidation.js';
import {
  sendResetEmailSchema,
  resetPwdSchema,
} from '../schemas/contactSchemas.js';

import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/send-reset-email', validateBody(sendResetEmailSchema), sendResetEmail);
router.post('/reset-pwd', validateBody(resetPwdSchema), resetPwd);

export default router;
