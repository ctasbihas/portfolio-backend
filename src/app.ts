import cors from "cors";
import express, { Request, Response } from "express";
import { errorHandler, notFoundHandler } from "./app/middlewares/errorHandler";
import { indexRoutes } from "./app/routes";

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
	cors({
		origin: [
			process.env.DEVELOPMENT_FRONTEND_URL || "http://localhost:3000",
			process.env.PRODUCTION_FRONTEND_URL ||
				"https://your-frontend-domain.com",
		],
		credentials: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

// Root route
app.get("/", (req: Request, res: Response) => {
	res.json({
		success: true,
		message: "Portfolio API - Showcase Your Work",
		timestamp: new Date().toISOString(),
		version: "1.0.0",
		endpoints: {
			auth: "/api/v1/auth",
			blogs: "/api/v1/blogs",
			projects: "/api/v1/projects",
			users: "/api/v1/users",
		},
	});
});

// Health check route
app.get("/health", (req: Request, res: Response) => {
	res.json({
		success: true,
		message: "Server is running perfectly!",
		timestamp: new Date().toISOString(),
	});
});

// API routes
app.use("/api/v1", indexRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
