// src/config/db.js
// Establishes and monitors the MongoDB connection via Mongoose.

import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

mongoose.set('strictQuery', true);

/**
 * Connects to MongoDB using the URI defined in environment variables.
 * Exits the process on failure since the API cannot function without a DB.
 */
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(env.MONGO_URI);
        logger.info(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    } catch (error) {
        logger.error(`MongoDB connection failed: ${error.message}`);
        process.exit(1);
    }
};

mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB connection lost.');
});

mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected.');
});

export default connectDB;