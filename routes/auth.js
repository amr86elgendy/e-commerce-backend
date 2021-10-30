import { Router } from 'express';
const router = Router();

import { login, logout, me, register } from '../controllers/auth.js';

router.post('/register', register);
router.post('/login', login);
router.get('/me', me);
router.get('/logout', logout);

export default router;
