// src/routers/index.js

import { Router } from 'express';
import contactsRouter from './contacts.js';
import authRouter from './auth.js';

const router = Router();

router.use('/api/contacts', contactsRouter);
router.use('/api/auth', authRouter);

export default router;
