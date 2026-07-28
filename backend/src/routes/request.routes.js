// src/routes/request.routes.js

import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as requestController from '../controllers/request.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = Router();

router.use(protect); // every request-related route requires authentication

router.post(
    '/',
    [
        body('skillId').isMongoId().withMessage('Valid skillId is required'),
        body('message').optional().isLength({ max: 500 }).withMessage('Message cannot exceed 500 characters'),
    ],
    validate,
    requestController.createRequest
);

router.get(
    '/',
    [
        query('role').optional().isIn(['teacher', 'learner']),
        query('status').optional().isIn(['pending', 'accepted', 'rejected', 'cancelled', 'completed']),
    ],
    validate,
    requestController.getRequests
);

router.patch(
    '/:id/accept',
    [param('id').isMongoId().withMessage('Invalid request id')],
    validate,
    requestController.acceptRequest
);

router.patch(
    '/:id/reject',
    [param('id').isMongoId().withMessage('Invalid request id')],
    validate,
    requestController.rejectRequest
);

router.patch(
    '/:id/cancel',
    [param('id').isMongoId().withMessage('Invalid request id')],
    validate,
    requestController.cancelRequest
);

export default router;