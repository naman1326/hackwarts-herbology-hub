// src/utils/jwt.js
// Centralized JWT helpers: signing, verifying, and setting the
// httpOnly auth cookie. Keeping this in one place means the token
// format/expiry/cookie options only need to change in one spot.

import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Signs a new JWT for the given user id.
 * @param {string} userId
 * @returns {string} signed JWT
 */
export const generateToken = (userId) =>
    jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

/**
 * Verifies a JWT and returns its decoded payload.
 * Throws (JsonWebTokenError / TokenExpiredError) on failure — callers
 * should let this bubble up to the centralized error handler, or catch
 * it explicitly (see middleware/auth.js).
 * @param {string} token
 */
export const verifyToken = (token) => jwt.verify(token, env.JWT_SECRET);

/**
 * Sets the JWT as an httpOnly cookie on the response and also returns
 * the token so it can be included in the JSON body for clients that
 * prefer Authorization-header-based auth (e.g. mobile apps, Postman).
 * @param {import('express').Response} res
 * @param {string} userId
 * @returns {string} the signed token
 */
export const attachAuthCookie = (res, userId) => {
    const token = generateToken(userId);

    const cookieOptions = {
        httpOnly: true,
        secure: env.IS_PROD,
        sameSite: env.IS_PROD ? 'none' : 'lax',
        expires: new Date(Date.now() + env.JWT_COOKIE_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000),
    };

    res.cookie('token', token, cookieOptions);
    return token;
};

/**
 * Clears the auth cookie (used on logout).
 * @param {import('express').Response} res
 */
export const clearAuthCookie = (res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: env.IS_PROD,
        sameSite: env.IS_PROD ? 'none' : 'lax',
        expires: new Date(0),
    });
};

export default { generateToken, verifyToken, attachAuthCookie, clearAuthCookie };