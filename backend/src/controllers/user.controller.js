// src/controllers/user.controller.js
// Handles viewing OTHER users' public profiles and uploading the
// current user's profile picture. Editing one's own text profile
// fields (name/bio/skills/etc.) lives in auth.controller.js's
// updateProfile — this file is scoped to "users as seen by others"
// plus the Cloudinary-backed picture flow.

import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../middleware/Errorhandler.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../middleware/upload.js';

/**
 * @route   GET /api/users/:id
 * @access  Public
 * Returns another user's public profile — used for viewing a
 * prospective teacher/learner before sending a request.
 */
export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.params.id, isActive: true });

    if (!user) {
        throw ApiError.notFound('User not found.');
    }

    return new ApiResponse(200, user, 'User profile fetched successfully').send(res);
});

/**
 * @route   PUT /api/users/profile/picture
 * @access  Private
 * Expects a multipart/form-data request with a single file field
 * named "profilePicture" (see middleware/upload.js).
 */
export const uploadProfilePicture = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw ApiError.badRequest('No image file was provided.');
    }

    const previousPublicId = req.user.profilePicture?.publicId;

    const { url, publicId } = await uploadBufferToCloudinary(req.file.buffer);

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { profilePicture: { url, publicId } },
        { new: true }
    );

    // Clean up the old image AFTER the new one is safely saved, so a
    // failure here never leaves the user without any profile picture.
    if (previousPublicId) {
        await deleteFromCloudinary(previousPublicId);
    }

    return new ApiResponse(200, user, 'Profile picture updated successfully').send(res);
});

export default { getUserById, uploadProfilePicture };