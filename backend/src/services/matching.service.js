// src/services/matching.service.js
// The "smart match feed" engine. Reusable and framework-agnostic — it
// takes a userId and returns a ranked list of candidate users, scored
// by skill overlap, location proximity, and reputation. Kept separate
// from match.controller.js so the scoring logic can be unit-tested or
// reused (e.g. from a future notification job) without an HTTP layer.

import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

// Tunable scoring weights — isolated here so the algorithm can be
// rebalanced in one place without touching the traversal logic below.
const WEIGHTS = {
    THEY_CAN_TEACH_YOU: 10, // per matched tag
    THEY_WANT_TO_LEARN_FROM_YOU: 8, // per matched tag
    SAME_CITY: 15,
    NEARBY_DISTANCE: 10, // scaled by proximity, see scoreDistanceKm()
    RATING: 4, // multiplied by averageRating (0-5)
    TRUST: 0.05, // multiplied by trustScore (0-100)
};

const NEARBY_RADIUS_KM = 50;

/**
 * Haversine distance between two [lng, lat] points, in kilometers.
 */
const distanceKm = ([lng1, lat1], [lng2, lat2]) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/**
 * Converts a raw distance into a score that decays linearly to 0 at
 * NEARBY_RADIUS_KM and beyond.
 */
const scoreDistanceKm = (km) => {
    if (km >= NEARBY_RADIUS_KM) return 0;
    return WEIGHTS.NEARBY_DISTANCE * (1 - km / NEARBY_RADIUS_KM);
};

const intersection = (arrA = [], arrB = []) => {
    const setB = new Set(arrB);
    return arrA.filter((item) => setB.has(item));
};

/**
 * Scores a single candidate against the requesting user.
 * @returns {{score: number, matchedTeachTags: string[], matchedLearnTags: string[], distanceKm: number|null}}
 */
const scoreCandidate = (user, candidate) => {
    // Tags the candidate can teach that the user wants to learn
    const matchedTeachTags = intersection(candidate.skillsCanTeach, user.skillsWantToLearn);
    // Tags the candidate wants to learn that the user can teach
    const matchedLearnTags = intersection(candidate.skillsWantToLearn, user.skillsCanTeach);

    let score = 0;
    score += matchedTeachTags.length * WEIGHTS.THEY_CAN_TEACH_YOU;
    score += matchedLearnTags.length * WEIGHTS.THEY_WANT_TO_LEARN_FROM_YOU;

    let distance = null;
    const userCoords = user.location?.coordinates?.coordinates;
    const candidateCoords = candidate.location?.coordinates?.coordinates;
    const hasCoords = (c) => Array.isArray(c) && (c[0] !== 0 || c[1] !== 0);

    if (
        user.location?.city &&
        candidate.location?.city &&
        user.location.city.toLowerCase() === candidate.location.city.toLowerCase()
    ) {
        score += WEIGHTS.SAME_CITY;
    } else if (hasCoords(userCoords) && hasCoords(candidateCoords)) {
        distance = distanceKm(userCoords, candidateCoords);
        score += scoreDistanceKm(distance);
    }

    score += (candidate.averageRating || 0) * WEIGHTS.RATING;
    score += (candidate.trustScore || 0) * WEIGHTS.TRUST;

    return { score, matchedTeachTags, matchedLearnTags, distanceKm: distance };
};

/**
 * Finds and ranks potential matches for a user based on skills,
 * location, and reputation. Only candidates who share at least one
 * relevant tag (teach<->learn overlap in either direction) are
 * returned — this is a "smart match feed", not a generic directory.
 *
 * @param {string} userId
 * @param {{limit?: number}} options
 * @returns {Promise<Array>} ranked match objects
 */
export const findMatchesForUser = async (userId, { limit = 20 } = {}) => {
    const user = await User.findById(userId);
    if (!user) {
        throw ApiError.notFound('User not found');
    }

    const relevantTags = [...user.skillsWantToLearn, ...user.skillsCanTeach];

    if (relevantTags.length === 0) {
        return []; // nothing to match on yet — user hasn't set up their skills
    }

    const candidates = await User.find({
        _id: { $ne: user._id },
        isActive: true,
        $or: [
            { skillsCanTeach: { $in: user.skillsWantToLearn } },
            { skillsWantToLearn: { $in: user.skillsCanTeach } },
        ],
    }).select(
        'name profilePicture bio location skillsCanTeach skillsWantToLearn availability averageRating trustScore completedSessions'
    );

    const ranked = candidates
        .map((candidate) => {
            const { score, matchedTeachTags, matchedLearnTags, distanceKm: dKm } = scoreCandidate(
                user,
                candidate
            );
            return {
                user: candidate,
                score: Math.round(score * 100) / 100,
                matchedTeachTags, // what THEY can teach that YOU want to learn
                matchedLearnTags, // what THEY want to learn that YOU can teach
                distanceKm: dKm !== null ? Math.round(dKm * 10) / 10 : null,
            };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    return ranked;
};

export default { findMatchesForUser };