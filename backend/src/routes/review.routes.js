// src/routes/review.routes.js

import { Router } from 'express';
import { body, param } from 'express-validator';
import * as reviewController from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = Router();

router.post(
    '/',
    protect,
    [
        body('scheduleId').isMongoId().withMessage('Valid scheduleId is required'),
        body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
        body('comment').optional().isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters'),
    ],
    validate,
    reviewController.createReview
);

router.get(
    '/:userId',
    [param('userId').isMongoId().withMessage('Invalid user id')],
    validate,
    reviewController.getReviewsForUser
);

export default router;