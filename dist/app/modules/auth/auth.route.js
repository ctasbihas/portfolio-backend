"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
// Public routes
router.post("/register", auth_controller_1.AuthControllers.register);
router.post("/login", auth_controller_1.AuthControllers.login);
// Protected routes
router.get("/profile", (0, auth_1.checkAuth)(), auth_controller_1.AuthControllers.getProfile);
router.patch("/profile", (0, auth_1.checkAuth)(), auth_controller_1.AuthControllers.updateProfile);
router.patch("/change-password", (0, auth_1.checkAuth)(), auth_controller_1.AuthControllers.changePassword);
exports.AuthRoutes = router;
