
import express from 'express';
import { loginUser, registerUser, googleLogin, getUser } from '../controllers/authController.js';

const router = express.Router();

// Local Auth
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/get-user', getUser);

// Google Auth
router.post('/google', googleLogin);

export default router;
