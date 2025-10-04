import mongoose from "mongoose";
import { Blog } from "./blog.model";

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

interface CreateBlogData {
	title: string;
	content: string;
	categories: string[];
	bannerImage: string;
	isPublished?: boolean;
}

interface UpdateBlogData {
	title?: string;
	content?: string;
	categories?: string[];
	bannerImage?: string;
	isPublished?: boolean;
}

interface BlogQuery {
	page?: number;
	limit?: number;
	category?: string;
	search?: string;
	published?: boolean;
}

const createBlog = async (blogData: CreateBlogData, authorId: string) => {
	// Validate required fields
	const validation = validateRequiredFields(blogData, [
		"title",
		"content",
		"bannerImage",
	]);
	if (!validation.isValid) {
		throw new Error(
			`Missing required fields: ${validation.missingFields?.join(", ")}`
		);
	}

	// Validate banner image URL
	if (!validateUrl(blogData.bannerImage)) {
		throw new Error("Invalid banner image URL");
	}

	try {
		const newBlog = new Blog({
			title: blogData.title.trim(),
			content: blogData.content.trim(),
			author: authorId,
			categories: blogData.categories?.map((cat) => cat.trim()) || [],
			bannerImage: blogData.bannerImage.trim(),
			isPublished: blogData.isPublished || false,
		});

		const savedBlog = await newBlog.save();
		await savedBlog.populate("author", "name email");

		return savedBlog;
	} catch (error: any) {
		throw new Error("Failed to create blog");
	}
};

const getBlog = async (id: string) => {
	// Validate ID format
	if (!validateObjectId(id)) {
		throw new Error("Invalid blog ID format");
	}

	try {
		const blog = await Blog.findById(id).populate("author", "name email");
		if (!blog) {
			throw new Error("Blog not found");
		}

		return blog;
	} catch (error: any) {
		if (error.message === "Blog not found") {
			throw error;
		}
		throw new Error("Failed to retrieve blog");
	}
};

const allBlogs = async (query: BlogQuery = {}) => {
	try {
		const { page = 1, limit = 10, category, search, published } = query;

		// Build filter object
		const filter: any = {};

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
		const blogs = await Blog.find(filter)
			.populate("author", "name email")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		// Get total count for pagination
		const total = await Blog.countDocuments(filter);
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
	} catch (error: any) {
		throw new Error("Failed to retrieve blogs");
	}
};

const updateBlog = async (
	id: string,
	blogData: UpdateBlogData,
	userId: string,
	userRole: string
) => {
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
		const existingBlog = await Blog.findById(id);
		if (!existingBlog) {
			throw new Error("Blog not found");
		}

		// Check if user has permission to update (owner or blog author)
		if (userRole !== "owner" && existingBlog.author.toString() !== userId) {
			throw new Error("You don't have permission to update this blog");
		}

		// Prepare update data
		const updateData: any = {};
		if (blogData.title) updateData.title = blogData.title.trim();
		if (blogData.content) updateData.content = blogData.content.trim();
		if (blogData.categories)
			updateData.categories = blogData.categories.map((cat) =>
				cat.trim()
			);
		if (blogData.bannerImage)
			updateData.bannerImage = blogData.bannerImage.trim();
		if (blogData.isPublished !== undefined)
			updateData.isPublished = blogData.isPublished;

		const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
			new: true,
			runValidators: true,
		}).populate("author", "name email");

		return updatedBlog;
	} catch (error: any) {
		if (
			error.message === "Blog not found" ||
			error.message === "You don't have permission to update this blog" ||
			error.message === "Invalid banner image URL"
		) {
			throw error;
		}
		throw new Error("Failed to update blog");
	}
};

const deleteBlog = async (id: string, userId: string, userRole: string) => {
	// Validate ID format
	if (!validateObjectId(id)) {
		throw new Error("Invalid blog ID format");
	}

	try {
		// Find the blog first
		const existingBlog = await Blog.findById(id);
		if (!existingBlog) {
			throw new Error("Blog not found");
		}

		// Check if user has permission to delete (owner or blog author)
		if (userRole !== "owner" && existingBlog.author.toString() !== userId) {
			throw new Error("You don't have permission to delete this blog");
		}

		const deletedBlog = await Blog.findByIdAndDelete(id).populate(
			"author",
			"name email"
		);
		return deletedBlog;
	} catch (error: any) {
		if (
			error.message === "Blog not found" ||
			error.message === "You don't have permission to delete this blog"
		) {
			throw error;
		}
		throw new Error("Failed to delete blog");
	}
};

const getPublishedBlogs = async (query: BlogQuery = {}) => {
	return await allBlogs({ ...query, published: true });
};

const getBlogsByAuthor = async (authorId: string, query: BlogQuery = {}) => {
	// Validate author ID format
	if (!validateObjectId(authorId)) {
		throw new Error("Invalid author ID format");
	}

	try {
		const { page = 1, limit = 10, category, search } = query;

		// Build filter object
		const filter: any = { author: authorId };

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
		const blogs = await Blog.find(filter)
			.populate("author", "name email")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		// Get total count for pagination
		const total = await Blog.countDocuments(filter);
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
	} catch (error: any) {
		throw new Error("Failed to retrieve blogs by author");
	}
};

export const BlogServices = {
	createBlog,
	getBlog,
	allBlogs,
	updateBlog,
	deleteBlog,
	getPublishedBlogs,
	getBlogsByAuthor,
};
