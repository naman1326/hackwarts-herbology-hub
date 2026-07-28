// src/controllers/leaderboard.controller.js
// Ranks users by a composite "contribution score" blending credits,
// completed sessions, average rating, and trust score, then returns
// the top 10. The composite score is computed in-app (not stored) so
// it always reflects the very latest stats.

import User from '../models/User.js';
import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../middleware/Errorhandler.js';

// Weights for the composite leaderboard score. Isolated here so the
// ranking can be rebalanced without touching the query/response logic.
const LEADERBOARD_WEIGHTS = {
    credits: 0.5, // rewards active participation in the credit economy
    completedSessions: 5, // rewards actually showing up and finishing sessions
    averageRating: 10, // rewards quality (0-5 scale, so up to 50 points)
    trustScore: 0.5, // rewards long-term reliability (0-100 scale)
};

const computeScore = (user) =>
    (user.credits || 0) * LEADERBOARD_WEIGHTS.credits +
    (user.completedSessions || 0) * LEADERBOARD_WEIGHTS.completedSessions +
    (user.averageRating || 0) * LEADERBOARD_WEIGHTS.averageRating +
    (user.trustScore || 0) * LEADERBOARD_WEIGHTS.trustScore;

/**
 * @route   GET /api/leaderboard
 * @access  Public
 * Returns the top 10 users ranked by contribution score.
 */
export const getLeaderboard = asyncHandler(async (req, res) => {
    // Pull a generous candidate pool sorted by the strongest individual
    // signals first, then compute the exact composite score and re-sort
    // in-memory — avoids needing a stored/denormalized score field.
    const candidates = await User.find({ isActive: true })
        .select('name profilePicture location credits completedSessions averageRating trustScore')
        .sort({ credits: -1, completedSessions: -1, averageRating: -1 })
        .limit(200);

    const ranked = candidates
        .map((user) => ({
            user,
            score: Math.round(computeScore(user) * 100) / 100,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((entry, index) => ({ rank: index + 1, ...entry }));

    return new ApiResponse(200, ranked, 'Leaderboard fetched successfully').send(res);
});

export default { getLeaderboard };