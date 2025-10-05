"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFoundHandler = exports.errorHandler = void 0;
// Error handling middleware
const errorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = "Internal server error";
    // Mongoose validation error
    if (error.name === "ValidationError") {
        statusCode = 400;
        const errors = Object.values(error.errors).map((err) => err.message);
        message = `Validation Error: ${errors.join(", ")}`;
    }
    // Mongoose cast error (invalid ObjectId)
    if (error.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    }
    // Mongoose duplicate key error
    if (error.code === 11000) {
        statusCode = 400;
        const field = Object.keys(error.keyValue)[0];
        message = `${field} already exists`;
    }
    // JWT errors
    if (error.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }
    if (error.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    }
    // Log error for debugging (only in development)
    if (process.env.NODE_ENV === "development") {
        console.error("Error:", error);
    }
    res.status(statusCode).json({
        success: false,
        message: message,
    });
};
exports.errorHandler = errorHandler;
// 404 handler
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
};
exports.notFoundHandler = notFoundHandler;
// Async error wrapper
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
