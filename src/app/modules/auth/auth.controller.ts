import { Request, Response } from "express";
import { AuthServices } from "./auth.service";

const register = async (req: Request, res: Response) => {
	try {
		const result = await AuthServices.register(req.body);

		res.status(201).json({
			success: true,
			message: "User registered successfully",
			data: result,
		});
	} catch (error: any) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

const login = async (req: Request, res: Response) => {
	try {
		const result = await AuthServices.login(req.body);

		res.status(200).json({
			success: true,
			message: "Login successful",
			data: result,
		});
	} catch (error: any) {
		res.status(401).json({
			success: false,
			message: error.message,
		});
	}
};

const getProfile = async (req: Request, res: Response) => {
	try {
		const result = await AuthServices.getProfile(req.user.userId);

		res.status(200).json({
			success: true,
			message: "Profile retrieved successfully",
			data: result,
		});
	} catch (error: any) {
		res.status(404).json({
			success: false,
			message: error.message,
		});
	}
};

const updateProfile = async (req: Request, res: Response) => {
	try {
		const result = await AuthServices.updateProfile(
			req.user.userId,
			req.body
		);

		res.status(200).json({
			success: true,
			message: "Profile updated successfully",
			data: result,
		});
	} catch (error: any) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

const changePassword = async (req: Request, res: Response) => {
	try {
		const { currentPassword, newPassword } = req.body;
		const result = await AuthServices.changePassword(
			req.user.userId,
			currentPassword,
			newPassword
		);

		res.status(200).json({
			success: true,
			message: "Password changed successfully",
			data: result,
		});
	} catch (error: any) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

export const AuthControllers = {
	register,
	login,
	getProfile,
	updateProfile,
	changePassword,
};
