"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const blog_controller_1 = require("./blog.controller");
const router = (0, express_1.Router)();
// Public routes
router.get("/", blog_controller_1.BlogControllers.allBlogs); // All blogs with query filters
router.get("/published", blog_controller_1.BlogControllers.getPublishedBlogs); // Only published blogs
router.get("/author/:authorId", blog_controller_1.BlogControllers.getBlogsByAuthor); // Blogs by specific author
router.get("/:id", blog_controller_1.BlogControllers.getBlog); // Single blog
// Protected routes (owner only)
router.post("/", (0, auth_1.checkAuth)("owner"), blog_controller_1.BlogControllers.createBlog);
router.patch("/:id", (0, auth_1.checkAuth)(), blog_controller_1.BlogControllers.updateBlog);
router.delete("/:id", (0, auth_1.checkAuth)(), blog_controller_1.BlogControllers.deleteBlog);
exports.BlogRoutes = router;
