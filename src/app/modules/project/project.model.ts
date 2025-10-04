import { Schema, model } from "mongoose";

export interface IProjectUrls {
	frontend?: string;
	backend?: string;
	githubFrontend?: string;
	githubBackend?: string;
}

export interface IProject {
	title: string;
	shortDescription: string;
	longDescription: string; // markdown content
	techStacks: string[];
	urls: IProjectUrls;
	bannerImage: string; // URL to banner image
	status: "Planning" | "In Progress" | "Completed";
	featured: boolean; // to highlight important projects
}

const projectSchema = new Schema<IProject>(
	{
		title: {
			type: String,
			required: [true, "Title is required"],
			trim: true,
		},
		shortDescription: {
			type: String,
			required: [true, "Short description is required"],
			trim: true,
			maxlength: [200, "Short description cannot exceed 200 characters"],
		},
		longDescription: {
			type: String,
			required: [true, "Long description is required"],
		},
		techStacks: [
			{
				type: String,
				trim: true,
			},
		],
		urls: {
			frontend: {
				type: String,
				trim: true,
			},
			backend: {
				type: String,
				trim: true,
			},
			githubFrontend: {
				type: String,
				trim: true,
			},
			githubBackend: {
				type: String,
				trim: true,
			},
		},
		bannerImage: {
			type: String,
			required: [true, "Banner image is required"],
			trim: true,
		},
		status: {
			type: String,
			enum: ["Planning", "In Progress", "Completed"],
			default: "Planning",
		},
		featured: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

// Index for better performance
projectSchema.index({ title: "text", shortDescription: "text" });
projectSchema.index({ techStacks: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ featured: -1 });
projectSchema.index({ createdAt: -1 });

export const Project = model<IProject>("Project", projectSchema);
