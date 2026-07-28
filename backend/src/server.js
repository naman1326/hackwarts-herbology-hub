// src/server.js
// Application entry point. Connects to MongoDB, then starts the HTTP
// server. Handles unhandled rejections/exceptions gracefully so the
// process doesn't die silently or leave the DB connection dangling.

import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { logger } from './utils/logger.js';

let server;

const startServer = async () => {
    await connectDB();

    server = app.listen(env.PORT, () => {
        logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
        logger.info(`Health check: http://localhost:${env.PORT}/api/health`);
    });
};

startServer();

// ------------------------------------------------------------------
// GLOBAL SAFETY NETS
// ------------------------------------------------------------------
process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason instanceof Error ? reason.stack : reason}`);
    if (server) {
        server.close(() => process.exit(1));
    } else {
        process.exit(1);
    }
});

process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.stack}`);
    process.exit(1);
});

process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    if (server) {
        server.close(() => {
            logger.info('Process terminated.');
        });
    }
});