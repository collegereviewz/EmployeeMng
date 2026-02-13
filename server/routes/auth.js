import express from 'express';
import { auth } from '../middleware/auth.js';
import { login, getCurrentUser, changePassword } from '../controllers/authController.js';

const router = express.Router();

// Login
router.post('/login', login);

// Get current user
router.get('/me', auth, getCurrentUser);
// Change own password
router.put('/me/password', auth, changePassword);

export default router;
