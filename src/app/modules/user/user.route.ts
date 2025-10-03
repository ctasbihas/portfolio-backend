import { Router } from "express";
import {
	allUsers,
	createUser,
	deleteUser,
	getUser,
	updateUser,
} from "./user.controller";

const router = Router();

router.post("/register", createUser);
router.get("/", allUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export const UserRoutes = router;
