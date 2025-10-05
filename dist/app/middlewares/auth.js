"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../modules/user/user.model");
const checkAuth = (requiredRole) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    success: false,
                    message: "Access denied. No token provided.",
                });
            }
            const token = authHeader.substring(7);
            if (!process.env.JWT_SECRET) {
                return res.status(500).json({
                    success: false,
                    message: "JWT secret not configured",
                });
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = yield user_model_1.User.findById(decoded.userId);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token. User not found.",
                });
            }
            req.user = {
                userId: user._id,
                email: user.email,
                role: user.role,
                name: user.name,
            };
            if (requiredRole) {
                if (req.user.role !== requiredRole) {
                    const roleMessage = requiredRole === "owner"
                        ? "Access denied. Owner privileges required."
                        : `Access denied. ${requiredRole} role required.`;
                    return res.status(403).json({
                        success: false,
                        message: roleMessage,
                    });
                }
            }
            next();
        }
        catch (error) {
            if (error.name === "JsonWebTokenError") {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token.",
                });
            }
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    message: "Token expired.",
                });
            }
            return res.status(500).json({
                success: false,
                message: "Token verification failed.",
            });
        }
    });
};
exports.checkAuth = checkAuth;
