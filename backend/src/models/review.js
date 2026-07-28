// src/models/Review.js
// A review left by one participant of a completed Schedule about the
// other (learner -> teacher, or teacher -> learner). Ratings feed into
// the reviewee's averageRating / trustScore on the User model.

import mongoose from 'mongoose';

const { Schema } = mongoose;

const reviewSchema = new Schema(
    {
        schedule: {
            type: Schema.Types.ObjectId,
            ref: 'Schedule',
            required: [true, 'Review must reference a completed schedule'],
            index: true,
        },
        reviewer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        reviewee: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        direction: {
            // Who is reviewing whom, kept explicit for readability/reporting
            type: String,
            enum: ['learner_to_teacher', 'teacher_to_learner'],
            required: true,
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5'],
        },
        comment: {
            type: String,
            trim: true,
            maxlength: [1000, 'Comment cannot exceed 1000 characters'],
            default: '',
        },
    },
    { timestamps: true }
);

// A participant can only review a given schedule once.
reviewSchema.index({ schedule: 1, reviewer: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;