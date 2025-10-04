import { Request, Response } from "express";
import { BlogServices } from "./blog.service";

const createBlog = async (req: Request, res: Response) => {
	try {
		const result = await BlogServices.createBlog(req.body, req.user.userId);

		res.status(201).json({
			success: true,
			message: "Blog created successfully",
			data: result,
		});
	} catch (error: any) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

const getBlog = async (req: Request, res: Response) => {
	try {
		const result = await BlogServices.getBlog(req.params.id);

		res.status(200).json({
			success: true,
			message: "Blog retrieved successfully",
			data: result,
		});
	} catch (error: any) {
		res.status(404).json({
			success: false,
			message: error.message,
		});
	}
};

const allBlogs = async (req: Request, res: Response) => {
	try {
		const query = {
			page: parseInt(req.query.page as string) || 1,
			limit: parseInt(req.query.limit as string) || 10,
			category: req.query.category as string,
			search: req.query.search as string,
			published:
				req.query.published === "true"
					? true
					: req.query.published === "false"
					? false
					: undefined,
		};

		const result = await BlogServices.allBlogs(query);

		res.status(200).json({
			success: true,
			message: "Blogs retrieved successfully",
			data: result.blogs,
			pagination: result.pagination,
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

const updateBlog = async (req: Request, res: Response) => {
	try {
		const result = await BlogServices.updateBlog(
			req.params.id,
			req.body,
			req.user.userId,
			req.user.role
		);

		res.status(200).json({
			success: true,
			message: "Blog updated successfully",
			data: result,
		});
	} catch (error: any) {
		const statusCode =
			error.message === "Blog not found"
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
};

const deleteBlog = async (req: Request, res: Response) => {
	try {
		const result = await BlogServices.deleteBlog(
			req.params.id,
			req.user.userId,
			req.user.role
		);

		res.status(200).json({
			success: true,
			message: "Blog deleted successfully",
			data: result,
		});
	} catch (error: any) {
		const statusCode =
			error.message === "Blog not found"
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
};

const getPublishedBlogs = async (req: Request, res: Response) => {
	try {
		const query = {
			page: parseInt(req.query.page as string) || 1,
			limit: parseInt(req.query.limit as string) || 10,
			category: req.query.category as string,
			search: req.query.search as string,
		};

		const result = await BlogServices.getPublishedBlogs(query);

		res.status(200).json({
			success: true,
			message: "Published blogs retrieved successfully",
			data: result.blogs,
			pagination: result.pagination,
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

const getBlogsByAuthor = async (req: Request, res: Response) => {
	try {
		const query = {
			page: parseInt(req.query.page as string) || 1,
			limit: parseInt(req.query.limit as string) || 10,
			category: req.query.category as string,
			search: req.query.search as string,
		};

		const result = await BlogServices.getBlogsByAuthor(
			req.params.authorId,
			query
		);

		res.status(200).json({
			success: true,
			message: "Blogs by author retrieved successfully",
			data: result.blogs,
			pagination: result.pagination,
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const BlogControllers = {
	createBlog,
	getBlog,
	allBlogs,
	updateBlog,
	deleteBlog,
	getPublishedBlogs,
	getBlogsByAuthor,
};
