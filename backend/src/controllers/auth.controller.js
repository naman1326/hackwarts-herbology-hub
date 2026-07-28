// src/controllers/auth.controller.js
// Handles registration, login, logout, and the authenticated user's own
// profile (view + update). Password hashing happens in the User model's
// pre-save hook; this controller is only responsible for orchestration.

import User from '../models/User.js';
import CreditTransaction from '../models/CreditTransaction.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../middleware/Errorhandler.js';
import { attachAuthCookie, clearAuthCookie } from '../utils/jwt.js';

/**
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
    const { name, email, password, bio, location, skillsCanTeach, skillsWantToLearn, availability } =
        req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        throw ApiError.conflict('An account with this email already exists.');
    }

    const user = await User.create({
        name,
        email,
        password,
        bio,
        location,
        skillsCanTeach,
        skillsWantToLearn,
        availability,
    });

    // Log the starting balance as an auditable ledger entry (the balance
    // itself is already set via the User schema's default STARTING_CREDITS).
    await CreditTransaction.create({
        user: user._id,
        type: 'credit',
        amount: user.credits,
        reason: 'signup_bonus',
        balanceAfter: user.credits,
        description: 'Welcome bonus for joining the community',
    });

    const token = attachAuthCookie(res, user._id);

    return new ApiResponse(201, { user, token }, 'Account created successfully').send(res);
});

/**
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    // Deliberately generic error message for both "no such user" and
    // "wrong password" — avoids leaking which emails are registered.
    if (!user || !(await user.comparePassword(password))) {
        throw ApiError.unauthorized('Invalid email or password.');
    }

    if (!user.isActive) {
        throw ApiError.forbidden('This account has been deactivated.');
    }

    const token = attachAuthCookie(res, user._id);
    user.password = undefined;

    return new ApiResponse(200, { user, token }, 'Logged in successfully').send(res);
});

/**
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
    clearAuthCookie(res);
    return new ApiResponse(200, null, 'Logged out successfully').send(res);
});

/**
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getProfile = asyncHandler(async (req, res) => {
    // req.user is attached by the `protect` middleware
    return new ApiResponse(200, req.user, 'Profile fetched successfully').send(res);
});

/**
 * @route   PUT /api/auth/profile
 * @access  Private
 *
 * Only allows editing profile-shaped fields. Email, password, credits,
 * trustScore, and role are intentionally excluded — those go through
 * their own dedicated (and more carefully guarded) flows.
 */
export const updateProfile = asyncHandler(async (req, res) => {
    const ALLOWED_FIELDS = [
        'name',
        'bio',
        'location',
        'skillsCanTeach',
        'skillsWantToLearn',
        'availability',
    ];

    const updates = {};
    ALLOWED_FIELDS.forEach((field) => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    if (Object.keys(updates).length === 0) {
        throw ApiError.badRequest('No valid fields provided to update.');
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true,
    });

    return new ApiResponse(200, user, 'Profile updated successfully').send(res);
});

export default { register, login, logout, getProfile, updateProfile };