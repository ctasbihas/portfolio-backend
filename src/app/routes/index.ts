import { Router } from "express";
import { BlogRoutes } from "../modules/blog/blog.route";
import { ProjectRoutes } from "../modules/project/project.route";
import { UserRoutes } from "../modules/user/user.route";

const router = Router();

router.use("/user", UserRoutes);
router.use("/project", ProjectRoutes);
router.use("/blog", BlogRoutes);

export const indexRoutes = router;
