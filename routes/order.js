import { Router } from 'express';
const router = Router();

import { login, logout, register } from '../controllers/auth.js';

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

export default router;
