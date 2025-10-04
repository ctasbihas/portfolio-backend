import bcrypt from "bcryptjs";
import { User } from "../modules/user/user.model";

export const seedOwnerUser = async (): Promise<void> => {
	try {
		console.log("🌱 Checking for owner user...");

		const existingOwner = await User.findOne({ role: "owner" });
		if (existingOwner) {
			console.log("👑 Owner user already exists!");
			console.log(`📧 Email: ${existingOwner.email}`);
			return;
		}

		const ownerData = {
			name: process.env.OWNER_NAME,
			email: process.env.OWNER_EMAIL,
			password: process.env.OWNER_PASSWORD,
			role: "owner" as const,
		};

		const saltRounds = 12;
		const hashedPassword = await bcrypt.hash(
			ownerData.password!,
			saltRounds
		);

		const owner = new User({
			name: ownerData.name,
			email: ownerData.email,
			password: hashedPassword,
			role: ownerData.role,
		});

		await owner.save();

		console.log("✅ Owner user created successfully!");
	} catch (error: any) {
		console.error("❌ Error seeding owner user:", error.message);
	}
};
