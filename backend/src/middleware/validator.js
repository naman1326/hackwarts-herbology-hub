// src/middleware/validator.js
// Generic express-validator result handler. Route files define their
// own validation chains (e.g. body('email').isEmail()) and place this
// `validate` middleware after them — it collects any errors and throws
// a single, consistently-shaped ApiError instead of every route
// needing to repeat this boilerplate.
//
// Example usage (in a routes file):
//   import { body } from 'express-validator';
//   import { validate } from '../middleware/validator.js';
//
//   router.post(
//     '/register',
//     [body('email').isEmail(), body('password').isLength({ min: 8 })],
//     validate,
//     authController.register
//   );

import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    const formattedErrors = errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
    }));

    throw ApiError.badRequest('Validation failed', formattedErrors);
};

export default validate;