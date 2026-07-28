// src/routes/credit.routes.js

import { Router } from 'express';
import { query } from 'express-validator';
import * as creditController from '../controllers/credit.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = Router();

router.use(protect);

router.get('/', creditController.getMyBalance);

router.get(
    '/history',
    [query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1, max: 100 })],
    validate,
    creditController.getMyHistory
);

export default router;