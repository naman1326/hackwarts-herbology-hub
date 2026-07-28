// src/config/cloudinary.js
// Configures the Cloudinary SDK instance used for profile picture uploads.
// Consumed by services/cloudinary is intentionally NOT created here —
// the actual upload logic lives in middleware/upload.js + controllers,
// keeping this file limited to configuration only (single responsibility).

import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
});

if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    // Non-fatal: the rest of the API (skills, matching, credits, etc.)
    // works fine without Cloudinary. We only warn so profile-picture
    // uploads fail gracefully with a clear error instead of crashing boot.
    logger.warn(
        'Cloudinary credentials are not fully set. Profile picture uploads will fail until CLOUDINARY_* env vars are configured.'
    );
}

export default cloudinary;