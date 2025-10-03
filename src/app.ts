import cors from "cors";
import express, { Request, Response } from "express";
import { indexRoutes } from "./app/routes";

const app = express();

app.use(express.json());
app.use(
	cors({
		origin: [
			process.env.DEVELOPMENT_FRONTEND_URL!,
			process.env.PRODUCTION_FRONTEND_URL!,
		],
		credentials: true,
	})
);

app.get("/", (req: Request, res: Response) => {
	res.json({
		success: true,
		message: "Portfolio API - Showcase Your Work",
		timestamp: new Date().toISOString(),
		version: "1.0.0",
	});
});

app.use("/api/v1", indexRoutes);

export default app;
