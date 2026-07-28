// src/controllers/review.controller.js
// Post-session reviews. Only participants of a COMPLETED schedule can
// review each other, and only once each (enforced by the model's
// unique compound index). Every new review recomputes the reviewee's
// averageRating and reviewsReceived, and nudges their trustScore.

import Schedule from '../models/Schedule.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../middleware/Errorhandler.js';
import { notifyUser } from '../services/notification.service.js';

/**
 * Recomputes a user's averageRating + reviewsReceived from the Review
 * collection, and nudges trustScore based on the new review's rating.
 * A 5-star review nudges trust up, a 1-star review nudges it down —
 * kept as a small, bounded adjustment so no single review can swing
 * trust too dramatically.
 */
const applyReviewToReviewee = async (revieweeId, rating) => {
    const stats = await Review.aggregate([
        { $match: { reviewee: revieweeId } },
        { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    const { avgRating = 0, count = 0 } = stats[0] || {};

    const user = await User.findById(revieweeId);
    if (!user) return;

    const trustAdjustment = (rating - 3) * 2; // -4 .. +4 per review
    user.averageRating = Math.round(avgRating * 10) / 10;
    user.reviewsReceived = count;
    user.trustScore = Math.min(100, Math.max(0, user.trustScore + trustAdjustment));

    await user.save();
};

/**
 * @route   POST /api/reviews
 * @access  Private (participant of a completed schedule)
 * body: { scheduleId, rating, comment }
 */
export const createReview = asyncHandler(async (req, res) => {
    const { scheduleId, rating, comment = '' } = req.body;

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
        throw ApiError.notFound('Schedule not found.');
    }

    if (schedule.status !== 'completed') {
        throw ApiError.badRequest('You can only review a completed session.');
    }

    const reviewerId = req.user._id.toString();
    const isTeacher = schedule.teacher.toString() === reviewerId;
    const isLearner = schedule.learner.toString() === reviewerId;

    if (!isTeacher && !isLearner) {
        throw ApiError.forbidden('You were not a participant in this session.');
    }

    const revieweeId = isTeacher ? schedule.learner : schedule.teacher;
    const direction = isTeacher ? 'teacher_to_learner' : 'learner_to_teacher';

    const alreadyReviewed = await Review.findOne({ schedule: scheduleId, reviewer: reviewerId });
    if (alreadyReviewed) {
        throw ApiError.conflict('You have already reviewed this session.');
    }

    const review = await Review.create({
        schedule: scheduleId,
        reviewer: reviewerId,
        reviewee: revieweeId,
        direction,
        rating,
        comment,
    });

    await applyReviewToReviewee(revieweeId, rating);

    await notifyUser({
        userId: revieweeId,
        type: 'review_received',
        title: 'New review received',
        message: `You received a ${rating}-star review.`,
        relatedModel: 'Review',
        relatedId: review._id,
    });

    return new ApiResponse(201, review, 'Review submitted successfully').send(res);
});

/**
 * @route   GET /api/reviews/:userId
 * @access  Public
 * Returns all reviews received by a given user, most recent first.
 */
export const getReviewsForUser = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ reviewee: req.params.userId })
        .populate('reviewer', 'name profilePicture')
        .populate('schedule', 'scheduledAt skill')
        .sort({ createdAt: -1 });

    return new ApiResponse(200, reviews, 'Reviews fetched successfully').send(res);
});

export default { createReview, getReviewsForUser };