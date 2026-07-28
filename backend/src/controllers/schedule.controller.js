// src/controllers/schedule.controller.js
// Manages the lifecycle of a booked session, created from an accepted
// SkillRequest. Completing a schedule is the single trigger point for
// settling community credits (via credit.service.js) and updating both
// participants' reputation stats — everything else in the app treats a
// "completed session" as this exact moment.

import Schedule from '../models/Schedule.js';
import SkillRequest from '../models/SkillRequest.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../middleware/Errorhandler.js';
import { notifyUser } from '../services/notification.service.js';
import { settleSessionCredits } from '../services/credit.service.js';

const isParticipant = (schedule, userId) =>
    schedule.teacher.toString() === userId.toString() ||
    schedule.learner.toString() === userId.toString();

/**
 * @route   POST /api/schedules
 * @access  Private (either participant of the accepted request)
 * body: { requestId, scheduledAt, durationMinutes, mode, meetingDetails }
 */
export const createSchedule = asyncHandler(async (req, res) => {
    const { requestId, scheduledAt, durationMinutes, mode, meetingDetails } = req.body;

    const skillRequest = await SkillRequest.findById(requestId);
    if (!skillRequest) {
        throw ApiError.notFound('Request not found.');
    }

    if (!isParticipant(skillRequest, req.user._id)) {
        throw ApiError.forbidden('You are not a participant in this request.');
    }

    if (skillRequest.status !== 'accepted') {
        throw ApiError.badRequest('A session can only be scheduled for an accepted request.');
    }

    const existingSchedule = await Schedule.findOne({ request: requestId });
    if (existingSchedule) {
        throw ApiError.conflict('A schedule already exists for this request.');
    }

    if (new Date(scheduledAt).getTime() <= Date.now()) {
        throw ApiError.badRequest('Scheduled time must be in the future.');
    }

    const schedule = await Schedule.create({
        request: requestId,
        teacher: skillRequest.teacher,
        learner: skillRequest.learner,
        skill: skillRequest.skill,
        scheduledAt,
        durationMinutes,
        mode,
        meetingDetails,
    });

    const otherPartyId =
        req.user._id.toString() === skillRequest.teacher.toString()
            ? skillRequest.learner
            : skillRequest.teacher;

    await notifyUser({
        userId: otherPartyId,
        type: 'schedule_created',
        title: 'Session scheduled',
        message: `Your session has been scheduled for ${new Date(scheduledAt).toLocaleString()}.`,
        relatedModel: 'Schedule',
        relatedId: schedule._id,
    });

    return new ApiResponse(201, schedule, 'Session scheduled successfully').send(res);
});

/**
 * @route   GET /api/schedules
 * @access  Private
 * Query params: ?status=scheduled|completed|cancelled
 */
export const getSchedules = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const userId = req.user._id;

    const filter = { $or: [{ teacher: userId }, { learner: userId }] };
    if (status) filter.status = status;

    const schedules = await Schedule.find(filter)
        .populate('teacher', 'name profilePicture')
        .populate('learner', 'name profilePicture')
        .populate('skill', 'title category')
        .sort({ scheduledAt: 1 });

    return new ApiResponse(200, schedules, 'Schedules fetched successfully').send(res);
});

/**
 * @route   PATCH /api/schedules/:id
 * @access  Private (either participant)
 * Handles both rescheduling (scheduledAt/durationMinutes/mode/meetingDetails)
 * and cancellation (status: 'cancelled', cancelReason) in one endpoint,
 * since both are "update the schedule" operations on a still-pending session.
 */
