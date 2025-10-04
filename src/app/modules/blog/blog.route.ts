import { Router } from "express";
import { checkAuth } from "../../middlewares/auth";
import { BlogControllers } from "./blog.controller";

const router = Router();

// Public routes
router.get("/", BlogControllers.allBlogs); // All blogs with query filters
router.get("/published", BlogControllers.getPublishedBlogs); // Only published blogs
router.get("/author/:authorId", BlogControllers.getBlogsByAuthor); // Blogs by specific author
router.get("/:id", BlogControllers.getBlog); // Single blog

// Protected routes (owner only)
router.post("/", checkAuth("owner"), BlogControllers.createBlog);
router.patch("/:id", checkAuth(), BlogControllers.updateBlog);
router.delete("/:id", checkAuth(), BlogControllers.deleteBlog);

export const BlogRoutes = router;
