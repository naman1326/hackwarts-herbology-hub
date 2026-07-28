// src/models/Schedule.js
// A booked session created once a SkillRequest is accepted. Tracks the
// session lifecycle from scheduled -> completed/cancelled, and is the
// anchor point that CreditTransaction and Review documents reference.

import mongoose from 'mongoose';

const { Schema } = mongoose;

const scheduleSchema = new Schema(
    {
        request: {
            type: Schema.Types.ObjectId,
            ref: 'SkillRequest',
            required: [true, 'Schedule must reference a request'],
            unique: true, // one schedule per accepted request
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        learner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        skill: {
            type: Schema.Types.ObjectId,
            ref: 'Skill',
            required: true,
        },
        scheduledAt: {
            type: Date,
            required: [true, 'Session date/time is required'],
        },
        durationMinutes: {
            type: Number,
            default: 60,
            min: [15, 'Session must be at least 15 minutes'],
            max: [480, 'Session cannot exceed 8 hours'],
        },
        mode: {
            type: String,
            enum: ['online', 'in-person'],
            default: 'online',
        },
        meetingDetails: {
            // A meeting link (online) or address (in-person)
            type: String,
            trim: true,
            default: '',
        },
        status: {
            type: String,
            enum: ['scheduled', 'completed', 'cancelled'],
            default: 'scheduled',
            index: true,
        },
        completedAt: {
            type: Date,
            default: null,
        },
        cancelledBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        cancelReason: {
            type: String,
            trim: true,
            maxlength: [300, 'Cancel reason cannot exceed 300 characters'],
            default: '',
        },
    },
    { timestamps: true }
);

scheduleSchema.index({ teacher: 1, status: 1 });
scheduleSchema.index({ learner: 1, status: 1 });
scheduleSchema.index({ scheduledAt: 1 });

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;