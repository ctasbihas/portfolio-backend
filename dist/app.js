"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("./app/middlewares/errorHandler");
const routes_1 = require("./app/routes");
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: [
        process.env.DEVELOPMENT_FRONTEND_URL || "http://localhost:3000",
        process.env.PRODUCTION_FRONTEND_URL ||
            "https://your-frontend-domain.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// Root route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Portfolio API - Showcase Your Work",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        endpoints: {
            auth: "/api/v1/auth",
            blogs: "/api/v1/blogs",
            projects: "/api/v1/projects",
            users: "/api/v1/users",
        },
    });
});
// Health check route
app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is running perfectly!",
        timestamp: new Date().toISOString(),
    });
});
// API routes
app.use("/api/v1", routes_1.indexRoutes);
// Error handling
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
exports.default = app;