export const updateSchedule = asyncHandler(async (req, res) => {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
        throw ApiError.notFound('Schedule not found.');
    }

    if (!isParticipant(schedule, req.user._id)) {
        throw ApiError.forbidden('You are not a participant in this schedule.');
    }

    if (schedule.status !== 'scheduled') {
        throw ApiError.badRequest(`Cannot modify a schedule with status "${schedule.status}".`);
    }

    const { status, cancelReason, scheduledAt, durationMinutes, mode, meetingDetails } = req.body;

    if (status === 'cancelled') {
        schedule.status = 'cancelled';
        schedule.cancelledBy = req.user._id;
        schedule.cancelReason = cancelReason || '';

        const otherPartyId =
            req.user._id.toString() === schedule.teacher.toString() ? schedule.learner : schedule.teacher;

        await schedule.save();

        await notifyUser({
            userId: otherPartyId,
            type: 'schedule_cancelled',
            title: 'Session cancelled',
            message: `Your scheduled session was cancelled${cancelReason ? `: ${cancelReason}` : '.'}`,
            relatedModel: 'Schedule',
            relatedId: schedule._id,
        });

        return new ApiResponse(200, schedule, 'Schedule cancelled successfully').send(res);
    }

    // Otherwise, treat this as a reschedule
    if (scheduledAt !== undefined) {
        if (new Date(scheduledAt).getTime() <= Date.now()) {
            throw ApiError.badRequest('Scheduled time must be in the future.');
        }
        schedule.scheduledAt = scheduledAt;
    }
    if (durationMinutes !== undefined) schedule.durationMinutes = durationMinutes;
    if (mode !== undefined) schedule.mode = mode;
    if (meetingDetails !== undefined) schedule.meetingDetails = meetingDetails;

    await schedule.save();

    const otherPartyId =
        req.user._id.toString() === schedule.teacher.toString() ? schedule.learner : schedule.teacher;

    await notifyUser({
        userId: otherPartyId,
        type: 'schedule_updated',
        title: 'Session updated',
        message: 'Your scheduled session details were updated.',
        relatedModel: 'Schedule',
        relatedId: schedule._id,
    });

    return new ApiResponse(200, schedule, 'Schedule updated successfully').send(res);
});

/**
 * @route   PATCH /api/schedules/:id/complete
 * @access  Private (either participant)
 * The single trigger point for settling community credits and bumping
 * both participants' completedSessions count.
 */
export const completeSchedule = asyncHandler(async (req, res) => {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
        throw ApiError.notFound('Schedule not found.');
    }

    if (!isParticipant(schedule, req.user._id)) {
        throw ApiError.forbidden('You are not a participant in this schedule.');
    }

    if (schedule.status !== 'scheduled') {
        throw ApiError.badRequest(`Cannot complete a schedule with status "${schedule.status}".`);
    }

    const skillRequest = await SkillRequest.findById(schedule.request);
    if (!skillRequest) {
        throw ApiError.notFound('The originating request for this schedule no longer exists.');
    }

    // Settle credits: learner -> teacher, atomically where possible.
    await settleSessionCredits({
        teacherId: schedule.teacher,
        learnerId: schedule.learner,
        amount: skillRequest.creditsOffered,
        scheduleId: schedule._id,
    });

    schedule.status = 'completed';
    schedule.completedAt = new Date();
    await schedule.save();

    skillRequest.status = 'completed';
    await skillRequest.save();

    await User.findByIdAndUpdate(schedule.teacher, { $inc: { completedSessions: 1 } });
    await User.findByIdAndUpdate(schedule.learner, { $inc: { completedSessions: 1 } });

    await Promise.all([
        notifyUser({
            userId: schedule.teacher,
            type: 'schedule_completed',
            title: 'Session completed',
            message: `You earned ${skillRequest.creditsOffered} credits for teaching this session.`,
            relatedModel: 'Schedule',
            relatedId: schedule._id,
        }),
        notifyUser({
            userId: schedule.learner,
            type: 'schedule_completed',
            title: 'Session completed',
            message: `${skillRequest.creditsOffered} credits were spent for this learning session. Consider leaving a review!`,
            relatedModel: 'Schedule',
            relatedId: schedule._id,
        }),
    ]);

    return new ApiResponse(200, schedule, 'Session marked as completed and credits settled').send(res);
});

export default { createSchedule, getSchedules, updateSchedule, completeSchedule };