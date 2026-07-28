// src/models/Notification.js
// In-app notifications for request/schedule/review/credit events.
// Uses a generic refPath relationship so a single collection can point
// to whichever entity triggered it (SkillRequest, Schedule, Review,
// CreditTransaction) without needing a separate model per event type.

import mongoose from 'mongoose';

const { Schema } = mongoose;

const notificationSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Notification must have a recipient'],
            index: true,
        },
        type: {
            type: String,
            enum: [
                'request_received',
                'request_accepted',
                'request_rejected',
                'request_cancelled',
                'schedule_created',
                'schedule_updated',
                'schedule_cancelled',
                'schedule_completed',
                'review_received',
                'credit_earned',
                'credit_spent',
            ],
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 300,
        },
        relatedModel: {
            type: String,
            enum: ['SkillRequest', 'Schedule', 'Review', 'CreditTransaction'],
            default: null,
        },
        relatedId: {
            type: Schema.Types.ObjectId,
            refPath: 'relatedModel',
            default: null,
        },
        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    { timestamps: true }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;