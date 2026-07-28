// src/routes/schedule.routes.js

import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as scheduleController from '../controllers/schedule.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = Router();

router.use(protect);

router.post(
    '/',
    [
        body('requestId').isMongoId().withMessage('Valid requestId is required'),
        body('scheduledAt').isISO8601().withMessage('scheduledAt must be a valid date/time'),
        body('durationMinutes').optional().isInt({ min: 15, max: 480 }),
        body('mode').optional().isIn(['online', 'in-person']),
        body('meetingDetails').optional().isLength({ max: 300 }),
    ],
    validate,
    scheduleController.createSchedule
);

router.get(
    '/',
    [query('status').optional().isIn(['scheduled', 'completed', 'cancelled'])],
    validate,
    scheduleController.getSchedules
);

router.patch(
    '/:id',
    [
        param('id').isMongoId().withMessage('Invalid schedule id'),
        body('status').optional().isIn(['cancelled']),
        body('cancelReason').optional().isLength({ max: 300 }),
        body('scheduledAt').optional().isISO8601(),
        body('durationMinutes').optional().isInt({ min: 15, max: 480 }),
        body('mode').optional().isIn(['online', 'in-person']),
        body('meetingDetails').optional().isLength({ max: 300 }),
    ],
    validate,
    scheduleController.updateSchedule
);

router.patch(
    '/:id/complete',
    [param('id').isMongoId().withMessage('Invalid schedule id')],
    validate,
    scheduleController.completeSchedule
);

export default router;