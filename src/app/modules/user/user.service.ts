import bcrypt from "bcryptjs";
import { IUser, User } from "./user.model";

const createUser = async (userData: IUser) => {
	if (!userData.name || !userData.email || !userData.password) {
		throw new Error("Name, email, and password are required");
	}

	const existingUser = await User.findOne({ email: userData.email });
	if (existingUser) {
		throw new Error("User with this email already exists");
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(userData.email)) {
		throw new Error("Invalid email format");
	}

	if (userData.password.length < 8) {
		throw new Error("Password must be at least 8 characters long");
	}

	try {
		const saltRounds = Number(process.env.BCRYPT_SALT_ROUND);
		const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

		const user = await User.create({
			name: userData.name,
			email: userData.email,
			password: hashedPassword,
		});

		return user;
	} catch (error: any) {
		if (error.code === 11000) {
			throw new Error("User with this email already exists");
		}
		throw new Error(error.message || "Failed to create user");
	}
};

const getUser = async (id: string) => {
	// Validate ID format
	if (!id) {
		throw new Error("User ID is required");
	}

	// Check if ID is valid MongoDB ObjectId format
	const objectIdRegex = /^[0-9a-fA-F]{24}$/;
	if (!objectIdRegex.test(id)) {
		throw new Error("Invalid user ID format");
	}

	try {
		const user = await User.findById(id).select("-password");
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	} catch (error: any) {
		if (error.message === "User not found") {
			throw error;
		}
		throw new Error("Failed to retrieve user");
	}
};

const allUsers = async () => {
	try {
		const users = await User.find().select("-password");

		if (!users || users.length === 0) {
			return [];
		}

		return users;
	} catch (error: any) {
		throw new Error("Failed to retrieve users");
	}
};

const updateUser = async (id: string, userData: Partial<IUser>) => {
	// Validate ID
	if (!id) {
		throw new Error("User ID is required");
	}

	// Check if ID is valid MongoDB ObjectId format
	const objectIdRegex = /^[0-9a-fA-F]{24}$/;
	if (!objectIdRegex.test(id)) {
		throw new Error("Invalid user ID format");
	}

	// Validate if there's data to update
	if (!userData || Object.keys(userData).length === 0) {
		throw new Error("No data provided for update");
	}

	// Validate email format if email is being updated
	if (userData.email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(userData.email)) {
			throw new Error("Invalid email format");
		}

		// Check if email is already taken by another user
		const existingUser = await User.findOne({
			email: userData.email,
			_id: { $ne: id },
		});
		if (existingUser) {
			throw new Error("Email is already taken by another user");
		}
	}

	// Validate password if being updated
	if (userData.password) {
		if (userData.password.length < 6) {
			throw new Error("Password must be at least 6 characters long");
		}
		// Hash the new password
		const saltRounds = 10;
		userData.password = await bcrypt.hash(userData.password, saltRounds);
	}

	// Validate role if being updated
	if (userData.role && !["user", "admin"].includes(userData.role)) {
		throw new Error("Invalid role. Must be 'user' or 'admin'");
	}

	try {
		const updatedUser = await User.findByIdAndUpdate(id, userData, {
			new: true,
			runValidators: true,
		}).select("-password");

		if (!updatedUser) {
			throw new Error("User not found");
		}

		return updatedUser;
	} catch (error: any) {
		if (error.message === "User not found") {
			throw error;
		}
		if (error.code === 11000) {
			throw new Error("Email is already taken by another user");
		}
		throw new Error("Failed to update user");
	}
};

const deleteUser = async (id: string) => {
	// Validate ID
	if (!id) {
		throw new Error("User ID is required");
	}

	// Check if ID is valid MongoDB ObjectId format
	const objectIdRegex = /^[0-9a-fA-F]{24}$/;
	if (!objectIdRegex.test(id)) {
		throw new Error("Invalid user ID format");
	}

	try {
		// Check if user exists before deletion
		const existingUser = await User.findById(id);
		if (!existingUser) {
			throw new Error("User not found");
		}

		// Prevent deletion of admin users (optional business logic)
		if (existingUser.role === "owner") {
			throw new Error("Cannot delete admin users");
		}

		const deletedUser = await User.findByIdAndDelete(id).select(
			"-password"
		);

		if (!deletedUser) {
			throw new Error("Failed to delete user");
		}

		return deletedUser;
	} catch (error: any) {
		if (
			error.message === "User not found" ||
			error.message === "Cannot delete admin users"
		) {
			throw error;
		}
		throw new Error("Failed to delete user");
	}
};

export const UserServices = {
	createUser,
	getUser,
	allUsers,
	updateUser,
	deleteUser,
};
