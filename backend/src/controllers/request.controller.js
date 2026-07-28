// src/controllers/request.controller.js
// The request-and-accept flow: a learner requests a session with a
// teacher for a specific Skill listing; the teacher accepts, rejects,
// or the learner cancels. Accepting only flips status — the actual
// Schedule (date/time) is created afterward via schedule.controller.js,
// which references this request.

import mongoose from 'mongoose';
import SkillRequest from '../models/SkillRequest.js';
import Skill from '../models/Skill.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { notifyUser } from '../services/notification.service.js';
import { env } from '../config/env.js';

/**
 * @route   POST /api/requests
 * @access  Private
 * body: { skillId, message }
 * The teacher is derived from the skill's owner — the client only
 * needs to know which skill listing it's requesting a session for.
 */
export const createRequest = asyncHandler(async (req, res) => {
    const { skillId, message = '' } = req.body;

    const skill = await Skill.findOne({ _id: skillId, isActive: true });
    if (!skill) {
        throw ApiError.notFound('Skill listing not found.');
    }

    if (skill.type !== 'teach') {
        throw ApiError.badRequest('You can only request a session for a "teach" skill listing.');
    }

    const teacherId = skill.user;
    const learnerId = req.user._id;

    if (teacherId.toString() === learnerId.toString()) {
        throw ApiError.badRequest('You cannot request a session with yourself.');
    }

    const creditsOffered = env.CREDITS_PER_SESSION;

    if (req.user.credits < creditsOffered) {
        throw ApiError.badRequest(
            `You need at least ${creditsOffered} credits to request this session. Teach a skill to earn more.`
        );
    }

    // Prevent duplicate pending requests for the same skill by the same learner
    const existingPending = await SkillRequest.findOne({
        learner: learnerId,
        skill: skillId,
        status: 'pending',
    });
    if (existingPending) {
        throw ApiError.conflict('You already have a pending request for this skill.');
    }

    const skillRequest = await SkillRequest.create({
        learner: learnerId,
        teacher: teacherId,
        skill: skillId,
        message,
        creditsOffered,
    });

    await notifyUser({
        userId: teacherId,
        type: 'request_received',
        title: 'New session request',
        message: `${req.user.name} wants to learn "${skill.title}" from you.`,
        relatedModel: 'SkillRequest',
        relatedId: skillRequest._id,
    });

    return new ApiResponse(201, skillRequest, 'Request sent successfully').send(res);
});

/**
 * @route   GET /api/requests
 * @access  Private
 * Query params:
 *   ?role=teacher|learner   (defaults to both — any request involving the user)
 *   ?status=pending|accepted|rejected|cancelled|completed
 */
export const getRequests = asyncHandler(async (req, res) => {
    const { role, status } = req.query;
    const userId = req.user._id;

    const filter = {};
    if (role === 'teacher') filter.teacher = userId;
    else if (role === 'learner') filter.learner = userId;
    else filter.$or = [{ teacher: userId }, { learner: userId }];

    if (status) filter.status = status;

    const requests = await SkillRequest.find(filter)
        .populate('learner', 'name profilePicture averageRating')
        .populate('teacher', 'name profilePicture averageRating')
        .populate('skill', 'title category type')
        .sort({ createdAt: -1 });

    return new ApiResponse(200, requests, 'Requests fetched successfully').send(res);
});

/**
 * Shared loader + ownership guard for the accept/reject/cancel actions.
 */
const loadRequestForActor = async (requestId) => {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
        throw ApiError.badRequest('Invalid request id.');
    }
    const skillRequest = await SkillRequest.findById(requestId).populate('skill', 'title');
    if (!skillRequest) {
        throw ApiError.notFound('Request not found.');
    }
    return skillRequest;
};

/**
 * @route   PATCH /api/requests/:id/accept
 * @access  Private (teacher only)
 */
export const acceptRequest = asyncHandler(async (req, res) => {
    const skillRequest = await loadRequestForActor(req.params.id);

    if (skillRequest.teacher.toString() !== req.user._id.toString()) {
        throw ApiError.forbidden('Only the teacher can accept this request.');
    }
    if (skillRequest.status !== 'pending') {
        throw ApiError.badRequest(`Cannot accept a request with status "${skillRequest.status}".`);
    }

    skillRequest.status = 'accepted';
    skillRequest.respondedAt = new Date();
    await skillRequest.save();

    await notifyUser({
        userId: skillRequest.learner,
        type: 'request_accepted',
        title: 'Request accepted',
        message: `Your request for "${skillRequest.skill.title}" was accepted. Time to schedule a session!`,
        relatedModel: 'SkillRequest',
        relatedId: skillRequest._id,
    });

    return new ApiResponse(200, skillRequest, 'Request accepted successfully').send(res);
});

/**
 * @route   PATCH /api/requests/:id/reject
 * @access  Private (teacher only)
 */
export const rejectRequest = asyncHandler(async (req, res) => {
    const skillRequest = await loadRequestForActor(req.params.id);

    if (skillRequest.teacher.toString() !== req.user._id.toString()) {
        throw ApiError.forbidden('Only the teacher can reject this request.');
    }
    if (skillRequest.status !== 'pending') {
        throw ApiError.badRequest(`Cannot reject a request with status "${skillRequest.status}".`);
    }

    skillRequest.status = 'rejected';
    skillRequest.respondedAt = new Date();
    await skillRequest.save();

    await notifyUser({
        userId: skillRequest.learner,
        type: 'request_rejected',
        title: 'Request declined',
        message: `Your request for "${skillRequest.skill.title}" was declined.`,
        relatedModel: 'SkillRequest',
        relatedId: skillRequest._id,
    });

    return new ApiResponse(200, skillRequest, 'Request rejected successfully').send(res);
});

/**
 * @route   PATCH /api/requests/:id/cancel
 * @access  Private (learner only)
 * A learner can cancel their own request as long as no Schedule has
 * moved it to "completed" yet.
 */
export const cancelRequest = asyncHandler(async (req, res) => {
    const skillRequest = await loadRequestForActor(req.params.id);

    if (skillRequest.learner.toString() !== req.user._id.toString()) {
        throw ApiError.forbidden('Only the learner who made this request can cancel it.');
    }
    if (!['pending', 'accepted'].includes(skillRequest.status)) {
        throw ApiError.badRequest(`Cannot cancel a request with status "${skillRequest.status}".`);
    }

    skillRequest.status = 'cancelled';
    skillRequest.respondedAt = new Date();
    await skillRequest.save();

    await notifyUser({
        userId: skillRequest.teacher,
        type: 'request_cancelled',
        title: 'Request cancelled',
        message: `A request for "${skillRequest.skill.title}" was cancelled by the learner.`,
        relatedModel: 'SkillRequest',
        relatedId: skillRequest._id,
    });

    return new ApiResponse(200, skillRequest, 'Request cancelled successfully').send(res);
});

export default { createRequest, getRequests, acceptRequest, rejectRequest, cancelRequest };