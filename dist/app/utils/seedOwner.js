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
exports.seedOwnerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../modules/user/user.model");
const seedOwnerUser = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("🌱 Checking for owner user...");
        const existingOwner = yield user_model_1.User.findOne({ role: "owner" });
        if (existingOwner) {
            console.log("👑 Owner user already exists!");
            console.log(`📧 Email: ${existingOwner.email}`);
            return;
        }
        const ownerData = {
            name: process.env.OWNER_NAME,
            email: process.env.OWNER_EMAIL,
            password: process.env.OWNER_PASSWORD,
            role: "owner",
        };
        const saltRounds = 12;
        const hashedPassword = yield bcryptjs_1.default.hash(ownerData.password, saltRounds);
        const owner = new user_model_1.User({
            name: ownerData.name,
            email: ownerData.email,
            password: hashedPassword,
            role: ownerData.role,
        });
        yield owner.save();
        console.log("✅ Owner user created successfully!");
    }
    catch (error) {
        console.error("❌ Error seeding owner user:", error.message);
    }
});
exports.seedOwnerUser = seedOwnerUser;
