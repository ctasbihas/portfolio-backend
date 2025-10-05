"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const project_model_1 = require("./project.model");
// Simple validation functions
const validateRequiredFields = (data, fields) => {
    const missingFields = fields.filter((field) => !data[field] || data[field].toString().trim() === "");
    return {
        isValid: missingFields.length === 0,
        missingFields: missingFields,
    };
};
const validateObjectId = (id) => {
    return mongoose_1.default.Types.ObjectId.isValid(id);
};
const validateUrl = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch (_a) {
        return false;
    }
};
const validateProjectUrls = (urls) => {
    const urlFields = [
        "frontend",
        "backend",
        "githubFrontend",
        "githubBackend",
    ];
    for (const field of urlFields) {
        const url = urls[field];
        if (url && !validateUrl(url)) {
            return { isValid: false, message: `Invalid ${field} URL` };
        }
    }
    return { isValid: true };
};
const addProject = (projectData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Validate required fields
    const validation = validateRequiredFields(projectData, [
        "title",
        "shortDescription",
        "longDescription",
        "bannerImage",
    ]);
    if (!validation.isValid) {
        throw new Error(`Missing required fields: ${(_a = validation.missingFields) === null || _a === void 0 ? void 0 : _a.join(", ")}`);
    }
    // Validate banner image URL
    if (!validateUrl(projectData.bannerImage)) {
        throw new Error("Invalid banner image URL");
    }
    // Validate project URLs
    if (projectData.urls) {
        const urlValidation = validateProjectUrls(projectData.urls);
        if (!urlValidation.isValid) {
            throw new Error(urlValidation.message);
        }
    }
    // Validate short description length
    if (projectData.shortDescription.length > 200) {
        throw new Error("Short description cannot exceed 200 characters");
    }
    try {
        const newProject = new project_model_1.Project({
            title: projectData.title.trim(),
            shortDescription: projectData.shortDescription.trim(),
            longDescription: projectData.longDescription.trim(),
            techStacks: ((_b = projectData.techStacks) === null || _b === void 0 ? void 0 : _b.map((tech) => tech.trim())) || [],
            urls: projectData.urls || {},
            bannerImage: projectData.bannerImage.trim(),
            status: projectData.status || "Planning",
            featured: projectData.featured || false,
        });
        const savedProject = yield newProject.save();
        return savedProject;
    }
    catch (error) {
        throw new Error("Failed to create project");
    }
});
const getProject = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate ID format
    if (!validateObjectId(id)) {
        throw new Error("Invalid project ID format");
    }
    try {
        const project = yield project_model_1.Project.findById(id);
        if (!project) {
            throw new Error("Project not found");
        }
        return project;
    }
    catch (error) {
        if (error.message === "Project not found") {
            throw error;
        }
        throw new Error("Failed to retrieve project");
    }
});
const allProjects = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (query = {}) {
    try {
        const { page = 1, limit = 10, status, tech, search, featured } = query;
        // Build filter object
        const filter = {};
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
        const projects = yield project_model_1.Project.find(filter)
            .sort({ featured: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);
        // Get total count for pagination
        const total = yield project_model_1.Project.countDocuments(filter);
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
    }
    catch (error) {
        throw new Error("Failed to retrieve projects");
    }
});
const updateProject = (id, projectData) => __awaiter(void 0, void 0, void 0, function* () {
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
            throw new Error(urlValidation.message);
        }
    }
    // Validate short description length if provided
    if (projectData.shortDescription &&
        projectData.shortDescription.length > 200) {
        throw new Error("Short description cannot exceed 200 characters");
    }
    try {
        // Find the project first
        const existingProject = yield project_model_1.Project.findById(id);
        if (!existingProject) {
            throw new Error("Project not found");
        }
        // Prepare update data
        const updateData = {};
        if (projectData.title)
            updateData.title = projectData.title.trim();
        if (projectData.shortDescription)
            updateData.shortDescription = projectData.shortDescription.trim();
        if (projectData.longDescription)
            updateData.longDescription = projectData.longDescription.trim();
        if (projectData.techStacks)
            updateData.techStacks = projectData.techStacks.map((tech) => tech.trim());
        if (projectData.urls)
            updateData.urls = projectData.urls;
        if (projectData.bannerImage)
            updateData.bannerImage = projectData.bannerImage.trim();
        if (projectData.status)
            updateData.status = projectData.status;
        if (projectData.featured !== undefined)
            updateData.featured = projectData.featured;
        const updatedProject = yield project_model_1.Project.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
        return updatedProject;
    }
    catch (error) {
        if (error.message === "Project not found" ||
            error.message === "Invalid banner image URL" ||
            error.message.includes("Short description cannot exceed")) {
            throw error;
        }
        throw new Error("Failed to update project");
    }
});
const deleteProject = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate ID format
    if (!validateObjectId(id)) {
        throw new Error("Invalid project ID format");
    }
    try {
        const deletedProject = yield project_model_1.Project.findByIdAndDelete(id);
        if (!deletedProject) {
            throw new Error("Project not found");
        }
        return deletedProject;
    }
    catch (error) {
        if (error.message === "Project not found") {
            throw error;
        }
        throw new Error("Failed to delete project");
    }
});
const getFeaturedProjects = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (limit = 6) {
    try {
        const projects = yield project_model_1.Project.find({ featured: true })
            .sort({ createdAt: -1 })
            .limit(limit);
        return projects;
    }
    catch (error) {
        throw new Error("Failed to retrieve featured projects");
    }
});
const getProjectsByStatus = (status_1, ...args_1) => __awaiter(void 0, [status_1, ...args_1], void 0, function* (status, query = {}) {
    return yield allProjects(Object.assign(Object.assign({}, query), { status }));
});
const getProjectsByTech = (tech_1, ...args_1) => __awaiter(void 0, [tech_1, ...args_1], void 0, function* (tech, query = {}) {
    return yield allProjects(Object.assign(Object.assign({}, query), { tech }));
});
exports.ProjectServices = {
    addProject,
    getProject,
    allProjects,
    updateProject,
    deleteProject,
    getFeaturedProjects,
    getProjectsByStatus,
    getProjectsByTech,
};
