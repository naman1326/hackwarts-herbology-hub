// src/models/SkillRequest.js
// Represents a learner requesting a session with a teacher for a
// specific Skill listing. This is the "request-and-accept" flow —
// once accepted, a Schedule document is created that references it.

import mongoose from 'mongoose';

const { Schema } = mongoose;

const skillRequestSchema = new Schema(
    {
        learner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Learner is required'],
            index: true,
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Teacher is required'],
            index: true,
        },
        skill: {
            type: Schema.Types.ObjectId,
            ref: 'Skill',
            required: [true, 'Skill is required'],
        },
        message: {
            type: String,
            trim: true,
            maxlength: [500, 'Message cannot exceed 500 characters'],
            default: '',
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
            default: 'pending',
            index: true,
        },
        creditsOffered: {
            type: Number,
            required: true,
            min: [1, 'Credits offered must be at least 1'],
        },
        respondedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// Prevent a learner from spamming the same teacher/skill with duplicate
// pending requests.
skillRequestSchema.index(
    { learner: 1, skill: 1, status: 1 },
    { partialFilterExpression: { status: 'pending' } }
);

skillRequestSchema.index({ teacher: 1, status: 1 });

const SkillRequest = mongoose.model('SkillRequest', skillRequestSchema);

export default SkillRequest;