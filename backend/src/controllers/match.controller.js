// src/controllers/match.controller.js
// Thin HTTP layer over matching.service.js — all scoring logic lives
// in the service so it stays reusable and testable independently of
// Express.

import { findMatchesForUser } from '../services/matching.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../middleware/Errorhandler.js';

/**
 * @route   GET /api/matches
 * @access  Private
 * Query params:
 *   ?limit=20   (max number of ranked matches to return)
 */
export const getMatches = asyncHandler(async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 20;

    const matches = await findMatchesForUser(req.user._id, { limit });

    return new ApiResponse(
        200,
        { matches, count: matches.length },
        matches.length > 0
            ? 'Matches fetched successfully'
            : 'No matches yet — add skills you can teach or want to learn to get matched'
    ).send(res);
});

export default { getMatches };