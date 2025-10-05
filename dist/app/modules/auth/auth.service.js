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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../user/user.model");
// Simple validation functions
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
const validatePassword = (password) => {
    if (password.length < 6) {
        return {
            isValid: false,
            message: "Password must be at least 6 characters long",
        };
    }
    return { isValid: true, message: "Valid password" };
};
const validateRequiredFields = (data, fields) => {
    const missingFields = fields.filter((field) => !data[field] || data[field].toString().trim() === "");
    return {
        isValid: missingFields.length === 0,
        missingFields: missingFields,
    };
};
const generateToken = (userId, email, role) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }
    const payload = { userId, email, role };
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: "7d" });
};
const register = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Validate required fields
    const validation = validateRequiredFields(userData, [
        "name",
        "email",
        "password",
    ]);
    if (!validation.isValid) {
        throw new Error(`Missing required fields: ${(_a = validation.missingFields) === null || _a === void 0 ? void 0 : _a.join(", ")}`);
    }
    // Validate email format
    if (!validateEmail(userData.email)) {
        throw new Error("Invalid email format");
    }
    // Validate password
    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.message);
    }
    // Check if user already exists
    const existingUser = yield user_model_1.User.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error("User with this email already exists");
    }
    try {
        // Hash password
        const saltRounds = 12;
        const hashedPassword = yield bcryptjs_1.default.hash(userData.password, saltRounds);
        // Create user
        const newUser = new user_model_1.User({
            name: userData.name.trim(),
            email: userData.email.toLowerCase().trim(),
            password: hashedPassword,
            role: "regular", // Default role
        });
        const savedUser = yield newUser.save();
        // Generate token
        const token = generateToken(savedUser._id.toString(), savedUser.email, savedUser.role);
        return {
            user: savedUser,
            token,
        };
    }
    catch (error) {
        if (error.code === 11000) {
            throw new Error("User with this email already exists");
        }
        throw new Error("Failed to create user");
    }
});
const login = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Validate required fields
    const validation = validateRequiredFields(credentials, [
        "email",
        "password",
    ]);
    if (!validation.isValid) {
        throw new Error(`Missing required fields: ${(_a = validation.missingFields) === null || _a === void 0 ? void 0 : _a.join(", ")}`);
    }
    // Validate email format
    if (!validateEmail(credentials.email)) {
        throw new Error("Invalid email format");
    }
    try {
        // Find user and include password for verification
        const user = yield user_model_1.User.findOne({
            email: credentials.email.toLowerCase(),
        }).select("+password");
        if (!user) {
            throw new Error("Invalid email or password");
        }
        // Verify password
        const isPasswordValid = yield bcryptjs_1.default.compare(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }
        // Generate token
        const token = generateToken(user._id.toString(), user.email, user.role);
        // Remove password from user object
        const _b = user.toObject(), { password } = _b, userWithoutPassword = __rest(_b, ["password"]);
        return {
            user: userWithoutPassword,
            token,
        };
    }
    catch (error) {
        if (error.message === "Invalid email or password") {
            throw error;
        }
        throw new Error("Login failed");
    }
});
const getProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    catch (error) {
        if (error.message === "User not found") {
            throw error;
        }
        throw new Error("Failed to fetch user profile");
    }
});
const updateProfile = (userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Remove sensitive fields that shouldn't be updated directly
        const { password, role } = updateData, safeUpdateData = __rest(updateData, ["password", "role"]);
        // Validate email if being updated
        if (safeUpdateData.email) {
            if (!validateEmail(safeUpdateData.email)) {
                throw new Error("Invalid email format");
            }
            // Check if email is already taken by another user
            const existingUser = yield user_model_1.User.findOne({
                email: safeUpdateData.email,
                _id: { $ne: userId },
            });
            if (existingUser) {
                throw new Error("Email is already taken by another user");
            }
        }
        const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, safeUpdateData, { new: true, runValidators: true });
        if (!updatedUser) {
            throw new Error("User not found");
        }
        return updatedUser;
    }
    catch (error) {
        if (error.message === "User not found" ||
            error.message === "Email is already taken by another user" ||
            error.message === "Invalid email format") {
            throw error;
        }
        throw new Error("Failed to update profile");
    }
});
const changePassword = (userId, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate new password
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            throw new Error(passwordValidation.message);
        }
        // Find user with password
        const user = yield user_model_1.User.findById(userId).select("+password");
        if (!user) {
            throw new Error("User not found");
        }
        // Verify current password
        const isCurrentPasswordValid = yield bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new Error("Current password is incorrect");
        }
        // Hash new password
        const saltRounds = 12;
        const hashedNewPassword = yield bcryptjs_1.default.hash(newPassword, saltRounds);
        // Update password
        yield user_model_1.User.findByIdAndUpdate(userId, { password: hashedNewPassword });
        return { message: "Password changed successfully" };
    }
    catch (error) {
        if (error.message === "User not found" ||
            error.message === "Current password is incorrect" ||
            error.message.includes("Password must be")) {
            throw error;
        }
        throw new Error("Failed to change password");
    }
});
exports.AuthServices = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
};
