// src/controllers/credit.controller.js
// Read-only views into the community credit system — all balance
// mutations happen exclusively through credit.service.js, triggered by
// schedule.controller.js's completeSchedule (or auth.controller.js's
// signup bonus). This controller never writes to a user's balance.

import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../middleware/Errorhandler.js';
import { getBalance, getTransactionHistory } from '../services/credit.service.js';

/**
 * @route   GET /api/credits
 * @access  Private
 */
export const getMyBalance = asyncHandler(async (req, res) => {
    const credits = await getBalance(req.user._id);
    return new ApiResponse(200, { credits }, 'Balance fetched successfully').send(res);
});

/**
 * @route   GET /api/credits/history
 * @access  Private
 * Query params: ?page=1&limit=20
 */
export const getMyHistory = asyncHandler(async (req, res) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;

    const history = await getTransactionHistory(req.user._id, { page, limit });

    return new ApiResponse(200, history, 'Transaction history fetched successfully').send(res);
});

export default { getMyBalance, getMyHistory };