// src/app.js
// Configures the Express application: security middleware, parsers,
// logging, route mounting, and centralized error handling.

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import ApiResponse from './utils/ApiResponse.js';
import { errorHandler, notFoundHandler } from './middleware/Errorhandler.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import skillRoutes from './routes/skill.routes.js';
import matchRoutes from './routes/match.routes.js';
import requestRoutes from './routes/request.routes.js';
import scheduleRoutes from './routes/schedule.routes.js';
import creditRoutes from './routes/credit.routes.js';
import reviewRoutes from './routes/review.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';

const app = express();

// ------------------------------------------------------------------
// SECURITY MIDDLEWARE
// ------------------------------------------------------------------
app.use(helmet());

app.use(
    cors({
        origin: env.CLIENT_URL,
        credentials: true,
    })
);

// ------------------------------------------------------------------
// BODY / COOKIE PARSERS
// ------------------------------------------------------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ------------------------------------------------------------------
// HTTP REQUEST LOGGING
// ------------------------------------------------------------------
const morganFormat = env.IS_PROD ? 'combined' : 'dev';
app.use(
    morgan(morganFormat, {
        stream: {
            write: (message) => logger.info(message.trim()),
        },
    })
);

// ------------------------------------------------------------------
// HEALTH CHECK
// ------------------------------------------------------------------
app.get('/api/health', (req, res) => {
    new ApiResponse(200, { status: 'ok', timestamp: new Date().toISOString() }, 'Server is healthy').send(res);
});

// ------------------------------------------------------------------
// ROUTES
// ------------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// ------------------------------------------------------------------
// 404 + CENTRALIZED ERROR HANDLER (must be registered last)
// ------------------------------------------------------------------
app.use(notFoundHandler);
app.use(errorHandler);

export default app;