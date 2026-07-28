// src/routes/match.routes.js

import { Router } from 'express';
import { query } from 'express-validator';
import * as matchController from '../controllers/match.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = Router();

router.get(
    '/',
    protect,
    [query('limit').optional().isInt({ min: 1, max: 50 })],
    validate,
    matchController.getMatches
);

export default router;