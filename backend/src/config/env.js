// src/config/env.js
// Centralized, validated access to environment variables.
// Every other file should import `env` from here instead of touching
// `process.env` directly — this keeps configuration in one place and
// fails fast on startup if something required is missing.

import dotenv from 'dotenv';

dotenv.config();

const REQUIRED_VARS = ['MONGO_URI', 'JWT_SECRET'];

const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

if (missing.length > 0) {
    // Fail fast — a backend without a DB connection string or JWT secret
    // should never be allowed to boot silently.
    // eslint-disable-next-line no-console
    console.error(
        `[ENV ERROR] Missing required environment variables: ${missing.join(', ')}`
    );
    process.exit(1);
}

export const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT) || 5000,
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

    MONGO_URI: process.env.MONGO_URI,

    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    JWT_COOKIE_EXPIRES_IN_DAYS: Number(process.env.JWT_COOKIE_EXPIRES_IN_DAYS) || 7,

    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',

    STARTING_CREDITS: Number(process.env.STARTING_CREDITS) || 10,
    CREDITS_PER_SESSION: Number(process.env.CREDITS_PER_SESSION) || 5,

    IS_PROD: (process.env.NODE_ENV || 'development') === 'production',
};

export default env;