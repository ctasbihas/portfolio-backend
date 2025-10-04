import { Router } from "express";
import { checkAuth } from "../../middlewares/auth";
import { ProjectControllers } from "./project.controller";

const router = Router();

// Public routes
router.get("/", ProjectControllers.allProjects); // All projects with query filters
router.get("/featured", ProjectControllers.getFeaturedProjects); // Featured projects
router.get("/status/:status", ProjectControllers.getProjectsByStatus); // Projects by status
router.get("/tech/:tech", ProjectControllers.getProjectsByTech); // Projects by technology
router.get("/:id", ProjectControllers.getProject); // Single project

// Protected routes (owner only)
router.post("/", checkAuth("owner"), ProjectControllers.addProject);
router.patch("/:id", checkAuth("owner"), ProjectControllers.updateProject);
router.delete("/:id", checkAuth("owner"), ProjectControllers.deleteProject);

export const ProjectRoutes = router;
