// src/routes/auth.routes.js
// Authentication + own-profile endpoints.

import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = Router();

const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('bio').optional().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
    body('skillsCanTeach').optional().isArray().withMessage('skillsCanTeach must be an array'),
    body('skillsWantToLearn')
        .optional()
        .isArray()
        .withMessage('skillsWantToLearn must be an array'),
];

const loginValidation = [
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
];

const updateProfileValidation = [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('bio').optional().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
    body('skillsCanTeach').optional().isArray().withMessage('skillsCanTeach must be an array'),
    body('skillsWantToLearn')
        .optional()
        .isArray()
        .withMessage('skillsWantToLearn must be an array'),
    body('availability').optional().isArray().withMessage('availability must be an array'),
];

router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.post('/logout', protect, authController.logout);
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, updateProfileValidation, validate, authController.updateProfile);

export default router;