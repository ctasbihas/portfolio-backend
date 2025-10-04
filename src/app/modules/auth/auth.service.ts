import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser, User } from "../user/user.model";

// Simple validation functions
const validateEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

const validatePassword = (password: string) => {
	if (password.length < 6) {
		return {
			isValid: false,
			message: "Password must be at least 6 characters long",
		};
	}
	return { isValid: true, message: "Valid password" };
};

const validateRequiredFields = (data: any, fields: string[]) => {
	const missingFields = fields.filter(
		(field) => !data[field] || data[field].toString().trim() === ""
	);
	return {
		isValid: missingFields.length === 0,
		missingFields: missingFields,
	};
};

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterData {
	name: string;
	email: string;
	password: string;
}

const generateToken = (userId: string, email: string, role: string): string => {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error("JWT_SECRET is not defined");
	}

	const payload = { userId, email, role };

	return jwt.sign(payload, secret, { expiresIn: "7d" });
};

const register = async (userData: RegisterData) => {
	// Validate required fields
	const validation = validateRequiredFields(userData, [
		"name",
		"email",
		"password",
	]);
	if (!validation.isValid) {
		throw new Error(
			`Missing required fields: ${validation.missingFields?.join(", ")}`
		);
	}

	// Validate email format
	if (!validateEmail(userData.email)) {
		throw new Error("Invalid email format");
	}

	// Validate password
	const passwordValidation = validatePassword(userData.password);
	if (!passwordValidation.isValid) {
		throw new Error(passwordValidation.message!);
	}

	// Check if user already exists
	const existingUser = await User.findOne({ email: userData.email });
	if (existingUser) {
		throw new Error("User with this email already exists");
	}

	try {
		// Hash password
		const saltRounds = 12;
		const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

		// Create user
		const newUser = new User({
			name: userData.name.trim(),
			email: userData.email.toLowerCase().trim(),
			password: hashedPassword,
			role: "regular", // Default role
		});

		const savedUser = await newUser.save();

		// Generate token
		const token = generateToken(
			savedUser._id.toString(),
			savedUser.email,
			savedUser.role
		);

		return {
			user: savedUser,
			token,
		};
	} catch (error: any) {
		if (error.code === 11000) {
			throw new Error("User with this email already exists");
		}
		throw new Error("Failed to create user");
	}
};

const login = async (credentials: LoginCredentials) => {
	// Validate required fields
	const validation = validateRequiredFields(credentials, [
		"email",
		"password",
	]);
	if (!validation.isValid) {
		throw new Error(
			`Missing required fields: ${validation.missingFields?.join(", ")}`
		);
	}

	// Validate email format
	if (!validateEmail(credentials.email)) {
		throw new Error("Invalid email format");
	}

	try {
		// Find user and include password for verification
		const user = await User.findOne({
			email: credentials.email.toLowerCase(),
		}).select("+password");
		if (!user) {
			throw new Error("Invalid email or password");
		}

		// Verify password
		const isPasswordValid = await bcrypt.compare(
			credentials.password,
			user.password
		);
		if (!isPasswordValid) {
			throw new Error("Invalid email or password");
		}

		// Generate token
		const token = generateToken(user._id.toString(), user.email, user.role);

		// Remove password from user object
		const { password, ...userWithoutPassword } = user.toObject();

		return {
			user: userWithoutPassword,
			token,
		};
	} catch (error: any) {
		if (error.message === "Invalid email or password") {
			throw error;
		}
		throw new Error("Login failed");
	}
};

const getProfile = async (userId: string) => {
	try {
		const user = await User.findById(userId);
		if (!user) {
			throw new Error("User not found");
		}

		return user;
	} catch (error: any) {
		if (error.message === "User not found") {
			throw error;
		}
		throw new Error("Failed to fetch user profile");
	}
};

const updateProfile = async (userId: string, updateData: Partial<IUser>) => {
	try {
		// Remove sensitive fields that shouldn't be updated directly
		const { password, role, ...safeUpdateData } = updateData;

		// Validate email if being updated
		if (safeUpdateData.email) {
			if (!validateEmail(safeUpdateData.email)) {
				throw new Error("Invalid email format");
			}

			// Check if email is already taken by another user
			const existingUser = await User.findOne({
				email: safeUpdateData.email,
				_id: { $ne: userId },
			});
			if (existingUser) {
				throw new Error("Email is already taken by another user");
			}
		}

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			safeUpdateData,
			{ new: true, runValidators: true }
		);

		if (!updatedUser) {
			throw new Error("User not found");
		}

		return updatedUser;
	} catch (error: any) {
		if (
			error.message === "User not found" ||
			error.message === "Email is already taken by another user" ||
			error.message === "Invalid email format"
		) {
			throw error;
		}
		throw new Error("Failed to update profile");
	}
};

const changePassword = async (
	userId: string,
	currentPassword: string,
	newPassword: string
) => {
	try {
		// Validate new password
		const passwordValidation = validatePassword(newPassword);
		if (!passwordValidation.isValid) {
			throw new Error(passwordValidation.message!);
		}

		// Find user with password
		const user = await User.findById(userId).select("+password");
		if (!user) {
			throw new Error("User not found");
		}

		// Verify current password
		const isCurrentPasswordValid = await bcrypt.compare(
			currentPassword,
			user.password
		);
		if (!isCurrentPasswordValid) {
			throw new Error("Current password is incorrect");
		}

		// Hash new password
		const saltRounds = 12;
		const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

		// Update password
		await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

		return { message: "Password changed successfully" };
	} catch (error: any) {
		if (
			error.message === "User not found" ||
			error.message === "Current password is incorrect" ||
			error.message.includes("Password must be")
		) {
			throw error;
		}
		throw new Error("Failed to change password");
	}
};

export const AuthServices = {
	register,
	login,
	getProfile,
	updateProfile,
	changePassword,
};
