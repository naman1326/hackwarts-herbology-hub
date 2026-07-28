// src/utils/logger.js
// Minimal, dependency-free structured logger. Morgan handles HTTP access
// logs separately (wired in app.js); this logger is for application-level
// events (DB connection, startup, service warnings/errors).

const timestamp = () => new Date().toISOString();

const format = (level, message) => `[${timestamp()}] [${level}] ${message}`;

export const logger = {
    info: (message) => console.log(format('INFO', message)),
    warn: (message) => console.warn(format('WARN', message)),
    error: (message) => console.error(format('ERROR', message)),
    debug: (message) => {
        if (process.env.NODE_ENV !== 'production') {
            console.debug(format('DEBUG', message));
        }
    },
};

export default logger;