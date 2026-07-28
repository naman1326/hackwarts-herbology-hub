// src/middleware/errorHandler.js
// Centralized error handler. Every thrown error (ApiError, Mongoose error,
// JWT error, or unexpected exception) funnels through here via
// `next(error)` or an async wrapper, and is turned into a consistent,
// sanitized JSON response — no raw stack traces leak to the client in
// production.

import ApiError from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

/**
 * Normalizes known third-party error types (Mongoose, JWT, Multer) into
 * our own ApiError so the response shape is always consistent.
 */
const normalizeError = (err) => {
    if (err instanceof ApiError) return err;

    // Mongoose bad ObjectId (CastError)
    if (err.name === 'CastError') {
        return ApiError.badRequest(`Invalid value for field '${err.path}': ${err.value}`);
    }

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }));
        return ApiError.badRequest('Validation failed', errors);
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0];
        return ApiError.conflict(
            field ? `An account or record with this ${field} already exists.` : 'Duplicate value.'
        );
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return ApiError.unauthorized('Invalid authentication token.');
    }
    if (err.name === 'TokenExpiredError') {
        return ApiError.unauthorized('Authentication token has expired.');
    }

    // Multer upload errors
    if (err.name === 'MulterError') {
        return ApiError.badRequest(`File upload error: ${err.message}`);
    }

    // Fallback: unknown error
    return ApiError.internal(env.IS_PROD ? 'Internal Server Error' : err.message);
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
    const error = normalizeError(err);

    if (error.statusCode >= 500) {
        logger.error(`${req.method} ${req.originalUrl} -> ${error.message}\n${err.stack || ''}`);
    } else {
        logger.warn(`${req.method} ${req.originalUrl} -> ${error.message}`);
    }

    return res.status(error.statusCode).json({
        success: false,
        statusCode: error.statusCode,
        message: error.message,
        errors: error.errors || [],
        ...(env.IS_PROD ? {} : { stack: err.stack }),
    });
};

/**
 * 404 handler for unmatched routes. Registered after all routes in app.js.
 */
export const notFoundHandler = (req, res, next) => {
    next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

/**
 * Wraps an async route/controller so rejected promises are automatically
 * forwarded to the error handler instead of requiring try/catch everywhere.
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default errorHandler;