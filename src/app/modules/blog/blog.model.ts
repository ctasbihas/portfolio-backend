import { Schema, model } from "mongoose";

export interface IBlog {
	title: string;
	content: string; // markdown content
	author: Schema.Types.ObjectId;
	categories: string[];
	bannerImage: string; // URL to banner image
	isPublished: boolean;
}

const blogSchema = new Schema<IBlog>(
	{
		title: {
			type: String,
			required: [true, "Title is required"],
			trim: true,
		},
		content: {
			type: String,
			required: [true, "Content is required"],
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Author is required"],
		},
		categories: [
			{
				type: String,
				trim: true,
			},
		],
		bannerImage: {
			type: String,
			required: [true, "Banner image is required"],
			trim: true,
		},
		isPublished: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

// Index for better performance
blogSchema.index({ title: "text", content: "text" });
blogSchema.index({ categories: 1 });
blogSchema.index({ isPublished: 1 });
blogSchema.index({ createdAt: -1 });

export const Blog = model<IBlog>("Blog", blogSchema);
