"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const project_controller_1 = require("./project.controller");
const router = (0, express_1.Router)();
// Public routes
router.get("/", project_controller_1.ProjectControllers.allProjects); // All projects with query filters
router.get("/featured", project_controller_1.ProjectControllers.getFeaturedProjects); // Featured projects
router.get("/status/:status", project_controller_1.ProjectControllers.getProjectsByStatus); // Projects by status
router.get("/tech/:tech", project_controller_1.ProjectControllers.getProjectsByTech); // Projects by technology
router.get("/:id", project_controller_1.ProjectControllers.getProject); // Single project
// Protected routes (owner only)
router.post("/", (0, auth_1.checkAuth)("owner"), project_controller_1.ProjectControllers.addProject);
router.patch("/:id", (0, auth_1.checkAuth)("owner"), project_controller_1.ProjectControllers.updateProject);
router.delete("/:id", (0, auth_1.checkAuth)("owner"), project_controller_1.ProjectControllers.deleteProject);
exports.ProjectRoutes = router;
