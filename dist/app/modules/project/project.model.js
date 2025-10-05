"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = require("mongoose");
const projectSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
// Index for better performance
projectSchema.index({ title: "text", shortDescription: "text" });
projectSchema.index({ techStacks: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ featured: -1 });
projectSchema.index({ createdAt: -1 });
exports.Project = (0, mongoose_1.model)("Project", projectSchema);
