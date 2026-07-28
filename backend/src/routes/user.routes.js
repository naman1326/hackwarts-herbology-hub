// src/routes/user.routes.js

import { Router } from 'express';
import { param } from 'express-validator';
import * as userController from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.put(
    '/profile/picture',
    protect,
    upload.single('profilePicture'),
    userController.uploadProfilePicture
);

router.get(
    '/:id',
    [param('id').isMongoId().withMessage('Invalid user id')],
    validate,
    userController.getUserById
);

export default router;