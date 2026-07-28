// src/services/credit.service.js
// All community-credit balance mutations MUST go through this service —
// controllers never touch user.credits directly. This guarantees every
// change is (a) logged as a CreditTransaction and (b) impossible to
// push into a negative balance.

import mongoose from 'mongoose';
import User from '../models/User.js';
import CreditTransaction from '../models/CreditTransaction.js';
import ApiError from '../utils/ApiError.js';

/**
 * Adds credits to a user's balance (e.g. for teaching a completed
 * session, a signup bonus, or an admin adjustment/refund) and logs the
 * transaction.
 *
 * @param {object} params
 * @param {string} params.userId
 * @param {number} params.amount - positive integer
 * @param {'session_teaching'|'signup_bonus'|'admin_adjustment'|'refund'} params.reason
 * @param {string} [params.relatedSchedule]
 * @param {string} [params.description]
 * @returns {Promise<{user: object, transaction: object}>}
 */
export const awardCredits = async ({
    userId,
    amount,
    reason,
    relatedSchedule = null,
    description = '',
}) => {
    if (amount <= 0) {
        throw ApiError.badRequest('Credit amount must be greater than zero.');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw ApiError.notFound('User not found.');
    }

    user.credits += amount;
    await user.save();

    const transaction = await CreditTransaction.create({
        user: user._id,
        type: 'credit',
        amount,
        reason,
        relatedSchedule,
        balanceAfter: user.credits,
        description,
    });

    return { user, transaction };
};

/**
 * Deducts credits from a user's balance (e.g. for spending on a
 * learning session). Throws if the deduction would push the balance
 * below zero — this is the single enforcement point for "no negative
 * balances" across the whole app.
 *
 * @param {object} params
 * @param {string} params.userId
 * @param {number} params.amount - positive integer
 * @param {'session_learning'|'admin_adjustment'} params.reason
 * @param {string} [params.relatedSchedule]
 * @param {string} [params.description]
 * @returns {Promise<{user: object, transaction: object}>}
 */
export const deductCredits = async ({
    userId,
    amount,
    reason,
    relatedSchedule = null,
    description = '',
}) => {
    if (amount <= 0) {
        throw ApiError.badRequest('Debit amount must be greater than zero.');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw ApiError.notFound('User not found.');
    }

    if (user.credits < amount) {
        throw ApiError.badRequest(
            `Insufficient credits. Balance: ${user.credits}, required: ${amount}.`
        );
    }

    user.credits -= amount;
    await user.save();

    const transaction = await CreditTransaction.create({
        user: user._id,
        type: 'debit',
        amount,
        reason,
        relatedSchedule,
        balanceAfter: user.credits,
        description,
    });

    return { user, transaction };
};

/**
 * Convenience wrapper for a completed session: moves `amount` credits
 * from the learner to the teacher as two linked ledger entries. Uses a
 * Mongo transaction when the connection supports it (replica set),
 * and falls back to sequential writes otherwise (e.g. local standalone
 * MongoDB during hackathon development).
 *
 * @param {object} params
 * @param {string} params.teacherId
 * @param {string} params.learnerId
 * @param {number} params.amount
 * @param {string} params.scheduleId
 */
export const settleSessionCredits = async ({ teacherId, learnerId, amount, scheduleId }) => {
    const session = await mongoose.startSession();
    let result;

    try {
        await session.withTransaction(async () => {
            const learner = await User.findById(learnerId).session(session);
            if (!learner) throw ApiError.notFound('Learner not found.');
            if (learner.credits < amount) {
                throw ApiError.badRequest('Learner has insufficient credits to complete this session.');
            }

            const teacher = await User.findById(teacherId).session(session);
            if (!teacher) throw ApiError.notFound('Teacher not found.');

            learner.credits -= amount;
            teacher.credits += amount;

            await learner.save({ session });
            await teacher.save({ session });

            const [debitTx] = await CreditTransaction.create(
                [
                    {
                        user: learner._id,
                        type: 'debit',
                        amount,
                        reason: 'session_learning',
                        relatedSchedule: scheduleId,
                        balanceAfter: learner.credits,
                        description: 'Credits spent for a completed learning session',
                    },
                ],
                { session }
            );

            const [creditTx] = await CreditTransaction.create(
                [
                    {
                        user: teacher._id,
                        type: 'credit',
                        amount,
                        reason: 'session_teaching',
                        relatedSchedule: scheduleId,
                        balanceAfter: teacher.credits,
                        description: 'Credits earned for a completed teaching session',
                    },
                ],
                { session }
            );

            result = { learner, teacher, debitTx, creditTx };
        });
    } catch (error) {
        // Standalone MongoDB (no replica set) does not support transactions.
        // Fall back to sequential, non-atomic writes so local hackathon dev
        // still works — production should run MongoDB as a replica set.
        if (error.message?.includes('Transaction numbers') || error.codeName === 'IllegalOperation') {
            const debit = await deductCredits({
                userId: learnerId,
                amount,
                reason: 'session_learning',
                relatedSchedule: scheduleId,
                description: 'Credits spent for a completed learning session',
            });
            const credit = await awardCredits({
                userId: teacherId,
                amount,
                reason: 'session_teaching',
                relatedSchedule: scheduleId,
                description: 'Credits earned for a completed teaching session',
            });
            result = {
                learner: debit.user,
                teacher: credit.user,
                debitTx: debit.transaction,
                creditTx: credit.transaction,
            };
        } else {
            throw error;
        }
    } finally {
        session.endSession();
    }

    return result;
};

/**
 * Returns a user's current balance.
 * @param {string} userId
 */
export const getBalance = async (userId) => {
    const user = await User.findById(userId).select('credits');
    if (!user) {
        throw ApiError.notFound('User not found.');
    }
    return user.credits;
};

/**
 * Returns a paginated transaction history for a user, most recent first.
 * @param {string} userId
 * @param {{page?: number, limit?: number}} options
 */
export const getTransactionHistory = async (userId, { page = 1, limit = 20 } = {}) => {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
        CreditTransaction.find({ user: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('relatedSchedule', 'scheduledAt status'),
        CreditTransaction.countDocuments({ user: userId }),
    ]);

    return {
        transactions,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export default {
    awardCredits,
    deductCredits,
    settleSessionCredits,
    getBalance,
    getTransactionHistory,
};