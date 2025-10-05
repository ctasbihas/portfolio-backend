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
exports.BlogServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const blog_model_1 = require("./blog.model");
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
const createBlog = (blogData, authorId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Validate required fields
    const validation = validateRequiredFields(blogData, [
        "title",
        "content",
        "bannerImage",
    ]);
    if (!validation.isValid) {
        throw new Error(`Missing required fields: ${(_a = validation.missingFields) === null || _a === void 0 ? void 0 : _a.join(", ")}`);
    }
    // Validate banner image URL
    if (!validateUrl(blogData.bannerImage)) {
        throw new Error("Invalid banner image URL");
    }
    try {
        const newBlog = new blog_model_1.Blog({
            title: blogData.title.trim(),
            content: blogData.content.trim(),
            author: authorId,
            categories: ((_b = blogData.categories) === null || _b === void 0 ? void 0 : _b.map((cat) => cat.trim())) || [],
            bannerImage: blogData.bannerImage.trim(),
            isPublished: blogData.isPublished || false,
        });
        const savedBlog = yield newBlog.save();
        yield savedBlog.populate("author", "name email");
        return savedBlog;
    }
    catch (error) {
        throw new Error("Failed to create blog");
    }
});
const getBlog = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate ID format
    if (!validateObjectId(id)) {
        throw new Error("Invalid blog ID format");
    }
    try {
        const blog = yield blog_model_1.Blog.findById(id).populate("author", "name email");
        if (!blog) {
            throw new Error("Blog not found");
        }
        return blog;
    }
    catch (error) {
        if (error.message === "Blog not found") {
            throw error;
        }
        throw new Error("Failed to retrieve blog");
    }
});
const allBlogs = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (query = {}) {
    try {
        const { page = 1, limit = 10, category, search, published } = query;
        // Build filter object
        const filter = {};
        // Filter by published status
        if (published !== undefined) {
            filter.isPublished = published;
        }
        // Filter by category
        if (category) {
            filter.categories = { $in: [category] };
        }
        // Search in title and content
        if (search) {
            filter.$text = { $search: search };
        }
        // Calculate pagination
        const skip = (page - 1) * limit;
        // Execute query with pagination
        const blogs = yield blog_model_1.Blog.find(filter)
            .populate("author", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        // Get total count for pagination
        const total = yield blog_model_1.Blog.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);
        return {
            blogs,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        };
    }
    catch (error) {
        throw new Error("Failed to retrieve blogs");
    }
});
const updateBlog = (id, blogData, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate ID format
    if (!validateObjectId(id)) {
        throw new Error("Invalid blog ID format");
    }
    // Validate banner image URL if provided
    if (blogData.bannerImage && !validateUrl(blogData.bannerImage)) {
        throw new Error("Invalid banner image URL");
    }
    try {
        // Find the blog first
        const existingBlog = yield blog_model_1.Blog.findById(id);
        if (!existingBlog) {
            throw new Error("Blog not found");
        }
        // Check if user has permission to update (owner or blog author)
        if (userRole !== "owner" && existingBlog.author.toString() !== userId) {
            throw new Error("You don't have permission to update this blog");
        }
        // Prepare update data
        const updateData = {};
        if (blogData.title)
            updateData.title = blogData.title.trim();
        if (blogData.content)
            updateData.content = blogData.content.trim();
        if (blogData.categories)
            updateData.categories = blogData.categories.map((cat) => cat.trim());
        if (blogData.bannerImage)
            updateData.bannerImage = blogData.bannerImage.trim();
        if (blogData.isPublished !== undefined)
            updateData.isPublished = blogData.isPublished;
        const updatedBlog = yield blog_model_1.Blog.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).populate("author", "name email");
        return updatedBlog;
    }
    catch (error) {
        if (error.message === "Blog not found" ||
            error.message === "You don't have permission to update this blog" ||
            error.message === "Invalid banner image URL") {
            throw error;
        }
        throw new Error("Failed to update blog");
    }
});
const deleteBlog = (id, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate ID format
    if (!validateObjectId(id)) {
        throw new Error("Invalid blog ID format");
    }
    try {
        // Find the blog first
        const existingBlog = yield blog_model_1.Blog.findById(id);
        if (!existingBlog) {
            throw new Error("Blog not found");
        }
        // Check if user has permission to delete (owner or blog author)
        if (userRole !== "owner" && existingBlog.author.toString() !== userId) {
            throw new Error("You don't have permission to delete this blog");
        }
        const deletedBlog = yield blog_model_1.Blog.findByIdAndDelete(id).populate("author", "name email");
        return deletedBlog;
    }
    catch (error) {
        if (error.message === "Blog not found" ||
            error.message === "You don't have permission to delete this blog") {
            throw error;
        }
        throw new Error("Failed to delete blog");
    }
});
const getPublishedBlogs = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (query = {}) {
    return yield allBlogs(Object.assign(Object.assign({}, query), { published: true }));
});
const getBlogsByAuthor = (authorId_1, ...args_1) => __awaiter(void 0, [authorId_1, ...args_1], void 0, function* (authorId, query = {}) {
    // Validate author ID format
    if (!validateObjectId(authorId)) {
        throw new Error("Invalid author ID format");
    }
    try {
        const { page = 1, limit = 10, category, search } = query;
        // Build filter object
        const filter = { author: authorId };
        // Filter by category
        if (category) {
            filter.categories = { $in: [category] };
        }
        // Search in title and content
        if (search) {
            filter.$text = { $search: search };
        }
        // Calculate pagination
        const skip = (page - 1) * limit;
        // Execute query with pagination
        const blogs = yield blog_model_1.Blog.find(filter)
            .populate("author", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        // Get total count for pagination
        const total = yield blog_model_1.Blog.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);
        return {
            blogs,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        };
    }
    catch (error) {
        throw new Error("Failed to retrieve blogs by author");
    }
});
exports.BlogServices = {
    createBlog,
    getBlog,
    allBlogs,
    updateBlog,
    deleteBlog,
    getPublishedBlogs,
    getBlogsByAuthor,
};
