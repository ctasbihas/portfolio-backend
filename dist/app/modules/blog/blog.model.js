"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const mongoose_1 = require("mongoose");
const blogSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
// Index for better performance
blogSchema.index({ title: "text", content: "text" });
blogSchema.index({ categories: 1 });
blogSchema.index({ isPublished: 1 });
blogSchema.index({ createdAt: -1 });
exports.Blog = (0, mongoose_1.model)("Blog", blogSchema);
