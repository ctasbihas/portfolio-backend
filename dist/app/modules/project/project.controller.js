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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectControllers = void 0;
const project_service_1 = require("./project.service");
const addProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield project_service_1.ProjectServices.addProject(req.body);
        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
const getProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield project_service_1.ProjectServices.getProject(req.params.id);
        res.status(200).json({
            success: true,
            message: "Project retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
});
const allProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            status: req.query.status,
            tech: req.query.tech,
            search: req.query.search,
            featured: req.query.featured === "true"
                ? true
                : req.query.featured === "false"
                    ? false
                    : undefined,
        };
        const result = yield project_service_1.ProjectServices.allProjects(query);
        res.status(200).json({
            success: true,
            message: "Projects retrieved successfully",
            data: result.projects,
            pagination: result.pagination,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield project_service_1.ProjectServices.updateProject(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: result,
        });
    }
    catch (error) {
        const statusCode = error.message === "Project not found" ? 404 : 400;
        res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
});
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield project_service_1.ProjectServices.deleteProject(req.params.id);
        res.status(200).json({
            success: true,
            message: "Project deleted successfully",
            data: result,
        });
    }
    catch (error) {
        const statusCode = error.message === "Project not found" ? 404 : 400;
        res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
});
const getFeaturedProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = parseInt(req.query.limit) || 6;
        const result = yield project_service_1.ProjectServices.getFeaturedProjects(limit);
        res.status(200).json({
            success: true,
            message: "Featured projects retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
const getProjectsByStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const status = req.params.status;
        const query = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            tech: req.query.tech,
            search: req.query.search,
        };
        const result = yield project_service_1.ProjectServices.getProjectsByStatus(status, query);
        res.status(200).json({
            success: true,
            message: `${status} projects retrieved successfully`,
            data: result.projects,
            pagination: result.pagination,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
const getProjectsByTech = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tech = req.params.tech;
        const query = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            status: req.query.status,
            search: req.query.search,
        };
        const result = yield project_service_1.ProjectServices.getProjectsByTech(tech, query);
        res.status(200).json({
            success: true,
            message: `Projects with ${tech} retrieved successfully`,
            data: result.projects,
            pagination: result.pagination,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.ProjectControllers = {
    addProject,
    getProject,
    allProjects,
    updateProject,
    deleteProject,
    getFeaturedProjects,
    getProjectsByStatus,
    getProjectsByTech,
};
