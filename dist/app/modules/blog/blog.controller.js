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
exports.BlogControllers = void 0;
const blog_service_1 = require("./blog.service");
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield blog_service_1.BlogServices.createBlog(req.body, req.user.userId);
        res.status(201).json({
            success: true,
            message: "Blog created successfully",
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
const getBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield blog_service_1.BlogServices.getBlog(req.params.id);
        res.status(200).json({
            success: true,
            message: "Blog retrieved successfully",
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
const allBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            category: req.query.category,
            search: req.query.search,
            published: req.query.published === "true"
                ? true
                : req.query.published === "false"
                    ? false
                    : undefined,
        };
        const result = yield blog_service_1.BlogServices.allBlogs(query);
        res.status(200).json({
            success: true,
            message: "Blogs retrieved successfully",
            data: result.blogs,
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
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield blog_service_1.BlogServices.updateBlog(req.params.id, req.body, req.user.userId, req.user.role);
        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: result,
        });
    }
    catch (error) {
        const statusCode = error.message === "Blog not found"
            ? 404
            : error.message ===
                "You don't have permission to update this blog"
                ? 403
                : 400;
        res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
});
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield blog_service_1.BlogServices.deleteBlog(req.params.id, req.user.userId, req.user.role);
        res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
            data: result,
        });
    }
    catch (error) {
        const statusCode = error.message === "Blog not found"
            ? 404
            : error.message ===
                "You don't have permission to delete this blog"
                ? 403
                : 400;
        res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
});
const getPublishedBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            category: req.query.category,
            search: req.query.search,
        };
        const result = yield blog_service_1.BlogServices.getPublishedBlogs(query);
        res.status(200).json({
            success: true,
            message: "Published blogs retrieved successfully",
            data: result.blogs,
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
const getBlogsByAuthor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            category: req.query.category,
            search: req.query.search,
        };
        const result = yield blog_service_1.BlogServices.getBlogsByAuthor(req.params.authorId, query);
        res.status(200).json({
            success: true,
            message: "Blogs by author retrieved successfully",
            data: result.blogs,
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
exports.BlogControllers = {
    createBlog,
    getBlog,
    allBlogs,
    updateBlog,
    deleteBlog,
    getPublishedBlogs,
    getBlogsByAuthor,
};
