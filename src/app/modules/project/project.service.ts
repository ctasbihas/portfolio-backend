import mongoose from "mongoose";
import { IProjectUrls, Project } from "./project.model";

// Simple validation functions
const validateRequiredFields = (data: any, fields: string[]) => {
	const missingFields = fields.filter(
		(field) => !data[field] || data[field].toString().trim() === ""
	);
	return {
		isValid: missingFields.length === 0,
		missingFields: missingFields,
	};
};

const validateObjectId = (id: string) => {
	return mongoose.Types.ObjectId.isValid(id);
};

const validateUrl = (url: string) => {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
};

interface CreateProjectData {
	title: string;
	shortDescription: string;
	longDescription: string;
	techStacks: string[];
	urls: IProjectUrls;
	bannerImage: string;
	status?: "Planning" | "In Progress" | "Completed";
	featured?: boolean;
}

interface UpdateProjectData {
	title?: string;
	shortDescription?: string;
	longDescription?: string;
	techStacks?: string[];
	urls?: IProjectUrls;
	bannerImage?: string;
	status?: "Planning" | "In Progress" | "Completed";
	featured?: boolean;
}

interface ProjectQuery {
	page?: number;
	limit?: number;
	status?: string;
	tech?: string;
	search?: string;
	featured?: boolean;
}

const validateProjectUrls = (
	urls: IProjectUrls
): { isValid: boolean; message?: string } => {
	const urlFields = [
		"frontend",
		"backend",
		"githubFrontend",
		"githubBackend",
	];

	for (const field of urlFields) {
		const url = urls[field as keyof IProjectUrls];
		if (url && !validateUrl(url)) {
			return { isValid: false, message: `Invalid ${field} URL` };
		}
	}

	return { isValid: true };
};

const addProject = async (projectData: CreateProjectData) => {
	// Validate required fields
	const validation = validateRequiredFields(projectData, [
		"title",
		"shortDescription",
		"longDescription",
		"bannerImage",
	]);
	if (!validation.isValid) {
		throw new Error(
			`Missing required fields: ${validation.missingFields?.join(", ")}`
		);
	}

	// Validate banner image URL
	if (!validateUrl(projectData.bannerImage)) {
		throw new Error("Invalid banner image URL");
	}

	// Validate project URLs
	if (projectData.urls) {
		const urlValidation = validateProjectUrls(projectData.urls);
		if (!urlValidation.isValid) {
			throw new Error(urlValidation.message!);
		}
	}

	// Validate short description length
	if (projectData.shortDescription.length > 200) {
		throw new Error("Short description cannot exceed 200 characters");
	}

	try {
		const newProject = new Project({
			title: projectData.title.trim(),
			shortDescription: projectData.shortDescription.trim(),
			longDescription: projectData.longDescription.trim(),
			techStacks:
				projectData.techStacks?.map((tech) => tech.trim()) || [],
			urls: projectData.urls || {},
			bannerImage: projectData.bannerImage.trim(),
			status: projectData.status || "Planning",
			featured: projectData.featured || false,
		});

		const savedProject = await newProject.save();
		return savedProject;
	} catch (error: any) {
		throw new Error("Failed to create project");
	}
};

const getProject = async (id: string) => {
	// Validate ID format
	if (!validateObjectId(id)) {
		throw new Error("Invalid project ID format");
	}

	try {
		const project = await Project.findById(id);
		if (!project) {
			throw new Error("Project not found");
		}

		return project;
	} catch (error: any) {
		if (error.message === "Project not found") {
			throw error;
		}
		throw new Error("Failed to retrieve project");
	}
};

