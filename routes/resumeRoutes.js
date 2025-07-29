import express from 'express';
import {
    fetchResume,
    createResume,
    updateResume,
    fetchSingleResume,
    deleteResume,
    razerPayment
} from '../controllers/resumeController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/get-resume', authenticate, fetchResume);

router.get('/single', authenticate, fetchSingleResume);

router.post('/', authenticate, createResume);

router.put('/', authenticate, updateResume);

router.delete('/:id', authenticate, deleteResume);

router.post('/payment/razorpay', authenticate, razerPayment);

export default router;
