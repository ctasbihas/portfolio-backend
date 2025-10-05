"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const seedOwner_1 = require("./app/utils/seedOwner");
dotenv_1.default.config();
let server;
const PORT = process.env.PORT || 5000;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to database
        yield mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log("✅ Database connected successfully!");
        // Seed owner user automatically
        yield (0, seedOwner_1.seedOwnerUser)();
        server = app_1.default.listen(PORT, () => {
            console.log(`🚀 Portfolio server running on http://localhost:${PORT}`);
            console.log("⚡ Ready to showcase your work!");
        });
    }
    catch (error) {
        console.error("❌ Portfolio server startup error:", error);
        process.exit(1);
    }
});
startServer();
// Portfolio Graceful shutdown
process.on("SIGTERM", () => {
    console.log("⚡ Portfolio SIGTERM received - shutting down gracefully");
    if (server) {
        server.close(() => {
            console.log("🛑 Portfolio server closed");
            mongoose_1.default.connection.close();
        });
    }
});
process.on("SIGINT", () => {
    console.log("⚡ Portfolio SIGINT received - shutting down gracefully");
    if (server) {
        server.close(() => {
            console.log("🛑 Portfolio server closed");
            mongoose_1.default.connection.close();
        });
    }
});
