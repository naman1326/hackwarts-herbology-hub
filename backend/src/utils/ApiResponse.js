// src/utils/ApiResponse.js
// Wraps every successful controller response in a consistent shape:
// { success, statusCode, message, data }
// This makes the frontend's job predictable regardless of which
// endpoint it is calling.

class ApiResponse {
    constructor(statusCode, data = null, message = 'Success') {
        this.statusCode = statusCode;
        this.success = statusCode < 400;
        this.message = message;
        this.data = data;
    }

    send(res) {
        return res.status(this.statusCode).json({
            success: this.success,
            statusCode: this.statusCode,
            message: this.message,
            data: this.data,
        });
    }
}

export default ApiResponse;