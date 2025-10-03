import { Request, Response } from "express";
import { BlogServices } from "./blog.service";

const createBlog = (req: Request, res: Response) => {
	const result = BlogServices.createBlog(req.body);

	return res.status(201).json({ message: "create blog", result });
};

const getBlog = (req: Request, res: Response) => {
	const result = BlogServices.getBlog(req.params.id);

	return res.status(200).json({ message: "get blog", result });
};

const allBlogs = (req: Request, res: Response) => {
	const result = BlogServices.allBlogs();

	return res.status(200).json({ message: "all blogs", result });
};

const updateBlog = (req: Request, res: Response) => {
	const result = BlogServices.updateBlog(req.params.id, req.body);

	return res.status(200).json({ message: "update blog", result });
};

const deleteBlog = (req: Request, res: Response) => {
	const result = BlogServices.deleteBlog(req.params.id);

	return res.status(200).json({ message: "delete blog", result });
};

export const BlogControllers = {
	createBlog,
	getBlog,
	allBlogs,
	updateBlog,
	deleteBlog,
};
