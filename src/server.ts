import dotenv from "dotenv";
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

dotenv.config();

let server: Server;
const PORT = process.env.PORT;

const startServer = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI || "");
		console.log("⚡ Portfolio connected to MongoDB at lightning speed!");

		server = app.listen(PORT, () => {
			console.log(
				`🚀 Portfolio server running on http://localhost:${PORT}`
			);
			console.log("⚡ Ready to showcase your work!");
		});
	} catch (error) {
		console.error("❌ Portfolio server startup error:", error);
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
