// src/middleware/auth.js
// `protect` verifies the JWT (from the httpOnly cookie or an
// Authorization: Bearer header) and attaches the authenticated user to
// req.user. `authorize` restricts a route to specific roles.

import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { asyncHandler } from './Errorhandler.js';

/**
 * Extracts the raw JWT from the request: prefers the httpOnly cookie,
 * falls back to the Authorization header for API clients that can't
 * use cookies (Postman, mobile apps).
 */
const extractToken = (req) => {
    if (req.cookies?.token) return req.cookies.token;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }

    return null;
};

/**
 * Protects a route: requires a valid JWT and an active user account.
 * Attaches the full user document (minus password) to req.user.
 */
export const protect = asyncHandler(async (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        throw ApiError.unauthorized('Not authenticated. Please log in.');
    }

    let decoded;
    try {
        decoded = verifyToken(token);
    } catch (error) {
        throw ApiError.unauthorized('Invalid or expired session. Please log in again.');
    }

    const user = await User.findById(decoded.id);

    if (!user) {
        throw ApiError.unauthorized('The user for this session no longer exists.');
    }

    if (!user.isActive) {
        throw ApiError.forbidden('This account has been deactivated.');
    }

    req.user = user;
    next();
});

/**
 * Restricts a route to the given roles. Must be used after `protect`.
 * Usage: router.delete('/:id', protect, authorize('admin'), handler)
 * @param {...string} roles
 */
export const authorize = (...roles) => (req, res, next) => {
    if (!req.user) {
        throw ApiError.unauthorized('Not authenticated.');
    }
    if (!roles.includes(req.user.role)) {
        throw ApiError.forbidden('You do not have permission to perform this action.');
    }
    next();
};

/**
 * Like `protect`, but does not throw if no token is present — useful
 * for routes that behave differently for logged-in vs anonymous users
 * without requiring auth. req.user will be null if not authenticated.
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
    const token = extractToken(req);
    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id);
        req.user = user && user.isActive ? user : null;
    } catch (error) {
        req.user = null;
    }

    next();
});

export default { protect, authorize, optionalAuth };