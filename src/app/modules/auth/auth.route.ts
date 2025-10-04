import { Router } from "express";
import { checkAuth } from "../../middlewares/auth";
import { AuthControllers } from "./auth.controller";

const router = Router();

// Public routes
router.post("/register", AuthControllers.register);
router.post("/login", AuthControllers.login);

// Protected routes
router.get("/profile", checkAuth(), AuthControllers.getProfile);
router.patch("/profile", checkAuth(), AuthControllers.updateProfile);
router.patch("/change-password", checkAuth(), AuthControllers.changePassword);

export const AuthRoutes = router;
