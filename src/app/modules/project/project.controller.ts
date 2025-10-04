import { Request, Response } from "express";
import { ProjectServices } from "./project.service";

const addProject = async (req: Request, res: Response) => {
	try {
		const result = await ProjectServices.addProject(req.body);

		res.status(201).json({
			success: true,
			message: "Project created successfully",
			data: result,
		});
	} catch (error: any) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

const getProject = async (req: Request, res: Response) => {
	try {
		const result = await ProjectServices.getProject(req.params.id);

		res.status(200).json({
			success: true,
			message: "Project retrieved successfully",
			data: result,
		});
	} catch (error: any) {
		res.status(404).json({
			success: false,
			message: error.message,
		});
	}
};

const allProjects = async (req: Request, res: Response) => {
	try {
		const query = {
			page: parseInt(req.query.page as string) || 1,
			limit: parseInt(req.query.limit as string) || 10,
			status: req.query.status as string,
			tech: req.query.tech as string,
			search: req.query.search as string,
			featured:
				req.query.featured === "true"
					? true
					: req.query.featured === "false"
					? false
					: undefined,
		};

		const result = await ProjectServices.allProjects(query);

		res.status(200).json({
			success: true,
			message: "Projects retrieved successfully",
			data: result.projects,
			pagination: result.pagination,
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

const updateProject = async (req: Request, res: Response) => {
	try {
		const result = await ProjectServices.updateProject(
			req.params.id,
			req.body
		);

		res.status(200).json({
			success: true,
			message: "Project updated successfully",
			data: result,
		});
	} catch (error: any) {
		const statusCode = error.message === "Project not found" ? 404 : 400;
		res.status(statusCode).json({
			success: false,
			message: error.message,
		});
	}
};

const deleteProject = async (req: Request, res: Response) => {
	try {
		const result = await ProjectServices.deleteProject(req.params.id);

		res.status(200).json({
			success: true,
			message: "Project deleted successfully",
			data: result,
		});
	} catch (error: any) {
		const statusCode = error.message === "Project not found" ? 404 : 400;
		res.status(statusCode).json({
			success: false,
			message: error.message,
		});
	}
};

const getFeaturedProjects = async (req: Request, res: Response) => {
	try {
		const limit = parseInt(req.query.limit as string) || 6;
		const result = await ProjectServices.getFeaturedProjects(limit);

		res.status(200).json({
			success: true,
			message: "Featured projects retrieved successfully",
			data: result,
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

const getProjectsByStatus = async (req: Request, res: Response) => {
	try {
		const status = req.params.status as
			| "Planning"
			| "In Progress"
			| "Completed";
		const query = {
			page: parseInt(req.query.page as string) || 1,
			limit: parseInt(req.query.limit as string) || 10,
			tech: req.query.tech as string,
			search: req.query.search as string,
		};

		const result = await ProjectServices.getProjectsByStatus(status, query);

		res.status(200).json({
			success: true,
			message: `${status} projects retrieved successfully`,
			data: result.projects,
			pagination: result.pagination,
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

const getProjectsByTech = async (req: Request, res: Response) => {
	try {
		const tech = req.params.tech;
		const query = {
			page: parseInt(req.query.page as string) || 1,
			limit: parseInt(req.query.limit as string) || 10,
			status: req.query.status as string,
			search: req.query.search as string,
		};

		const result = await ProjectServices.getProjectsByTech(tech, query);

		res.status(200).json({
			success: true,
			message: `Projects with ${tech} retrieved successfully`,
			data: result.projects,
			pagination: result.pagination,
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const ProjectControllers = {
	addProject,
	getProject,
	allProjects,
	updateProject,
	deleteProject,
	getFeaturedProjects,
	getProjectsByStatus,
	getProjectsByTech,
};
