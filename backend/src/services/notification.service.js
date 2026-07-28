// src/services/notification.service.js
// Thin, reusable wrapper around the Notification model. Controllers
// call `notifyUser(...)` whenever a request/schedule/review/credit
// event happens instead of constructing Notification documents inline.

import Notification from '../models/Notification.js';
import ApiError from '../utils/ApiError.js';

/**
 * Creates a notification for a user.
 * @param {object} params
 * @param {string} params.userId - recipient
 * @param {string} params.type - one of Notification's `type` enum values
 * @param {string} params.title
 * @param {string} params.message
 * @param {string} [params.relatedModel] - 'SkillRequest'|'Schedule'|'Review'|'CreditTransaction'
 * @param {string} [params.relatedId]
 */
export const notifyUser = async ({
    userId,
    type,
    title,
    message,
    relatedModel = null,
    relatedId = null,
}) =>
    Notification.create({
        user: userId,
        type,
        title,
        message,
        relatedModel,
        relatedId,
    });

/**
 * Returns a paginated list of notifications for a user, most recent first.
 * @param {string} userId
 * @param {{page?: number, limit?: number, unreadOnly?: boolean}} options
 */
export const getUserNotifications = async (
    userId,
    { page = 1, limit = 20, unreadOnly = false } = {}
) => {
    const filter = { user: userId, ...(unreadOnly ? { isRead: false } : {}) };
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
        Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Notification.countDocuments(filter),
        Notification.countDocuments({ user: userId, isRead: false }),
    ]);

    return {
        notifications,
        unreadCount,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};

/**
 * Marks a single notification as read, scoped to its owner so one user
 * cannot mark another user's notification as read.
 * @param {string} notificationId
 * @param {string} userId
 */
export const markAsRead = async (notificationId, userId) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, user: userId },
        { isRead: true },
        { new: true }
    );

    if (!notification) {
        throw ApiError.notFound('Notification not found.');
    }

    return notification;
};

/**
 * Marks every unread notification for a user as read.
 * @param {string} userId
 */
export const markAllAsRead = async (userId) => {
    const result = await Notification.updateMany(
        { user: userId, isRead: false },
        { isRead: true }
    );
    return { modifiedCount: result.modifiedCount };
};

export default { notifyUser, getUserNotifications, markAsRead, markAllAsRead };