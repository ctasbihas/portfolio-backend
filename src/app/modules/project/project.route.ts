import { Router } from "express";
import { ProjectControllers } from "./project.controller";

const router = Router();

router.post("/", ProjectControllers.addProject);
router.get("/:id", ProjectControllers.getProject);
router.get("/", ProjectControllers.allProjects);
router.put("/:id", ProjectControllers.updateProject);
router.delete("/:id", ProjectControllers.deleteProject);

export const ProjectRoutes = router;
