import { Request, Response } from "express";
import { ProjectServices } from "./project.service";

const addProject = (req: Request, res: Response) => {
	const result = ProjectServices.addProject(req.body);

	return res.status(201).json({ message: "add project", result });
};
const getProject = (req: Request, res: Response) => {
	const result = ProjectServices.getProject(req.params.id);

	return res.status(200).json({ message: "get project", result });
};
const allProjects = (req: Request, res: Response) => {
	const result = ProjectServices.allProjects();

	return res.status(200).json({ message: "all projects", result });
};
const updateProject = (req: Request, res: Response) => {
	const result = ProjectServices.updateProject(req.params.id, req.body);

	return res.status(200).json({ message: "update project", result });
};
const deleteProject = (req: Request, res: Response) => {
	const result = ProjectServices.deleteProject(req.params.id);

	return res.status(200).json({ message: "delete project", result });
};

export const ProjectControllers = {
	addProject,
	getProject,
	allProjects,
	updateProject,
	deleteProject,
};