const allProjects = async (query: ProjectQuery = {}) => {
	try {
		const { page = 1, limit = 10, status, tech, search, featured } = query;

		// Build filter object
		const filter: any = {};

		// Filter by status
		if (status) {
			filter.status = status;
		}

		// Filter by technology stack
		if (tech) {
			filter.techStacks = { $in: [tech] };
		}

		// Filter by featured status
		if (featured !== undefined) {
			filter.featured = featured;
		}

		// Search in title and short description
		if (search) {
			filter.$text = { $search: search };
		}

		// Calculate pagination
		const skip = (page - 1) * limit;

		// Execute query with pagination
		const projects = await Project.find(filter)
			.sort({ featured: -1, createdAt: -1 })
			.skip(skip)
			.limit(limit);

		// Get total count for pagination
		const total = await Project.countDocuments(filter);
		const totalPages = Math.ceil(total / limit);

		return {
			projects,
			pagination: {
				page,
				limit,
				total,
				totalPages,
			},
		};
	} catch (error: any) {
		throw new Error("Failed to retrieve projects");
	}
};

const updateProject = async (id: string, projectData: UpdateProjectData) => {
	// Validate ID format
	if (!validateObjectId(id)) {
		throw new Error("Invalid project ID format");
	}

	// Validate banner image URL if provided
	if (projectData.bannerImage && !validateUrl(projectData.bannerImage)) {
		throw new Error("Invalid banner image URL");
	}

	// Validate project URLs if provided
	if (projectData.urls) {
		const urlValidation = validateProjectUrls(projectData.urls);
		if (!urlValidation.isValid) {
			throw new Error(urlValidation.message!);
		}
	}

	// Validate short description length if provided
	if (
		projectData.shortDescription &&
		projectData.shortDescription.length > 200
	) {
		throw new Error("Short description cannot exceed 200 characters");
	}

	try {
		// Find the project first
		const existingProject = await Project.findById(id);
		if (!existingProject) {
			throw new Error("Project not found");
		}

		// Prepare update data
		const updateData: any = {};
		if (projectData.title) updateData.title = projectData.title.trim();
		if (projectData.shortDescription)
			updateData.shortDescription = projectData.shortDescription.trim();
		if (projectData.longDescription)
			updateData.longDescription = projectData.longDescription.trim();
		if (projectData.techStacks)
			updateData.techStacks = projectData.techStacks.map((tech) =>
				tech.trim()
			);
		if (projectData.urls) updateData.urls = projectData.urls;
		if (projectData.bannerImage)
			updateData.bannerImage = projectData.bannerImage.trim();
		if (projectData.status) updateData.status = projectData.status;
		if (projectData.featured !== undefined)
			updateData.featured = projectData.featured;

		const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
			new: true,
			runValidators: true,
		});

		return updatedProject;
	} catch (error: any) {
		if (
			error.message === "Project not found" ||
			error.message === "Invalid banner image URL" ||
			error.message.includes("Short description cannot exceed")
		) {
			throw error;
		}
		throw new Error("Failed to update project");
	}
};

const deleteProject = async (id: string) => {
	// Validate ID format
	if (!validateObjectId(id)) {
		throw new Error("Invalid project ID format");
	}

	try {
		const deletedProject = await Project.findByIdAndDelete(id);
		if (!deletedProject) {
			throw new Error("Project not found");
		}

		return deletedProject;
	} catch (error: any) {
		if (error.message === "Project not found") {
			throw error;
		}
		throw new Error("Failed to delete project");
	}
};

const getFeaturedProjects = async (limit: number = 6) => {
	try {
		const projects = await Project.find({ featured: true })
			.sort({ createdAt: -1 })
			.limit(limit);

		return projects;
	} catch (error: any) {
		throw new Error("Failed to retrieve featured projects");
	}
};

const getProjectsByStatus = async (
	status: "Planning" | "In Progress" | "Completed",
	query: ProjectQuery = {}
) => {
	return await allProjects({ ...query, status });
};

const getProjectsByTech = async (tech: string, query: ProjectQuery = {}) => {
	return await allProjects({ ...query, tech });
};

export const ProjectServices = {
	addProject,
	getProject,
	allProjects,
	updateProject,
	deleteProject,
	getFeaturedProjects,
	getProjectsByStatus,
	getProjectsByTech,
};
