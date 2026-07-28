// src/middleware/upload.js
// Handles profile picture uploads: Multer buffers the file in memory
// (no disk writes needed), then a helper streams that buffer straight
// to Cloudinary. Also exports a delete helper so controllers can clean
// up the old picture when a user uploads a new one.

import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import ApiError from '../utils/ApiError.js';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(
            ApiError.badRequest('Only JPEG, PNG, and WEBP image files are allowed for profile pictures.')
        );
    }
    cb(null, true);
};

/**
 * Multer instance configured for single profile-picture uploads.
 * Usage: router.put('/profile/picture', protect, upload.single('profilePicture'), handler)
 */
export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

/**
 * Streams an in-memory file buffer to Cloudinary and resolves with the
 * resulting secure URL + public_id.
 * @param {Buffer} buffer - the uploaded file's buffer (req.file.buffer)
 * @param {string} folder - Cloudinary folder to organize uploads
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadBufferToCloudinary = (buffer, folder = 'skillsphere/profile-pictures') =>
    new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                transformation: [{ width: 500, height: 500, crop: 'fill', gravity: 'face' }],
            },
            (error, result) => {
                if (error) {
                    return reject(ApiError.internal(`Image upload failed: ${error.message}`));
                }
                resolve({ url: result.secure_url, publicId: result.public_id });
            }
        );

        uploadStream.end(buffer);
    });

/**
 * Deletes a previously uploaded image from Cloudinary by its public_id.
 * Safe to call with an empty/undefined publicId (no-op).
 * @param {string} publicId
 */
export const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        // Non-fatal — we don't want a failed cleanup of the OLD picture to
        // block the request that's uploading a NEW one.
        // eslint-disable-next-line no-console
        console.warn(`Failed to delete Cloudinary asset ${publicId}: ${error.message}`);
    }
};

export default { upload, uploadBufferToCloudinary, deleteFromCloudinary };