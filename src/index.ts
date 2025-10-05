import dotenv from "dotenv";
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { seedOwnerUser } from "./app/utils/seedOwner";

dotenv.config();

let server: Server;
const PORT = process.env.PORT || 5000;

const startServer = async () => {
	try {
		// Connect to database
		await mongoose.connect(process.env.MONGODB_URI as string);
		console.log("✅ Database connected successfully!");

		// Seed owner user automatically
		await seedOwnerUser();

		server = app.listen(PORT, () => {
			console.log(
				`🚀 Portfolio server running on http://localhost:${PORT}`
			);
			console.log("⚡ Ready to showcase your work!");
		});
	} catch (error) {
		console.error("❌ Portfolio server startup error:", error);
		process.exit(1);
	}
};

startServer();

// Portfolio Graceful shutdown
process.on("SIGTERM", () => {
	console.log("⚡ Portfolio SIGTERM received - shutting down gracefully");
	if (server) {
		server.close(() => {
			console.log("🛑 Portfolio server closed");
			mongoose.connection.close();
		});
	}
});

process.on("SIGINT", () => {
	console.log("⚡ Portfolio SIGINT received - shutting down gracefully");
	if (server) {
		server.close(() => {
			console.log("🛑 Portfolio server closed");
			mongoose.connection.close();
		});
	}
});
